const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');

// Obtener todos los elementos del menú
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Método para crear un nuevo elemento en el menú
exports.createMenuItem = async (req, res) => {
  try {
      const newItem = await MenuItem.create(req.body);
      res.status(201).json({
          message: 'New menu item successfully created!',
          item: newItem
      });
  } catch (error) {
      res.status(400).json({
          message: 'Error creating menu item',
          error: error.message
      });
  }
};


exports.updateMenuItemByIdentifier = async (req, res) => {
  const { identifier } = req.params;
  const updateData = req.body;

  try {
      let item;

      // Verifica si identifier es un ObjectId válido y busca por ID
      if (mongoose.Types.ObjectId.isValid(identifier)) {
          item = await MenuItem.findByIdAndUpdate(identifier, updateData, { new: true });
      } 

      // Si no se encontró por ID, intenta buscar por nombre
      if (!item) {
          item = await MenuItem.findOneAndUpdate({ name: identifier }, updateData, { new: true });
      }

      // Si no se encuentra el producto, devuelve un 404
      if (!item) {
          return res.status(404).json({ message: 'Item not found' });
      }

      // Si se encuentra, devuelve el producto actualizado
      res.status(200).json({
          message: 'Menu item updated successfully!',
          item: item
      });
  } catch (error) {
      res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

// Método para eliminar un producto en el menú
exports.deleteMenuItem = async (req, res) => {
  try {
      const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
          return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({
          message: 'Menu item deleted successfully!',
          item: deletedItem
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


exports.getMenuItemByIdentifier = async (req, res) => {
  const { identifier } = req.params;

  try {
      let item;

      // Verifica si identifier es un ObjectId válido
      if (mongoose.Types.ObjectId.isValid(identifier)) {
          item = await MenuItem.findById(identifier);
      } 

      // Si no es un ObjectId válido, busca por nombre
      if (!item) {
          item = await MenuItem.findOne({ name: identifier });
      }

      // Si no se encuentra el producto, devuelve un 404
      if (!item) {
          return res.status(404).json({ message: 'Item not found' });
      }

      // Si se encuentra, devuelve el producto
      res.status(200).json(item);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving item', error: error.message });
  }
};