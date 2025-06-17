const express = require('express');
const router = express.Router();
const submissaoController = require('../controllers/submissaoController');

// Rota para criar submissão (agora com upload)
router.post('/', submissaoController.createProject);

// Definição das rotas
router.get('/submissoes', submissaoController.getAllProjects);
router.post('/submissoes', submissaoController.createProject);
router.get('/submissoes/:id', submissaoController.getSubmissaoById);
router.put('/submissoes/:id', submissaoController.updateSubmissao);
router.delete('/submissoes/:id', submissaoController.deleteSubmissao);
router.get('/documentos/:filename', submissaoController.getDocumento);

module.exports = router;