const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Definição das rotas
router.get('/clientes', clienteController.getAllProjects);
router.post('/clientes', clienteController.createCliente);
router.get('/clientes/:id', clienteController.getClienteById);
router.put('/clientes/:id', clienteController.updateCliente);
router.delete('/clientes/:id', clienteController.deleteCliente);

module.exports = router;