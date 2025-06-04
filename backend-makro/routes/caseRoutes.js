const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { upload } = require('../controllers/caseController'); // Importando configuração do multer

// Definição das rotas
router.get('/case',caseController.getAllCases);
router.get('/case/ativos',caseController.getActiveCases);
router.get('/case/:id',caseController.getCaseById);
router.post('/case', upload.single('imagem'), caseController.createCase); // Adicionando upload
router.put('/case/status/:id', caseController.alterarStatusCase);
router.put('/case/:id', upload.single('imagem'), caseController.updateCase); // Adicionando upload
router.delete('/case/:id', caseController.excluirCase);

module.exports = router;