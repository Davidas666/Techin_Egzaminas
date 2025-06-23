const { sql } = require('../dbConnection');

exports.getBookReservations = async (book_id) => {
  const reservations = await sql`
    SELECT * FROM reservations WHERE book_id = ${book_id} ORDER BY reservation_date ASC
  `;
  return reservations;
};

exports.createReservation = async (userId, bookId) => {
  // Patikriname, ar knyga jau rezervuota
  const [existing] = await sql`
    SELECT * FROM reservations WHERE book_id = ${bookId}
  `;
  if (existing) {
    const error = new Error('Ši knyga jau rezervuota.');
    error.code = 'BOOK_ALREADY_RESERVED';
    throw error;
  }
  // Automatiškai nustatome grąžinimo datą +7 dienos nuo šiandien
  const today = new Date();
  const returnDate = new Date(today);
  returnDate.setDate(today.getDate() + 7);
  const returnDateStr = returnDate.toISOString().split('T')[0];
  const [reservation] = await sql`
    INSERT INTO reservations (user_id, book_id, reservation_date, return_date, extension_count)
    VALUES (${userId}, ${bookId}, ${today.toISOString().split('T')[0]}, ${returnDateStr}, 0)
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
