const knex = require('../database')
const { roles } = require('../middlewares/roles')

// Controller
module.exports = {
  // Index/Get
  async index(req, res) {
    const { subject_id } = req.params
    const { page, visible = true } = req.query

    const query = knex
      .select(
        'classes.id',
        'classes.name',
        'classes.visible',
        'subjects.id as subject_id',
        'subjects.name as subject_name'
      )
      .from('classes')
      .innerJoin('subjects', 'subjects.id', 'classes.subject_id')
      .where({ subject_id, visible })

    if (!!page) {
      query
        .limit(Number(process.env.PAGE_SIZE))
        .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
    }

    query.orderBy(['classes.name']).then((subjects) => {
      res.send(subjects)
    })
  },

  // Create
  async create(req, res) {
    const { subject_id } = req.params
    const { name } = req.body

    try {
      let [id] = await knex('classes')
        .insert({
          subject_id,
          name
        })
        .returning('id')

      // Safety
      id = typeof id === 'object' ? id.id : id

      return res.json({ id })
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'classes.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { subject_id, id } = req.params

    let { name } = req.body

    try {
      await knex('classes').update({ name }).where({ id, subject_id })

      return res.status(200).send({
        success: true,
        message: 'classes.update.ok'
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        success: false,
        message: 'classes.update.nok'
      })
    }
  },

  // DELETE
  async delete(req, res) {
    const { subject_id, id } = req.params

    try {
      await knex('classes').where({ id, subject_id }).del()

      return res.status(200).send({
        success: true,
        message: 'classes.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'classes.delete.nok'
      })
    }
  }
}
