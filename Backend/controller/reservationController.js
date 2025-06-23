const { getBookReservations, createReservation, getAllReservations, updateReservationStatus, deleteReservation, getReservationsByUserId } = require('../models/reservationModel');
const AppError = require('../utils/appError');

exports.createReservation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookId, returnDate } = req.body;
    if (!bookId) {
      return res.status(400).json({ status: 'fail', message: 'Reikia nurodyti knygos ID' });
    }
    const reservation = await createReservation(userId, bookId, returnDate);
    res.status(201).json({ status: 'success', data: reservation });
  } catch (error) {
    next(error);
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await getAllReservations();
    res.status(200).json({ status: 'success', data: reservations });
  } catch (error) {
    next(error);
  }
};

exports.getMyReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reservations = await getReservationsByUserId(userId);
    res.status(200).json({ status: 'success', data: reservations });
  } catch (error) {
    next(error);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservationId = parseInt(req.params.id);
    const userId = req.user.id;
    // Patikriname, ar rezervacija priklauso šiam vartotojui
    const [reservation] = await require('../dbConnection').sql`
      SELECT * FROM reservations WHERE id = ${reservationId}
    `;
    if (!reservation) {
      return res.status(404).json({ status: 'fail', message: 'Rezervacija nerasta' });
    }
    if (reservation.user_id !== userId) {
      return res.status(403).json({ status: 'fail', message: 'Neturite teisės trinti šios rezervacijos' });
    }
    const deletedReservation = await require('../models/reservationModel').deleteReservation(reservationId);
    res.status(200).json({ status: 'success', data: deletedReservation });
  } catch (error) {
    next(error);
  }
};

// Pratęsimo endpointas
exports.extendReservation = async (req, res, next) => {
  try {
    const reservationId = parseInt(req.params.id);
    const userId = req.user.id;
    const [reservation] = await require('../dbConnection').sql`
      SELECT * FROM reservations WHERE id = ${reservationId}
    `;
    if (!reservation) {
      return res.status(404).json({ status: 'fail', message: 'Rezervacija nerasta' });
    }
    if (reservation.user_id !== userId) {
      return res.status(403).json({ status: 'fail', message: 'Neturite teisės pratęsti šios rezervacijos' });
    }
    if (reservation.extension_count >= 2) {
      return res.status(400).json({ status: 'fail', message: 'Pratęsti galima tik 2 kartus' });
    }
    const newReturnDate = new Date(reservation.return_date);
    newReturnDate.setDate(newReturnDate.getDate() + 7);
    const [updated] = await require('../dbConnection').sql`
      UPDATE reservations SET return_date = ${newReturnDate.toISOString().split('T')[0]}, extension_count = extension_count + 1 WHERE id = ${reservationId} RETURNING *
    `;
    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};
