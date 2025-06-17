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

// Configuração otimizada para servir arquivos estáticos
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
    }
  }
}));

// Rota com prefixo /api
app.use('/api', usuarioRoutes);
app.use('/api', submissaoRoutes);
app.use('/api', desafioRoutes);
app.use('/api', formularioRoutes);
app.use('/api', contatoRoutes);
app.use('/api', caseRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
