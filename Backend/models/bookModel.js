const { sql } = require("../dbConnection")


exports.getAllBooks = async (categoryId) => {
    if (categoryId) {
        const books = await sql`
            SELECT 
                id,
                title, 
                author, 
                image_url, 
                published_date,
                isbn,
                description
            FROM books WHERE category_id = ${categoryId}
        `;
        return books;
    } else {
        const books = await sql`
            SELECT 
                id,
                title, 
                author, 
                image_url, 
                published_date,
                isbn,
                description
            FROM books
        `;
        return books;
    }
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


