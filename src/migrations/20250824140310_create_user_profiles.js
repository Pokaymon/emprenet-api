export function up(knex) {
  return knex.schema.createTable('user_profiles', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('CASCADE');

    table.integer('publicaciones').defaultTo(0);
    table.integer('seguidores').defaultTo(0);
    table.integer('seguidos').defaultTo(0);
    table.text('biografia').nullable();

    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('user_profiles');
}
