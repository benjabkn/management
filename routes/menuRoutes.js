const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Ruta para obtener todos los elementos del menú
router.get('/', menuController.getAllMenuItems);

module.exports = router;