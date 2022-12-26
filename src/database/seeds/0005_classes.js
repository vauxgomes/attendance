exports.seed = async function (knex) {
  console.log('Seed: CLASSES')

  if (await knex.select('id').from('classes').first()) {
    console.log(' - ABORTED: Table has already being populated')
    return
  }

  const subject = await knex.select('id').from('subjects').first()

  if (!subject) {
    console.log(' - ABORTED: Table Subjects does not have any row')
    return
  }

  await knex('classes').insert([
    { subject_id: subject.id, name: 'Class 1', visible: true },
    { subject_id: subject.id, name: 'Class 2', visible: false }
  ])
}
