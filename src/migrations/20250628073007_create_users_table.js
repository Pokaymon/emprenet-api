export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 100).notNullable();
    table.string('email', 190).notNullable().unique();
    table.string('password', 255);
    table.boolean('email_verified').defaultTo(false);
    table.string('verification_token', 255).nullable();
    table.timestamps(true, true); // created_at y updated_at con default a NOW()
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
