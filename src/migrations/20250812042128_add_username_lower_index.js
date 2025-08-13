export function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('username_lower', 100).after('username');
  })
  .then(() => knex.raw('UPDATE users SET username_lower = LOWER(username)'))
  .then(() => knex.raw('ALTER TABLE users ADD INDEX idx_username_lower (username_lower)'));
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropIndex('username_lower', 'idx_username_lower');
    table.dropColumn('username_lower');
  });
}
