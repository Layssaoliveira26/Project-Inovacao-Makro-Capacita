const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Formatar data
function formatDate(date){
  return new Date(date).toLocaleDateString('pt-BR')
}

// Listar todos os formularios
exports.getAllProjects = async (req, res) => {
  try {
    // Query com campos obrigatórios apenas
    const formularios = await prisma.formulario.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nome: true,
        email: true,
        celular: true,
        descricao: true
      }
    });

    // Adiciona status padrão se necessário no frontend
    const response = formularios.map(formulario => ({
      ...formulario,
      status: "Em análise" // Valor padrão
    }));

    res.json(response);

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar formularios',
      details: error.message
    });
  }
};


// Criar novo formulario (projeto)
exports.createProject = async (req, res) => {
  // Log para debug (opcional)
  console.log('[DEBUG] Dados recebidos:', req.body);

  // Validação dos campos obrigatórios
  const requiredFields = ['nome', 'email', 'celular', 'descricao', ];
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
    celular: String(req.body.celular),
    descricao: String(req.body.descricao),
    // status e createdAt são preenchidos automaticamente pelo Prisma
  };

  try {
    // Validação de e-mail único
    const emailExists = await prisma.formulario.findUnique({
      where: { email: projectData.email }
    });

    if (emailExists) {
      return res.status(409).json({
        error: 'E-mail já cadastrado',
        solution: 'Utilize outro e-mail ou recupere o cadastro existente'
      });
    }

    // Criação no banco de dados
    const newProject = await prisma.formulario.create({
      data: projectData
    });

    // Resposta formatada para o frontend
    const formattedResponse = {
      id: newProject.id,
      name: newProject.nome,
      email: newProject.email,
      phone: newProject.celular,
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
        details: 'O e-mail já está em uso por outro formulario'
      });
    }

    return res.status(500).json({
      error: 'Erro interno ao criar projeto',
      details: error.message,
      prismaErrorCode: error.code || 'N/A'
    });
  }
};

// Buscar formulario por ID
exports.getFormularioById = async (req, res) => {
  const { id } = req.params;

  try {
    const formulario = await prisma.formulario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!formulario) {
      return res.status(404).json({ error: 'Formulario não encontrado.' });
    }

    res.json(formulario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formulario.' });
  }
};

// Atualizar formulario
exports.updateFormulario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, celular, descricao} = req.body;

  try {
    const formularioAtualizado = await prisma.formulario.update({
      where: { id: parseInt(id) },
      data: { nome, email, celular, descricao }
    });

    res.json(formularioAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar formulario.' });
  }
};

// Deletar formulario
exports.deleteFormulario = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.formulario.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Formulario deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar formulario.' });
  }
};
