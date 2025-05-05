const express = require('express');
const app = express();
const usuarioRoutes = require('../bem-te-vi/routes/usuarioRoutes');
const clienteRoutes = require('../bem-te-vi/routes/clienteRoutes');

app.use(express.json()); 
app.use('/api', usuarioRoutes);
app.use('/api', clienteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});