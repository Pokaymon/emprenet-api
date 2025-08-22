export function up(knex) {
  return knex.schema.table('users', (table) => {
    table.string('avatar', 255).nullable().after('email_verified');
  });
}

export function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('avatar');
  });
}
