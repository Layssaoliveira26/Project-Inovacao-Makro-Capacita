const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// Definição das rotas
router.get('/case',caseController.getAllCases);
router.get('/case/ativos',caseController.getActiveCases);
router.get('/case/:id',caseController.getCaseById);
router.post('/case', caseController.createCase);
router.put('/case/status/:id', caseController.alterarStatusCase);
router.put('/case/:id', caseController.updateCase);
router.delete('/case/:id', caseController.excluirCase);

module.exports = router;