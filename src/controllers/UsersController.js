const knex = require('../database')
const bcrypt = require('bcrypt')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { page = 1 } = req.query

    const query = knex
      .select('id', 'name', 'username', 'role', 'status')
      .from('users')
      .orderBy('name')

    query
      .limit(process.env.PAGE_SIZE)
      .offset((Math.max(1, page) - 1) * process.env.PAGE_SIZE)
      .then((users) => res.send(users))
  },

  // Show
  async show(req, res) {
    const { id = req.user.id } = req.params

    const user = await knex
      .select('id', 'username', 'role')
      .from('users')
      .where({ 'users.id': id })
      .first()

    return res.json(user)
  },

  // Create as Middleware
  async create(req, res, next) {
    try {
      let { name, username, password, role, status } = req.body

      // Preparing password
      password = bcrypt.hashSync(password, Number(process.env.SALT))

      let [id] = await knex('users')
        .insert({
          name,
          username,
          password,
          role,
          status
        })
        .returning('id')

      // Safety
      id = typeof id === 'object' ? id.id : id

      return res.json({ id })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: 'users.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { id } = req.params
    let { campus_id, username, password, role, status } = req.body

    if (password) {
      password = bcrypt.hashSync(password, Number(process.env.SALT))
    }

    try {
      await knex('users')
        .update({
          username,
          password,
          role,
          status
        })
        .where({ id })

      return res.status(200).send({
        success: true,
        message: 'users.update.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'users.update.nok'
      })
    }
  },

  // Delete
  async delete(req, res) {
    const { id } = req.params

    try {
      await knex('users').where('id', id).del()

      return res.status(200).send({
        success: true,
        message: 'users.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'users.delete.nok'
      })
    }
  }
}
