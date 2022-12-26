exports.seed = async function (knex) {
  console.log('Seed: SUBJECTS')

  if (await knex.select('id').from('subjects').first()) {
    console.log(' - ABORTED: Table has already being populated')
    return
  }

  const course = await knex.select('id').from('courses').first()

  if (!course) {
    console.log(' - ABORTED: Table Courses does not have any row')
    return
  }

  await knex('subjects').insert([
    { course_id: course.id, name: 'Subject 1' },
    { course_id: course.id, name: 'Subject 2' }
  ])
}
