const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os cases
exports.getAllCases = async (req, res) => {
  try {
    const cases = await prisma.cases.findMany();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar case.' });
  }
};

// Criar Case
exports.createCase = async (req, res) => {
    const { titulo, imagem, descricao, resumo, status } = req.body;
  
    try {
      const novoCase = await prisma.cases.create({
        data: { titulo, imagem, descricao, resumo, status }
      });
  
      res.status(201).json(novoCase);
    } catch (error) {
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
  const { titulo, imagem, descricao, resumo, status } = req.body;

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