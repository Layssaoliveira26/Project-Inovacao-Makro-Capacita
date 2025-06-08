const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Listar todos os usuários
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, email: true } // Exclui a senha
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// Criar novo usuário
exports.createUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: { email, senha: senhaCriptografada }
    });

    res.status(201).json({ id: novoUsuario.id, email: novoUsuario.email });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário.' });
  }
};

// Buscar usuário por ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, email: true } // Exclui a senha
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
    let dadosAtualizados = { email };
    
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10); // Criptografa nova senha
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: dadosAtualizados
    });

    res.json({ id: usuarioAtualizado.id, email: usuarioAtualizado.email }); // Sem retornar senha
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

    if(!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).json({ error: 'Credencias inválidas.'});
    }

    res.json({ message: 'Login bem-sucedido.'});
  } catch(error) {
      res.status(500).json({ error: 'Erro ao tentar fazer login.'});
  }
};



