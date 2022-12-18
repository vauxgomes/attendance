const knex = require('../database')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { page } = req.query

    const query = knex.select().from('courses')

    if (!!page) {
      query
        .limit(Number(process.env.PAGE_SIZE))
        .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
    }

    query.orderBy(['name']).then((courses) => res.send(courses))
  },

  // Create
  async create(req, res) {
    try {
      let { name } = req.body

      let [id] = await knex('courses').insert({ name }).returning('id')

      // Safety
      id = typeof id === 'object' ? id.id : id

      return res.json({ id })
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'courses.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { id } = req.params
    let { name } = req.body

    try {
      await knex('courses').update({ name }).where({ id })

      return res.status(200).send({
        success: true,
        message: 'courses.update.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'courses.update.nok'
      })
    }
  },

  // Delete
  async delete(req, res) {
    const { id } = req.params

    try {
      await knex('courses').where('id', id).del()

      return res.status(200).send({
        success: true,
        message: 'courses.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'courses.delete.nok'
      })
    }
  }
}
