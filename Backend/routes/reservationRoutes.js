const express = require('express');
const { protect, allowAccessTo } = require('../controller/authController');
const {
  createReservation,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  getMyReservations
} = require('../controller/reservationController');

const router = express.Router();

router.route('/')
  .post(protect, allowAccessTo('admin', 'user'), createReservation)
  .get(protect, allowAccessTo('admin'), getAllReservations);

router.route('/:id')
  .put(protect, allowAccessTo('admin', 'user'), updateReservationStatus)
  .delete(protect, allowAccessTo('admin', 'user'), deleteReservation);

router.route('/my')
  .get(protect, allowAccessTo('admin', 'user'), getMyReservations);

module.exports = router;
