const knex = require('../database')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { page = 1 } = req.query

    const students = await knex
      .select()
      .from('students')
      .limit(process.env.PAGE_SIZE)
      .offset((Math.max(1, page) - 1) * process.env.PAGE_SIZE)
      .orderBy(['name', 'code'])

    return res.send(students)
  },

  // List
  async list(req, res) {
    const students = await knex
      .select('id', 'name', 'code')
      .from('students')
      .where({ status: statuses.ACTIVE })
      .orderBy(['name', 'code'])

    return res.send(students)
  },

  // Create
  async create(req, res) {
    try {
      const { code, name } = req.body

      const [student] = await knex('students')
        .insert({
          code,
          name
        })
        .returning('*')

      return res.json(student)
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'students.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { id } = req.params
    const { code, name } = req.body

    try {
      await knex('students')
        .update({
          code,
          name
        })
        .where({ id })

      return res.status(200).send({
        success: true,
        message: 'students.update.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'students.update.nok'
      })
    }
  },

  // Delete
  async delete(req, res) {
    const { id } = req.params

    try {
      await knex('students').where('id', id).del()

      return res.status(200).send({
        success: true,
        message: 'students.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'students.delete.nok'
      })
    }
  }
}
