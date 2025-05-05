const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Definição das rotas
router.get('/usuarios', usuarioController.getAllUsuarios);
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios/:id', usuarioController.getUsuarioById);
router.put('/usuarios/:id', usuarioController.updateUsuario);
router.delete('/usuarios/:id', usuarioController.deleteUsuario);
router.post('/login', usuarioController.loginUsuario);

module.exports = router;