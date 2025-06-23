const { body } = require('express-validator');
const validateNewBook = [
    body().notEmpty().withMessage("Request body must have data"),

    body('title')
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string")
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),

    body('author')
        .notEmpty()
        .withMessage("Author is required")
        .isString()
        .withMessage("Author must be a string")
        .isLength({ min: 3, max: 255 })
        .withMessage('Author must be between 3 and 255 characters'),

    body('isbn')
        .optional()
        .isString()
        .withMessage("ISBN must be a string")
        .isLength({ min: 10, max: 13 })
        .withMessage('ISBN must be between 10 and 13 characters'),

    body('publishing_date')
        .optional()
        .isISO8601()
        .withMessage("Publishing date must be a valid date"),
];

module.exports = validateNewBook;