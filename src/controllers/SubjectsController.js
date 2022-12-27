const knex = require('../database')
const { roles } = require('../middlewares/roles')

// Controller
module.exports = {
  // Index/Get
  async index(req, res) {
    const { course_id } = req.params
    const { page } = req.query

    const query = knex
      .select(
        'subjects.id',
        'subjects.name',
        'subjects.course_id',
        'courses.name as course_name'
      )
      .from('subjects')
      .innerJoin('courses', 'courses.id', 'subjects.course_id')
      .where({ course_id })

    if (!!page) {
      query
        .limit(Number(process.env.PAGE_SIZE))
        .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
    }

    query.orderBy(['subjects.name']).then((subjects) => {
      res.send(subjects)
    })
  },

  // Create
  async create(req, res) {
    const { course_id } = req.params
    const { name } = req.body

    try {
      let [id] = await knex('subjects')
        .insert({
          course_id,
          name
        })
        .returning('id')

      // Safety
      id = typeof id === 'object' ? id.id : id

      return res.json({ id })
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'subjects.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { course_id, id } = req.params

    const { name } = req.body

    try {
      await knex('subjects').update({ name }).where({ id, course_id })

      return res.status(200).send({
        success: true,
        message: 'subjects.update.ok'
      })
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        success: false,
        message: 'subjects.update.nok'
      })
    }
  },

  // DELETE
  async delete(req, res) {
    const { course_id, id } = req.params

    try {
      await knex('subjects').where({ id, course_id }).del()

      return res.status(200).send({
        success: true,
        message: 'subjects,delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'subjects.delete.nok'
      })
    }
  }
}
