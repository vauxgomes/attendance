const knex = require('../database')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { course_id } = req.params
    const { page = 1 } = req.query

    const subjects = await knex
      .select(
        'subjects.id',
        'subjects.name',
        'subjects.status',
        'subjects.course_id',
        'courses.name as course_name',
        'subjects.created_at',
        'subjects.updated_at'
      )
      .from('subjects')
      .innerJoin('courses', 'courses.id', 'subjects.course_id')
      .where({ course_id })
      .limit(Number(process.env.PAGE_SIZE))
      .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
      .orderBy(['subjects.name'])

    return res.send(subjects)
  },

  // List
  async list(req, res) {
    const subjects = await knex
      .select('subjects.id', 'subjects.name')
      .from('subjects')
      .where({ status: statuses.ACTIVE })
      .orderBy(['subjects.name'])

    return res.send(subjects)
  },

  // Create
  async create(req, res) {
    const { course_id } = req.params
    const { name } = req.body

    try {
      const [subject] = await knex('subjects')
        .insert({
          course_id,
          name,
          status: statuses.ACTIVE
        })
        .returning('*')

      return res.json(subject)
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
    const { name, status } = req.body

    try {
      await knex('subjects').update({ name, status }).where({ id, course_id })

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
