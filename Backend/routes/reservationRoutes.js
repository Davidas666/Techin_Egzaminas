const express = require('express');
const { protect, allowAccessTo } = require('../controller/authController');
const {
  createReservation,
  getAllReservations,
  getMyReservations,
  deleteReservation,
  extendReservation
} = require('../controller/reservationController');
const router = express.Router();

router.post('/', protect, allowAccessTo('user'), createReservation);
router.get('/', protect, getAllReservations);
router.get('/my', protect, getMyReservations);
router.delete('/:id', protect, deleteReservation);
router.patch('/:id/extend', protect, extendReservation);

module.exports = router;
