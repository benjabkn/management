const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Ruta para obtener todos los elementos del menú
router.get('/', menuController.getAllMenuItems);
router.post('/', menuController.createMenuItem);
router.put('/:identifier', menuController.updateMenuItemByIdentifier);
router.get('/:identifier', menuController.getMenuItemByIdentifier);
router.delete('/:id', menuController.deleteMenuItem);
module.exports = router;