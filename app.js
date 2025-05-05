const express = require('express');
const app = express();
const usuarioRoutes = require('../bem-te-vi/routes/usuarioRoutes');

app.use(express.json()); 
app.use('/api', usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});