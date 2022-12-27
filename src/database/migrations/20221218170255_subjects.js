exports.up = function (knex) {
  console.log('Migration: SUBJECTS')

  return knex.schema.createTable('subjects', function (table) {
    table.increments('id').primary()

    table.integer('course_id').unsigned().notNullable()
    table.foreign('course_id').references('courses.id').onDelete('CASCADE')

    table.string('name', 100).notNullable()
    table
      .enu('status', ['ACTIVE', 'INACTIVE'])
      .notNullable()
      .defaultTo('ACTIVE')

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('subjects')
}
