const { sql } = require("../dbConnection")


exports.getAllBooks = async () => {
    const tourList = await sql`
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
    return tourList;
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
    const [updatedBook] = await sql`
        UPDATE books SET
            title = ${bookData.title},
            author = ${bookData.author},
            image_url = ${bookData.image_url},
            published_date = ${bookData.published_date},
            isbn = ${bookData.isbn},
            genre = ${bookData.genre},
            description = ${bookData.description},
            available_copies = ${bookData.available_copies}
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
    INSERT INTO books (title, author, isbn, description, image_url, published_date)
    VALUES (
      ${bookData.title},
      ${bookData.author},
      ${bookData.isbn || null},
      ${bookData.description || null},
      ${bookData.image_url || null},
      ${bookData.published_date || null}
    )
    RETURNING *
  `;
  return book;
};


