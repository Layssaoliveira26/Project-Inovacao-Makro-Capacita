const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os desafios
exports.getAllDesafios = async (req, res) => {
  try {
    const desafios = await prisma.desafio.findMany();
    res.json(desafios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar desafio.' });
  }
};

// Criar novo desafio
exports.createDesafio = async (req, res) => {
  const { titulo, imagem, descricao, resumo, status } = req.body;

  try {
    const novoDesafio = await prisma.desafio.create({
      data: { titulo, imagem, descricao, resumo, status }
    });

    res.status(201).json(novoDesafio);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar desafio.' });
  }
};

// Buscar desafio por ID
exports.getDesafioById = async (req, res) => {
  const { id } = req.params;

  try {
    const desafio = await prisma.desafio.findUnique({
      where: { id: parseInt(id) }
    });

    if (!desafio) {
      return res.status(404).json({ error: 'Desafio não encontrado.' });
    }

    res.json(desafio);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar desafio.' });
  }
};

//Alterar status
exports.alterarStatusCase = async (req, res) => {
    const { id } = req.params;
    const {status} = req.body;
  
    try {
      const alteraStatus = await prisma.desafio.update({
        where: { id: parseInt(id) },
        data: {status}
      });
  
      res.status(201).json(alteraStatus);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao alterar o case.' });
    }
  };

// Listar desafios ativos
exports.getActiveDesafios = async (req, res) => {
 
  try {
    const DesafiosAtivos = await prisma.desafio.findMany({
      where: { status : true }
    });

    res.json(DesafiosAtivos);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar desafios ativos.' });
  }
};

// Atualizar desafio
exports.updateDesafio = async (req, res) => {
  const { id } = req.params;
  const { titulo, imagem, descricao, resumo, status } = req.body;

  try {
    const desafioAtualizado = await prisma.desafio.update({
      where: { id: parseInt(id) },
      data: { titulo, imagem, descricao, resumo, status }
    });

    res.json(desafioAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar desafio.' });
  }
};

// Deletar desafio
exports.deleteDesafio = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.desafio.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Desafio deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar desafio.' });
  }
};
