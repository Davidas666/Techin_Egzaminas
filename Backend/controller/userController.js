const { sql } = require('../dbConnection');
const { getAllUsers, deleteUser, updateUserRole, updateUserUsername } = require('../models/userModel');

// Grąžina visas ekskursijas, į kurias useris užsirašė
exports.getMyTours = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const registrations = await sql`
      SELECT tr.id as registration_id, t.*, td.tour_date, tr.is_confirmed, tr.comment, tr.rating
      FROM tour_registrations tr
      JOIN tour_dates td ON tr.tour_date_id = td.id
      JOIN tours t ON td.tour_id = t.id
      WHERE tr.user_id = ${userId}
      ORDER BY td.tour_date DESC
    `;
    res.status(200).json({ status: 'success', data: registrations });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ status: 'fail', message: 'Vartotojas nerastas' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { role } = req.body;
    if (!role) return res.status(400).json({ status: 'fail', message: 'Role privaloma' });
    const updated = await updateUserRole(id, role);
    if (!updated) {
      return res.status(404).json({ status: 'fail', message: 'Vartotojas nerastas' });
    }
    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

exports.updateUserUsername = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { username } = req.body;
    if (!username) return res.status(400).json({ status: 'fail', message: 'Username privalomas' });
    const updated = await updateUserUsername(id, username);
    if (!updated) {
      return res.status(404).json({ status: 'fail', message: 'Vartotojas nerastas' });
    }
    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};
