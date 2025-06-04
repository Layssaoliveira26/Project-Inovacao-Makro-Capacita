const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/desafioController');
const { upload } = require('../controllers/desafioController'); // Importando configuração do multer

// Definição das rotas
router.get('/desafios', desafioController.getAllDesafios);
router.get('/desafios/ativos', desafioController.getActiveDesafios);
router.post('/desafios', upload.single('imagem'), desafioController.createDesafio); // Adicionando upload
router.get('/desafios/:id', desafioController.getDesafioById);
router.put('/desafios/:id', upload.single('imagem'), desafioController.updateDesafio); // Adicionando upload
router.put('/desafios/status/:id', desafioController.alterarStatusDesafio);
router.delete('/desafios/:id', desafioController.deleteDesafio);

module.exports = router;