const express = require('express');
const cors = require('cors');
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const submissaoRoutes = require('./routes/submissaoRoutes');
const desafioRoutes = require('./routes/desafioRoutes');
const formularioRoutes = require('./routes/formularioRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const caseRoutes = require('./routes/caseRoutes');
const app = express();
const PORT = 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());

// Rota com prefixo /api
app.use('/api', usuarioRoutes);
app.use('/api', submissaoRoutes);
app.use('/api', desafioRoutes);
app.use('/api', formularioRoutes);
app.use('/api', contatoRoutes);
app.use('/api', caseRoutes);
// Servindo a pasta de uploads
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
