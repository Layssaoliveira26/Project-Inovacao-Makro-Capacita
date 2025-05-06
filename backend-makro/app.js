const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota com prefixo /api
app.use('/api', usuarioRoutes);
app.use('/api', clienteRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
