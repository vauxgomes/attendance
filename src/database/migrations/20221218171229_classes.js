exports.up = function (knex) {
  console.log('Migration: CLASSES')

  return knex.schema.createTable('classes', function (table) {
    table.increments('id').primary()

    table.integer('subject_id').unsigned().notNullable()
    table.foreign('subject_id').references('subjects.id').onDelete('CASCADE')

    table.string('name', 100).notNullable()
    table.boolean('visible').notNullable().defaultTo(true)

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('classes')
}
