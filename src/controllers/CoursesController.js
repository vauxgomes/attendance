const knex = require('../database')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { page = 1 } = req.query

    const courses = await knex
      .select()
      .from('courses')
      .limit(Number(process.env.PAGE_SIZE))
      .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
      .orderBy(['name'])

    return res.send(courses)
  },

  // List
  async list(req, res) {
    const courses = await knex
      .select('id', 'name')
      .from('courses')
      .where({ status: statuses.ACTIVE })
      .orderBy(['name'])

    return res.send(courses)
  },

  // Create
  async create(req, res) {
    try {
      const { name } = req.body
      const [course] = await knex('courses').insert({ name }).returning('*')

      return res.json(course)
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
    const { name, status } = req.body

    try {
      await knex('courses').update({ name, status }).where({ id })

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
