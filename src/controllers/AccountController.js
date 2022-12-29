const knex = require('../database')
const jwt = require('jsonwebtoken')

const { compareSync } = require('bcrypt')

// Controller
module.exports = {
  async register(req, res) {
    try {
      const { username, password } = req.body

      const user = await knex
        .select('id', 'name', 'password', 'role', 'status')
        .from('users')
        .where('username', username)
        .first()

      if (compareSync(password, user.password)) {
        // Generating token
        const token = jwt.sign(
          {
            id: user.id,
            code: user.code,
            name: user.name,
            role: user.role,
            status: user.status
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: process.env.TOKEN_LIFE
          }
        )

        return res.json({
          success: true,
          message: 'users.registration.ok',
          token
        })
      } else {
        return res.json({
          success: false,
          message: 'users.registration.nok'
        })
      }
    } catch (err) {
      // console.log(err)
      return res.status(400).json({
        success: false,
        message: 'users.registration.error'
      })
    }
  }
}
