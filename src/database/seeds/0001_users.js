const { roles } = require('../../middleware/roles')
const { hashSync } = require('bcrypt')
const dotenv = require('dotenv')
const { statuses } = require('../../middleware/statuses')

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
      code: '007',
      username: 'root',
      password: hashSync('root@attendance', SALT),
      role: roles.ROOT,
      status: statuses.ACTIVE
    },
    {
      name: 'User',
      code: '001',
      username: 'user',
      password: hashSync('user@attendance', SALT),
      role: roles.USER,
      status: statuses.ACTIVE
    }
  ])
}
