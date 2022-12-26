exports.seed = async function (knex) {
  console.log('Seed: STUDENTS')

  if (await knex.select('id').from('students').first()) {
    console.log(' - ABORTED: Table has already being populated')
    return
  }

  await knex('students').insert([
    {
      code: '2023143000001',
      name: 'Student 1'
    },
    {
      code: '2023143000002',
      name: 'Student 2'
    }
  ])
}
