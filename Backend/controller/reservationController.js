const { 
  getBookReservations, 
  createReservation, 
  getAllReservations, 
  updateReservationStatus, 
  deleteReservation, 
  getReservationsByUserId 
} = require('../models/reservationModel');
const AppError = require('../utils/appError');

exports.createReservation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;
    // Naudojame dabartinę datą, jei returnDate nepateikta
    const reservationDate = new Date().toISOString().split('T')[0];
    if (!bookId) {
      return res.status(400).json({ status: 'fail', message: 'Reikia nurodyti knygos ID' });
    }
    const reservation = await createReservation(userId, bookId, reservationDate);
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

exports.updateReservationStatus = async (req, res, next) => {
  try {
    const reservationId = parseInt(req.params.reservationId);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ status: 'fail', message: 'Reikia nurodyti statusą' });
    }
    const updatedReservation = await updateReservationStatus(reservationId, status);
    if (!updatedReservation) {
      return res.status(404).json({ status: 'fail', message: 'Rezervacija nerasta' });
    }
    res.status(200).json({ status: 'success', data: updatedReservation });
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
