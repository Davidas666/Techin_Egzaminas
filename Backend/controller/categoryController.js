const { getAllCategories, createCategory, deleteCategory } = require('../models/categoryModel');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Kategorijos pavadinimas privalomas' });
    }
    const category = await createCategory(name);
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteCategory(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
