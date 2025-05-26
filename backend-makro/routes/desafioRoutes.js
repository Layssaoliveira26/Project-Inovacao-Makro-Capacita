const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');

// Definição das rotas
router.get('/desafios', desafioController.getAllDesafios);
router.post('/desafios', desafioController.createDesafio);
router.get('/desafios/:id', desafioController.getDesafioById);
router.put('/desafios/:id', desafioController.updateDesafio);
router.delete('/desafios/:id', desafioController.deleteDesafio);

module.exports = router;