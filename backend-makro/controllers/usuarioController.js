const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os usuários
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Criar novo usuário
exports.createUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const novoUsuario = await prisma.usuario.create({
      data: { email, senha }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário.' });
  }
};

// Buscar usuário por ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

// Atualizar usuário
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { email, senha } = req.body;

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { email, senha }
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário.' });
  }
};

// Deletar usuário
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar usuário.' });
  }
};

  //Login do usuário adm
exports.loginUsuario = async (req, res) => {
  const {email, senha} = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if(!usuario || usuario.senha !== senha) {
        return res.status(401).json({ error: 'Credencias inválidas.'});
    }

    res.json({ message: 'Login bem-sucedido.'});
  } catch(error) {
      res.status(500).json({ error: 'Erro ao tentar fazer login.'});
  }
};



