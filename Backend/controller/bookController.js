const { sql } = require('../dbConnection');
const { getAllBooks, getBookById, updateBook, deleteBook, createBook } = require('../models/bookModel');
const AppError = require('../utils/appError');

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await getAllBooks();
    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    next(error);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id);
    const book = await getBookById(bookId);
    if (!book) {
      return res.status(404).json({ status: 'fail', message: 'Knyga nerasta' });
    }
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id);
    const bookData = req.body;
    const updatedBook = await updateBook(bookId, bookData);
    if (!updatedBook) {
      return res.status(404).json({ status: 'fail', message: 'Knyga nerasta' });
    }
    res.status(200).json({ status: 'success', data: updatedBook });
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id);
    const deletedBook = await deleteBook(bookId);
    if (!deletedBook) {
      return res.status(404).json({ status: 'fail', message: 'Knyga nerasta' });
    }
    res.status(200).json({ status: 'success', data: deletedBook });
  } catch (error) {
    next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const bookData = req.body;
    const book = await createBook(bookData);
    res.status(201).json({ status: 'success', data: book });
  } catch (error) {
    next(error);
  }
};