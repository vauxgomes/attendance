const { roles } = require('../../middlewares/roles')
const { hashSync } = require('bcrypt')
const dotenv = require('dotenv')

dotenv.config()
const SALT = Number(process.env.SALT)

exports.seed = async function (knex) {
  console.log('Seed: USERS')

  if (await knex.select('id').from('users').first()) {
    console.log(' - ABORTED: Table has already being populated')
    return
  }

  await knex('users').insert([
    {
      name: 'Root',
      username: 'root',
      password: hashSync('root@attendance', SALT),
      role: roles.ROOT
    },
    {
      name: 'User',
      username: 'user',
      password: hashSync('user@attendance', SALT),
      role: roles.USER
    }
  ])
}
