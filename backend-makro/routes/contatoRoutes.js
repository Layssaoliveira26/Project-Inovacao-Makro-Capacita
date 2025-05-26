const express = require('express');
const router = express.Router();
const contatoController = require('../controllers/contatoController');

// Definição das rotas
router.get('/contatos', contatoController.getAllContatos);
router.post('/contatos', contatoController.createContato);
router.get('/contatos/:id', contatoController.getContatoById);
router.put('/contatos/:id', contatoController.updateContato);
router.delete('/contatos/:id', contatoController.deleteContato);

module.exports = router;