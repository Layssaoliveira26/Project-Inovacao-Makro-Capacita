const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// Definição das rotas
router.post('/case', caseController.createCase);
router.put('/case/:id', caseController.alterarStatusCase)
router.delete('/case/:id', caseController.deleteCase);

module.exports = router;