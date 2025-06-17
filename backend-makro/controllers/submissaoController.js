const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer para usar sua pasta uploads existente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Cria a pasta uploads se não existir
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Prefixo 'doc-' para documentos de submissão
    const uniqueSuffix = 'doc-' + Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF, DOC, DOCX ou TXT são permitidos!'));
    }
  }
}).single('documento');

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

    const response = submissoes.map(submissao => ({ 
      id: submissao.id,
      nome: submissao.nome,
      email: submissao.email,
      telefone: submissao.telefone,
      descricao: submissao.descricao,
      documento: submissao.documento ? submissao.documento : null, 
      nomeProjeto: submissao.nomeProjeto,
      status: submissao.status || "Em análise",
      createdAt: formatDate(submissao.createdAt),
      desafioId: submissao.desafioOrigem?.id,
      desafioTitulo: submissao.desafioOrigem?.titulo || "Desafio não especificado"
    }));

    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar submissões:', error);
    res.status(500).json({ error: 'Erro ao buscar submissões', details: error.message });
  }
};

//Listar o documento que vou enviado
exports.getDocumento = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    console.log('Tentando acessar arquivo:', filePath); // Para debug
    
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filename);
      return res.status(404).send('Arquivo não encontrado');
    }
    
    res.sendFile(filePath, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Erro ao recuperar arquivo:', error);
    res.status(500).send('Erro ao recuperar arquivo');
  }
};

// Criar nova submissão (com upload de documento)
exports.createProject = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        error: 'Erro no upload do arquivo', 
        details: err.message 
      });
    }

    // Verificação do desafioId
    if (!req.body.desafioId || isNaN(Number(req.body.desafioId))) {
      // Remove o arquivo enviado se houver erro de validação
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'desafioId inválido',
        details: 'O ID do desafio deve ser um número válido'
      });
    }

    const required = ['nome', 'desafioId', 'email', 'telefone', 'descricao', 'nomeProjeto'];
    const missing = required.filter(f => !req.body[f] || req.body[f].trim() === '');

    if (missing.length > 0) {
      // Remove o arquivo enviado se houver erro de validação
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        missingFields: missing
      });
    }

    try {
      const projectData = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        descricao: req.body.descricao,
        nomeProjeto: req.body.nomeProjeto,
        status: "Em análise",
        desafioId: Number(req.body.desafioId),
        ...(req.file && { documento: req.file.filename })
      };

      const newProject = await prisma.submissao.create({
        data: projectData,
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
        documento: newProject.documento ? `/uploads/${newProject.documento}` : null,
        nomeProjeto: newProject.nomeProjeto,
        status: newProject.status,
        createdAt: formatDate(newProject.createdAt),
        desafioId: newProject.desafioOrigem?.id,
        desafioTitulo: newProject.desafioOrigem?.titulo
      });
    } catch (error) {
      // Remove o arquivo enviado se houver erro no banco de dados
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Erro ao criar projeto:', error);
      res.status(500).json({ 
        error: 'Erro interno ao criar projeto',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      });
    }
  });
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
      documento: submissao.documento ? `/uploads/${submissao.documento}` : null,
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

// Deletar submissão (com remoção do arquivo associado)
exports.deleteSubmissao = async (req, res) => {
  try {
    const submissao = await prisma.submissao.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!submissao) {
      return res.status(404).json({ error: 'Submissão não encontrada.' });
    }

    // Remove o arquivo associado se existir
    if (submissao.documento) {
      const filePath = path.join(__dirname, '../uploads', submissao.documento);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.submissao.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Submissão deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar submissão:', error);
    res.status(400).json({ error: 'Erro ao deletar submissão.', details: error.message });
  }
};