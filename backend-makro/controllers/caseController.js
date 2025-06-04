const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');

// Configuração do armazenamento de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nome único baseado no timestamp
    }
});

const upload = multer({ storage });

// Listar todos os cases
exports.getAllCases = async (req, res) => {
  try {
    const cases = await prisma.cases.findMany();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar case.' });
  }
};

// Criar novo case com upload de imagem
exports.createCase = async (req, res) => {
    console.log("Dados recebidos no backend:", req.body);
    console.log("Arquivo recebido:", req.file);

    const { titulo, descricao, resumo, status } = req.body;
    const imagem = req.file ? req.file.filename : null;

    try {
        const novoCase = await prisma.cases.create({
            data: { titulo, imagem, descricao, resumo, status: JSON.parse(status) } // Convertendo para booleano
        });

        res.status(201).json(novoCase);
    } catch (error) {
        console.error("Erro ao criar case:", error);
        res.status(400).json({ error: 'Erro ao criar case.' });
    }
};


// Excluir Case 
exports.excluirCase = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.cases.delete({
        where: { id: parseInt(id) }
      });
  
      res.json({ message: 'Case deletado com sucesso.' });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar case.' });
    }
  };

//Alterar status
exports.alterarStatusCase = async (req, res) => {
    const { id } = req.params;
    const {status} = req.body;
  
    try {
      const alteraStatus = await prisma.cases.update({
        where: { id: parseInt(id) },
        data: {status}
      });
  
      res.status(201).json(alteraStatus);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao alterar o case.' });
    }
  };

// Listar cases ativos
exports.getActiveCases = async (req, res) => {
 
  try {
    const CasesAtivos = await prisma.cases.findMany({
      where: { status : true }
    });

    res.json(CasesAtivos);

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cases ativos.' });
  }
};

// Buscar case por ID
exports.getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const cases = await prisma.cases.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cases) {
      return res.status(404).json({ error: 'Desafio não encontrado.' });
    }

    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar desafio.' });
  }
};

// Editar case
exports.updateCase = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, resumo, status } = req.body;
  const imagem = req.file ? req.file.filename : null;
  try {
      const caseAtualizado = await prisma.cases.update({
          where: { id: parseInt(id) },
          data: { titulo, imagem, descricao, resumo, status }
      });
      res.json(caseAtualizado);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar case.' });
    }
};

// Exportando o upload de imagem para uso nas rotas
exports.upload = upload;