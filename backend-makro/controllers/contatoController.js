const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Formatar data
function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

// Listar todos os contatos
exports.getAllContatos = async (req, res) => {
  try {
    const contatos = await prisma.contatos.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        descricao: true
      }
    });

    // Adiciona status padrão se necessário no frontend
    const response = contatos.map(contato => ({
      ...contato,
      status: contato.status || "Em análise"
    }));

    res.json(response);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({
      error: 'Erro ao buscar contatos',
      details: error.message
    });
  }
};

// Criar novo contato
exports.createContato = async (req, res) => {
  console.log('[DEBUG] Dados recebidos:', req.body);

  const requiredFields = ['nome', 'email', 'telefone', 'descricao'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Campos obrigatórios faltando',
      missingFields,
      details: `Faltam: ${missingFields.join(', ')}`
    });
  }

  const contatoData = {
    nome: String(req.body.nome),
    email: String(req.body.email),
    celular: String(req.body.celular),
    descricao: String(req.body.descricao)
  };

  try {
    const emailExists = await prisma.contatos.findUnique({
      where: { email: contatoData.email }
    });

    if (emailExists) {
      return res.status(409).json({
        error: 'E-mail já cadastrado',
        solution: 'Utilize outro e-mail ou recupere o cadastro existente'
      });
    }

    const newContato = await prisma.contatos.create({
      data: contatoData
    });

    const formattedResponse = {
      id: newContato.id,
      nome: newContato.nome,
      email: newContato.email,
      telefone: newContato.telefone,
      descricao: newContato.descricao,
      createdAt: formatDate(newContato.createdAt),
      status: newContato.status || 'Em análise'
    };

    return res.status(201).json(formattedResponse);

  } catch (error) {
    console.error('[ERROR] Erro ao criar contato:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Erro de duplicidade',
        details: 'O e-mail já está em uso por outro contato'
      });
    }

    return res.status(500).json({
      error: 'Erro interno ao criar contato',
      details: error.message,
      prismaErrorCode: error.code || 'N/A'
    });
  }
};

// Buscar contato por ID
exports.getContatoById = async (req, res) => {
  const { id } = req.params;

  try {
    const contato = await prisma.contatos.findUnique({
      where: { id: parseInt(id) }
    });

    if (!contato) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }

    res.json(contato);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contato.' });
  }
};

// Atualizar contato
exports.updateContato = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, descricao } = req.body;

  try {
    const contatoAtualizado = await prisma.contatos.update({
      where: { id: parseInt(id) },
      data: { nome, email, telefone, descricao }
    });

    res.json(contatoAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar contato.' });
  }
};

// Deletar contato
exports.deleteContato = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.contatos.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Contato deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar contato.' });
  }
};