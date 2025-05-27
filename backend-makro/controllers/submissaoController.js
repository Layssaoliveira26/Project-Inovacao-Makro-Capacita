const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Formatador de datas (mantido como estava)
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

// Listar todas as submissões
exports.getAllProjects = async (req, res) => {
  try {
    const submissoes = await prisma.submissao.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nome: true,
        desafioOrigem: true,
        email: true,
        telefone: true,
        descricao: true,
        documento: true,
        nomeProjeto: true
      }
    });

    // Adiciona status padrão se necessário no frontend
    const response = submissoes.map(submissao => ({
      ...submissao,
      status: "Em análise"
    }));

    res.json(response);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar submissões' });
  }
};

// Criar nova submissão (projeto)
exports.createProject = async (req, res) => {
  console.log('[DEBUG] Dados recebidos:', req.body);

  const requiredFields = ['nome', 'desafioId', 'email', 'telefone', 'descricao', 'nomeProjeto'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Campos obrigatórios faltando',
      missingFields,
      details: `Faltam: ${missingFields.join(', ')}`
    });
  }

  const projectData = {
    nome: String(req.body.nome),
    email: String(req.body.email),
    telefone: String(req.body.telefone),
    descricao: String(req.body.descricao),
    documento: req.body.documento ? String(req.body.documento) : null,
    nomeProjeto: String(req.body.nomeProjeto),
    desafioOrigem: { connect: { id: parseInt(req.body.desafioId) } } // Correção na referência ao Desafio
  };

  try {
    const newProject = await prisma.submissao.create({
      data: projectData
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('[ERROR] Erro ao criar projeto:', error);
    res.status(500).json({ error: 'Erro interno ao criar projeto' });
  }
};

// Buscar submissão por ID
exports.getSubmissaoById = async (req, res) => {
  const { id } = req.params;

  try {
    const submissao = await prisma.submissao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!submissao) {
      return res.status(404).json({ error: 'Submissão não encontrada.' });
    }

    res.json(submissao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar submissão.' });
  }
};

// Atualizar submissão
exports.updateSubmissao = async (req, res) => {
  const { id } = req.params;
  const { nome, desafioId, email, telefone, descricao, documento, nomeProjeto } = req.body;

  try {
    const submissaoAtualizado = await prisma.submissao.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        email,
        telefone,
        descricao,
        documento,
        nomeProjeto,
        desafioOrigem: { connect: { id: parseInt(desafioId) } } // Correção na referência ao Desafio
      }
    });

    res.json(submissaoAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar submissão.' });
  }
};

// Deletar submissão
exports.deleteSubmissao = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.submissao.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Submissão deletada com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar submissão.' });
  }
};