exports.up = function (knex) {
  console.log('Migration: CLASSE STUDENTS')

  return knex.schema.createTable('class_students', function (table) {
    table.integer('class_id').unsigned().notNullable()
    table.foreign('class_id').references('classes.id').onDelete('CASCADE')

    table.integer('student_id').unsigned().notNullable()
    table.foreign('student_id').references('students.id').onDelete('CASCADE')

    table.unique(['class_id', 'student_id'])

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('class_students')
}
