export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username', 100).notNullable().unique();
    table.string('email', 190).notNullable().unique();
    table.string('password', 255);
    table.string('auth_provider', 50).notNullable().defaultTo('local');
    table.boolean('email_verified').defaultTo(false);
    table.string('verification_token', 255).nullable();
    table.dateTime('verification_token_expires_at').nullable();
    table.timestamp('last_verification_email_sent_at').nullable();
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('users');
}
