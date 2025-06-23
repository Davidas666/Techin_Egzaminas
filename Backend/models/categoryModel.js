const { sql } = require('../dbConnection');

exports.getAllCategories = async () => {
  const categories = await sql`SELECT * FROM categories ORDER BY name`;
  return categories;
};

exports.createCategory = async (name) => {
  const [category] = await sql`
    INSERT INTO categories (name) VALUES (${name}) RETURNING *
  `;
  return category;
};

exports.deleteCategory = async (id) => {
  await sql`DELETE FROM categories WHERE id = ${id}`;
};
