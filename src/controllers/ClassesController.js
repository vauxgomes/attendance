const knex = require('../database')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { subject_id } = req.params
    const { page = 1 } = req.query

    const classes = await knex
      .select(
        'classes.id',
        'classes.name',
        'classes.status',
        'subjects.id as subject_id',
        'subjects.name as subject_name',
        'users.id as user_id',
        'users.name as user_name'
      )
      .from('classes')
      .innerJoin('subjects', 'subjects.id', 'classes.subject_id')
      .innerJoin('users', 'users.id', 'classes.user_id')
      .where({ subject_id })
      .limit(Number(process.env.PAGE_SIZE))
      .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
      .orderBy(['classes.name'])

    return res.send(classes)
  },

  // Index by user
  async indexByUser(req, res) {
    const { page = 1 } = req.query

    const classes = await knex
      .select(
        'classes.id',
        'classes.name',
        'classes.status',
        'subjects.id as subject_id',
        'subjects.name as subject_name',
        'users.id as user_id',
        'users.name as user_name',
        'favorite_classes.class_id as favorite'
      )
      .from('classes')
      .innerJoin('subjects', 'subjects.id', 'classes.subject_id')
      .innerJoin('users', 'users.id', 'classes.user_id')
      .leftJoin('favorite_classes', 'favorite_classes.class_id', 'classes.id')
      .where({
        'users.id': req.user.id,
        'classes.status': statuses.ACTIVE
      })
      .limit(Number(process.env.PAGE_SIZE))
      .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
      .orderBy(['classes.name'])

    return res.send(classes)
  },

  // Create
  async create(req, res) {
    const { subject_id } = req.params
    const { user_id, name, status = statuses.ACTIVE } = req.body

    try {
      const [class_] = await knex('classes')
        .insert({
          subject_id,
          user_id,
          name,
          status
        })
        .returning('*')

      return res.json(class_)
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
    const { user_id, name, status } = req.body

    try {
      await knex('classes')
        .update({ user_id, name, status })
        .where({ id, subject_id })

      return res.status(200).send({
        success: true,
        message: 'classes.update.ok'
      })
    } catch (err) {
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
      await knex('classes').where({ subject_id, id }).del()

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
