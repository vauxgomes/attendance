exports.up = function (knex) {
  console.log('Migration: ATTENDANCES')

  return knex.schema.createTable('attendances', function (table) {
    table.increments('id').primary()

    table.integer('class_id').unsigned().notNullable()
    table.foreign('class_id').references('classes.id').onDelete('CASCADE')

    table.integer('student_id').unsigned().notNullable()
    table.foreign('student_id').references('students.id').onDelete('CASCADE')

    table.date('date').notNullable()
    table.boolean('attended').notNullable()

    table.unique(['class_id', 'student_id', 'date'])

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('attendances')
}
