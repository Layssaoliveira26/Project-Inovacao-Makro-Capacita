const express = require('express');
const router = express.Router();
const submissaoController = require('../controllers/submissaoController');

// Definição das rotas
router.get('/submissoes', submissaoController.getAllProjects);
router.post('/submissoes', submissaoController.createProject);
router.get('/submissoes/:id', submissaoController.getSubmissaoById);
router.put('/submissoes/:id', submissaoController.updateSubmissao);
router.delete('/submissoes/:id', submissaoController.deleteSubmissao);

module.exports = router;