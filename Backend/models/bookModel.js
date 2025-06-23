const { sql } = require("../dbConnection")


exports.getAllBooks = async (categoryId, search) => {
    let query = `SELECT id, title, author, image_url, published_date, isbn, description, category_id FROM books`;
    const params = [];
    if (categoryId) {
        params.push(`category_id = $${params.length + 1}`);
    }
    if (search) {
        params.push(`(title ILIKE $${params.length + 1} OR author ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`);
    }
    if (params.length) {
        query += ' WHERE ' + params.join(' AND ');
    }
    const values = [];
    if (categoryId) values.push(categoryId);
    if (search) values.push(`%${search}%`);
    const books = await sql.unsafe(query, values);
    return books;
};

exports.getBookById = async (id) => {
    const tour = await sql`
        SELECT 
            id,
            title, 
            author, 
            published_date,
            isbn,
            image_url
        FROM books
        WHERE id = ${id}
    `;
    return tour[0]; 
};

exports.updateBook = async (id, bookData) => {
    console.log('updateBook data:', bookData); // DEBUG
    const [updatedBook] = await sql`
        UPDATE books SET
            title = ${bookData.title},
            author = ${bookData.author},
            image_url = ${bookData.image_url},
            published_date = ${bookData.published_date || null},
            isbn = ${bookData.isbn},
            description = ${bookData.description},
            category_id = ${bookData.category_id || null}
        WHERE id = ${id}
        RETURNING *
    `;
    return updatedBook;
};

exports.deleteBook = async (id) => {
    const [deletedBook] = await sql`
        DELETE FROM books
        WHERE id = ${id}
        RETURNING *
    `;
    return deletedBook;
};

exports.createBook = async (bookData) => {
  const [book] = await sql`
    INSERT INTO books (title, author, isbn, description, image_url, published_date, category_id)
    VALUES (
      ${bookData.title},
      ${bookData.author},
      ${bookData.isbn || null},
      ${bookData.description || null},
      ${bookData.image_url || null},
      ${bookData.published_date || null},
      ${bookData.category_id || null}
    )
    RETURNING *
  `;
  return book;
};


