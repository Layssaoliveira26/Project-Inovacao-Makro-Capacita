const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Formatador de datas
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

// Listar todas as submissões
exports.getAllProjects = async (req, res) => {
  try {
    const submissoes = await prisma.submissao.findMany({
      orderBy: { id: 'desc' },
      include: {
        desafioOrigem: {
          select: { id: true, titulo: true }
        }
      }
    });

    const response = submissoes.map(s => ({
      id: s.id,
      nome: s.nome,
      email: s.email,
      telefone: s.telefone,
      descricao: s.descricao,
      documento: s.documento,
      nomeProjeto: s.nomeProjeto,
      status: s.status || "Em análise",
      createdAt: formatDate(s.createdAt),
      desafioId: s.desafioOrigem?.id,
      desafioTitulo: s.desafioOrigem?.titulo || "Desafio não especificado"
    }));

    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar submissões:', error);
    res.status(500).json({ error: 'Erro ao buscar submissões', details: error.message });
  }
};

// Criar nova submissão
exports.createProject = async (req, res) => {
  const required = ['nome', 'desafioId', 'email', 'telefone', 'descricao', 'nomeProjeto'];
  const missing = required.filter(f => !req.body[f]);

  if (missing.length > 0) {
    return res.status(400).json({
      error: 'Campos obrigatórios faltando',
      missingFields: missing,
      details: `Faltam: ${missing.join(', ')}`
    });
  }

  try {
    const newProject = await prisma.submissao.create({
      data: {
        nome: String(req.body.nome),
        email: String(req.body.email),
        telefone: String(req.body.telefone),
        descricao: String(req.body.descricao),
        documento: req.body.documento ? String(req.body.documento) : null,
        nomeProjeto: String(req.body.nomeProjeto),
        status: req.body.status || "Em análise",
        desafioOrigem: { connect: { id: parseInt(req.body.desafioId) } }
      },
      include: {
        desafioOrigem: {
          select: { id: true, titulo: true }
        }
      }
    });

    res.status(201).json({
      id: newProject.id,
      nome: newProject.nome,
      email: newProject.email,
      telefone: newProject.telefone,
      descricao: newProject.descricao,
      documento: newProject.documento,
      nomeProjeto: newProject.nomeProjeto,
      status: newProject.status,
      createdAt: formatDate(newProject.createdAt),
      desafioId: newProject.desafioOrigem?.id,
      desafioTitulo: newProject.desafioOrigem?.titulo
    });
  } catch (error) {
    console.error('[ERROR] Erro ao criar projeto:', error);
    res.status(500).json({ error: 'Erro interno ao criar projeto', details: error.message });
  }
};

// Buscar submissão por ID
exports.getSubmissaoById = async (req, res) => {
  try {
    const submissao = await prisma.submissao.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        desafioOrigem: {
          select: { id: true, titulo: true }
        }
      }
    });

    if (!submissao) return res.status(404).json({ error: 'Submissão não encontrada.' });

    res.json({
      id: submissao.id,
      nome: submissao.nome,
      email: submissao.email,
      telefone: submissao.telefone,
      descricao: submissao.descricao,
      documento: submissao.documento,
      nomeProjeto: submissao.nomeProjeto,
      status: submissao.status || "Em análise",
      createdAt: formatDate(submissao.createdAt),
      desafioId: submissao.desafioOrigem?.id,
      desafioTitulo: submissao.desafioOrigem?.titulo
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar submissão.', details: error.message });
  }
};

// Atualizar submissão
exports.updateSubmissao = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, descricao, nomeProjeto, status } = req.body;
  const statusValidos = ["Em análise", "Aguardando análise", "Aprovado", "Reprovado"];

  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({
      error: 'Status inválido',
      details: `Status deve ser um dos: ${statusValidos.join(', ')}`
    });
  }

  try {
    const submissaoAtual = await prisma.submissao.findUnique({
      where: { id: parseInt(id) }
    });

    if (!submissaoAtual) return res.status(404).json({ error: 'Submissão não encontrada.' });

    const submissaoAtualizada = await prisma.submissao.update({
      where: { id: parseInt(id) },
      data: {
        nome: nome || submissaoAtual.nome,
        email: email || submissaoAtual.email,
        telefone: telefone || submissaoAtual.telefone,
        descricao: descricao || submissaoAtual.descricao,
        nomeProjeto: nomeProjeto || submissaoAtual.nomeProjeto,
        status: status || submissaoAtual.status || "Em análise"
      }
    });

    res.json(submissaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar submissão:', error);
    res.status(400).json({ error: 'Erro ao atualizar submissão.', details: error.message });
  }
};

// Deletar submissão
exports.deleteSubmissao = async (req, res) => {
  try {
    await prisma.submissao.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Submissão deletada com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar submissão.', details: error.message });
  }
};
