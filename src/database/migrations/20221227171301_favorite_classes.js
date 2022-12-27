exports.up = function (knex) {
  console.log('Migration: CLASS STUDENTS')

  return knex.schema.createTable('favorite_classes', function (table) {
    table.integer('user_id').unsigned().notNullable()
    table.foreign('user_id').references('users.id').onDelete('CASCADE')

    table.integer('class_id').unsigned().notNullable()
    table.foreign('class_id').references('classes.id').onDelete('CASCADE')

    table.unique(['class_id', 'user_id'])

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('favorite_classes')
}
