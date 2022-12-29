const knex = require('../database')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index/Get
  async index(req, res) {
    const classes = await knex
      .select('classes.id as class_id', 'classes.name as class_name')
      .from('favorite_classes')
      .innerJoin('classes', 'classes.id', 'favorite_classes.class_id')
      .where({
        'favorite_classes.user_id': req.user.id,
        'classes.user_id': req.user.id,
        'classes.status': statuses.ACTIVE
      })
      .orderBy(['classes.name'])

    return res.send(classes)
  },

  // Create
  async create(req, res) {
    const { class_id } = req.body

    try {
      await knex('favorite_classes').insert({
        class_id,
        user_id: req.user.id
      })

      return res.status(200).json({
        success: true,
        message: 'favorite_classes.create.ok'
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: 'favorite_classes.create.nok'
      })
    }
  },

  // DELETE
  async delete(req, res) {
    const { class_id } = req.params

    try {
      await knex('favorite_classes')
        .where({ class_id, user_id: req.user.id })
        .del()

      return res.status(200).send({
        success: true,
        message: 'favorite_classes.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'favorite_classes.delete.nok'
      })
    }
  }
}
