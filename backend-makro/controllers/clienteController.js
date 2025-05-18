const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Formatar data
function formatDate(date){
  return new Date(date).toLocaleDateString('pt-BR')
}

// Listar todos os clientes
exports.getAllProjects = async (req, res) => {
  try {
    // Query com campos obrigatórios apenas
    const clientes = await prisma.cliente.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true,
        documento: true
      }
    });

    // Adiciona status padrão se necessário no frontend
    const response = clientes.map(cliente => ({
      ...cliente,
      status: "Em análise" // Valor padrão
    }));

    res.json(response);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar clientes',
      details: error.message
    });
  }
};


// Criar novo cliente (projeto)
exports.createProject = async (req, res) => {
  // Log para debug (opcional)
  console.log('[DEBUG] Dados recebidos:', req.body);

  // Validação dos campos obrigatórios
  const requiredFields = ['nome', 'email', 'telefone', 'descricao', 'nomeProjeto'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Campos obrigatórios faltando',
      missingFields,
      details: `Faltam: ${missingFields.join(', ')}`
    });
  }

  // Preparação dos dados
  const projectData = {
    nome: String(req.body.nome),
    email: String(req.body.email),
    telefone: String(req.body.telefone),
    descricao: String(req.body.descricao),
    documento: req.body.documento ? String(req.body.documento) : null,
    nomeProjeto: String(req.body.nomeProjeto)
    // status e createdAt são preenchidos automaticamente pelo Prisma
  };

  try {
    // Validação de e-mail único
    const emailExists = await prisma.cliente.findUnique({
      where: { email: projectData.email }
    });

    if (emailExists) {
      return res.status(409).json({
        error: 'E-mail já cadastrado',
        solution: 'Utilize outro e-mail ou recupere o cadastro existente'
      });
    }

    // Criação no banco de dados
    const newProject = await prisma.cliente.create({
      data: projectData
    });

    // Resposta formatada para o frontend
    const formattedResponse = {
      id: newProject.id,
      name: newProject.nome,
      email: newProject.email,
      phone: newProject.telefone,
      description: newProject.descricao,
      receiptDate: formatDate(newProject.createdAt),
      status: newProject.status || 'Em análise',
      projectName: newProject.nomeProjeto
    };

    return res.status(201).json(formattedResponse);

  } catch (error) {
    console.error('[ERROR] Erro ao criar projeto:', error);

    // Tratamento específico para erros do Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Erro de duplicidade',
        details: 'O e-mail já está em uso por outro cliente'
      });
    }

    return res.status(500).json({
      error: 'Erro interno ao criar projeto',
      details: error.message,
      prismaErrorCode: error.code || 'N/A'
    });
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
