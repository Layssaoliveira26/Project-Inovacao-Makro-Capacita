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
        descricao: true,
        status: true
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
    telefone: String(req.body.telefone),
    descricao: String(req.body.descricao)
  };

  try {
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
  const { nome, email, telefone, descricao, status } = req.body;

  // Validação do status
  const statusValidos = ["Em análise", "Aguardando análise", "Aprovado", "Reprovado"];
  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ 
      error: 'Status inválido',
      details: `Status deve ser um dos: ${statusValidos.join(', ')}`
    });
  }

  try {
    // Primeiro busca o contato atual
    const contatoAtual = await prisma.contatos.findUnique({
      where: { id: parseInt(id) }
    });

    if (!contatoAtual) {
      return res.status(404).json({ error: 'Contato não encontrado.' });
    }

    // Atualiza com os dados recebidos ou mantém os existentes
    const contatoAtualizado = await prisma.contatos.update({
      where: { id: parseInt(id) },
      data: { 
        nome: nome || contatoAtual.nome,
        email: email || contatoAtual.email,
        telefone: telefone || contatoAtual.telefone,
        descricao: descricao || contatoAtual.descricao,
        status: status || contatoAtual.status || "Em análise"
      }
    });

    res.json(contatoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    res.status(400).json({ 
      error: 'Erro ao atualizar contato.',
      details: error.message 
    });
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