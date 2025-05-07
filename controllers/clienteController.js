const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
};

// Criar novo cliente
exports.createCliente = async (req, res) => {
  const { nome, email, telefone, descricao, documento } = req.body;

  try {
    const novoCliente = await prisma.cliente.create({
      data: { nome, email, telefone, descricao, documento }
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar cliente.' });
  }
};

// Buscar cliente por ID
exports.getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente.' });
  }
};

// Atualizar cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, descricao, documento } = req.body;

  try {
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: { nome, email, telefone, descricao, documento }
    });

    res.json(clienteAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar cliente.' });
  }
};

// Deletar cliente
exports.deleteCliente = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.cliente.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Cliente deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar cliente.' });
  }
};
