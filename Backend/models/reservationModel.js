const { sql } = require('../dbConnection');

exports.getBookReservations = async (book_id) => {
  const reservations = await sql`
    SELECT * FROM reservations WHERE book_id = ${book_id} ORDER BY reservation_date ASC
  `;
  return reservations;
};

exports.createReservation = async (userId, bookId, returnDate) => {
  // Patikriname, ar knyga jau rezervuota
  const [existing] = await sql`
    SELECT * FROM reservations WHERE book_id = ${bookId}
  `;
  if (existing) {
    const error = new Error('Ši knyga jau rezervuota.');
    error.code = 'BOOK_ALREADY_RESERVED';
    throw error;
  }
  const [reservation] = await sql`
    INSERT INTO reservations (user_id, book_id, reservation_date)
    VALUES (${userId}, ${bookId}, ${returnDate})
    RETURNING *
  `;
  return reservation;
};

exports.getAllReservations = async () => {
  const reservations = await sql`
    SELECT * FROM reservations ORDER BY reservation_date DESC
  `;
  return reservations;
};

exports.updateReservationStatus = async (reservationId, status) => {
  const [updated] = await sql`
    UPDATE reservations SET status = ${status} WHERE id = ${reservationId} RETURNING *
  `;
  return updated;
};

exports.deleteReservation = async (reservationId) => {
  const [deleted] = await sql`
    DELETE FROM reservations WHERE id = ${reservationId} RETURNING *
  `;
  return deleted;
};

exports.getReservationsByUserId = async (userId) => {
  const reservations = await sql`
    SELECT r.*, b.title, b.author, b.isbn, b.description, b.image_url
    FROM reservations r
    JOIN books b ON r.book_id = b.id
    WHERE r.user_id = ${userId}
    ORDER BY r.reservation_date DESC
  `;
  return reservations;
};
