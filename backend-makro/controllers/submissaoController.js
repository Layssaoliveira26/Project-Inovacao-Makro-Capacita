const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Formatar data
function formatDate(date){
  return new Date(date).toLocaleDateString('pt-BR')
}

// Listar todos as submissões
exports.getAllProjects = async (req, res) => {
  try {
    // Query com campos obrigatórios apenas
    const submissoes = await prisma.submissao.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nome: true,
        desafioOrigem: true,
        email: true,
        telefone: true,
        descricao: true,
        documento: true
      }
    });

    // Adiciona status padrão se necessário no frontend
    const response = submissoes.map(submissao => ({
      ...submissao,
      status: "Em análise" // Valor padrão
    }));

    res.json(response);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar submissoes',
      details: error.message
    });
  }
};


// Criar novo submissao (projeto)
exports.createProject = async (req, res) => {
  // Log para debug (opcional)
  console.log('[DEBUG] Dados recebidos:', req.body);

  // Validação dos campos obrigatórios
  const requiredFields = ['nome', 'desafioOrigem', 'email', 'telefone', 'descricao', ];
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
    desafioOrigem: String(req.body.desafioOrigem),
    email: String(req.body.email),
    telefone: String(req.body.telefone),
    descricao: String(req.body.descricao),
    documento: req.body.documento ? String(req.body.documento) : null,
    // status e createdAt são preenchidos automaticamente pelo Prisma
  };

  try {
    // Validação de e-mail único
    const emailExists = await prisma.submissao.findUnique({
      where: { email: projectData.email }
    });

    if (emailExists) {
      return res.status(409).json({
        error: 'E-mail já cadastrado',
        solution: 'Utilize outro e-mail ou recupere o cadastro existente'
      });
    }

    // Criação no banco de dados
    const newProject = await prisma.submissao.create({
      data: projectData
    });

    // Resposta formatada para o frontend
    const formattedResponse = {
      id: newProject.id,
      name: newProject.nome,
      challengeOrigin: newProject.desafioOrigem,
      email: newProject.email,
      phone: newProject.telefone,
      description: newProject.descricao,
      receiptDate: formatDate(newProject.createdAt),
      status: newProject.status || 'Em análise'
    };

    return res.status(201).json(formattedResponse);

  } catch (error) {
    console.error('[ERROR] Erro ao criar projeto:', error);

    // Tratamento específico para erros do Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Erro de duplicidade',
        details: 'O e-mail já está em uso por outro submissao'
      });
    }

    return res.status(500).json({
      error: 'Erro interno ao criar projeto',
      details: error.message,
      prismaErrorCode: error.code || 'N/A'
    });
  }
};

// Buscar submissao por ID
exports.getSubmissaoById = async (req, res) => {
  const { id } = req.params;

  try {
    const submissao = await prisma.submissao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!submissao) {
      return res.status(404).json({ error: 'Submissao não encontrado.' });
    }

    res.json(submissao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar submissao.' });
  }
};

// Atualizar submissao
exports.updateSubmissao = async (req, res) => {
  const { id } = req.params;
  const { nome, desafioOrigem, email, telefone, descricao, documento } = req.body;

  try {
    const submissaoAtualizado = await prisma.submissao.update({
      where: { id: parseInt(id) },
      data: { nome, desafioOrigem, email, telefone, descricao, documento }
    });

    res.json(submissaoAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar submissao.' });
  }
};

// Deletar submissao
exports.deleteSubmissao = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.submissao.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Submissao deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar submissao.' });
  }
};
