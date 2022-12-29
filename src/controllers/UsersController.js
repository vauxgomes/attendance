const knex = require('../database')
const bcrypt = require('bcrypt')

const { roles } = require('../middleware/roles')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index
  async index(req, res) {
    const { page = 1 } = req.query

    const users = await knex
      .select('id', 'name', 'code', 'username', 'role', 'status')
      .from('users')
      .limit(process.env.PAGE_SIZE)
      .offset((Math.max(1, page) - 1) * process.env.PAGE_SIZE)
      .orderBy(['name', 'code'])

    return res.send(users)
  },

  // List
  async list(req, res) {
    const users = await knex
      .select('id', 'name')
      .from('users')
      .where({ role: roles.USER, status: statuses.ACTIVE })
      .orderBy(['name'])

    return res.send(users)
  },

  // Create
  async create(req, res) {
    try {
      let {
        name,
        code,
        username,
        password,
        role = roles.USER,
        status = statuses.PENDING
      } = req.body

      // Preparing password
      password = bcrypt.hashSync(password, Number(process.env.SALT))

      const [user] = await knex('users')
        .insert({
          name,
          code,
          username,
          password,
          role,
          status
        })
        .returning(['id', 'name', 'code', 'username', 'role', 'status'])

      return res.json(user)
    } catch (err) {
      // console.log(err)
      return res.status(400).json({
        success: false,
        message: 'users.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { id } = req.params
    let { name, code, username, password, role, status } = req.body

    // Preparing password
    if (password) {
      password = bcrypt.hashSync(password, Number(process.env.SALT))
    }

    try {
      await knex('users')
        .update({
          name,
          code,
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
