const express = require('express');
const validateNewBook = require('../validator/newBook.js');
const validate = require('../validator/validate');
const { protect, allowAccessTo } = require('../controller/authController');
const {
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  createBook
} = require('../controller/bookController');

const router = express.Router();

router.route('/')
  .post(protect, allowAccessTo('admin', 'user'), validateNewBook, validate, createBook)
  .get(getAllBooks);

router.route('/:id')
  .get(getBookById)
  .put(protect, allowAccessTo('admin', 'user'), validateNewBook, validate, updateBook)
  .delete(protect, allowAccessTo('admin', 'user'), deleteBook);

module.exports = router;