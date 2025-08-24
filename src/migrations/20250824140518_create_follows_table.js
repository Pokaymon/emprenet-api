export function up(knex) {
  return knex.schema.createTable('follows', (table) => {
    table.increments('id').primary();
    table.integer('follower_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');
    table.integer('followed_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.unique(['follower_id', 'followed_id']);
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('follows');
}
