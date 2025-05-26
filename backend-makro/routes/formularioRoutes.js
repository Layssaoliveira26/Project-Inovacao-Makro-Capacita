const express = require('express');
const router = express.Router();
const formularioController = require('../controllers/formularioController');

// Definição das rotas
router.get('/formularios', formularioController.getAllProjects);
router.post('/formularios', formularioController.createProject);
router.get('/formularios/:id', formularioController.getFormularioById);
router.put('/formularios/:id', formularioController.updateFormulario);
router.delete('/formularios/:id', formularioController.deleteFormulario);

module.exports = router;