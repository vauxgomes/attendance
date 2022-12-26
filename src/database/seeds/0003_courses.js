exports.seed = async function (knex) {
  console.log('Seed: COURSES')

  if (await knex.select('id').from('courses').first()) {
    console.log(' - ABORTED: Table has already being populated')
    return
  }

  await knex('courses').insert([{ name: 'Course 1' }, { name: 'Course 2' }])
}
