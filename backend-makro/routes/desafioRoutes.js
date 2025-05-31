const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');

// Definição das rotas
router.get('/desafios', desafioController.getAllDesafios);
router.get('/desafios/ativos',desafioController.getActiveDesafios);
router.post('/desafios', desafioController.createDesafio);
router.get('/desafios/:id', desafioController.getDesafioById);
router.put('/desafios/:id', desafioController.updateDesafio);
router.put('/desafios/status/:id', desafioController.alterarStatusCase);
router.delete('/desafios/:id', desafioController.deleteDesafio);

module.exports = router;