const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

// Listar todos os desafios
exports.getAllDesafios = async (req, res) => {
    try {
        const desafios = await prisma.desafio.findMany();
        res.json(desafios);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar desafios.' });
    }
};

// Criar novo desafio com upload de imagem
exports.createDesafio = async (req, res) => {
    console.log("Dados recebidos no backend:", req.body);
    console.log("Arquivo recebido:", req.file);

    const { titulo, descricao, resumo, status } = req.body;
    const imagem = req.file ? req.file.filename : null;

    try {
        const novoDesafio = await prisma.desafio.create({
            data: { titulo, imagem, descricao, resumo, status: JSON.parse(status) } // Convertendo para booleano
        });

        res.status(201).json(novoDesafio);
    } catch (error) {
        console.error("Erro ao criar desafio:", error);
        res.status(400).json({ error: 'Erro ao criar desafio.' });
    }
};

// Buscar desafio por ID
exports.getDesafioById = async (req, res) => {
    const { id } = req.params;

    try {
        const desafio = await prisma.desafio.findUnique({
            where: { id: parseInt(id) }
        });

        if (!desafio) {
            return res.status(404).json({ error: 'Desafio não encontrado.' });
        }

        res.json(desafio);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar desafio.' });
    }
};

// Alterar status do desafio
exports.alterarStatusDesafio = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const alteraStatus = await prisma.desafio.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.status(201).json(alteraStatus);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao alterar o status do desafio.' });
    }
};

// Listar desafios ativos
exports.getActiveDesafios = async (req, res) => {
    try {
        const desafiosAtivos = await prisma.desafio.findMany({
            where: { status: true }
        });

        res.json(desafiosAtivos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar desafios ativos.' });
    }
};

// Atualizar desafio
exports.updateDesafio = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, resumo, status } = req.body;
    const imagem = req.file ? req.file.filename : req.body.imagem; // Usa a mesma imagem se nenhuma nova foi enviada

    try {
        // Buscar desafio atual para obter a imagem antiga
        const desafioAtual = await prisma.desafio.findUnique({ where: { id: parseInt(id) } });

        if (!desafioAtual) {
            return res.status(404).json({ error: 'Desafio não encontrado.' });
        }

        // Se houver uma nova imagem e uma imagem antiga, excluir a antiga
        if (imagem && desafioAtual.imagem) {
            const caminhoImagemAntiga = path.join(__dirname, '..', 'uploads', desafioAtual.imagem);
            fs.unlink(caminhoImagemAntiga, (err) => {
                if (err) console.error(`Erro ao excluir imagem antiga: ${err.message}`);
            });
        }

        // Atualizar desafio no banco de dados
        const desafioAtualizado = await prisma.desafio.update({
            where: { id: parseInt(id) },
            data: { titulo, imagem, descricao, resumo, status },
        });

        res.json(desafioAtualizado);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar desafio.' });
    }
};

// Deletar desafio
exports.deleteDesafio = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar o desafio antes de excluir
        const desafio = await prisma.desafio.findUnique({ where: { id: parseInt(id) } });

        if (!desafio) {
            return res.status(404).json({ error: 'Desafio não encontrado.' });
        }

        // Se houver imagem associada, excluí-la
        if (desafio.imagem) {
            const caminhoImagem = path.join(__dirname, '..', 'uploads', desafio.imagem);
            fs.unlink(caminhoImagem, (err) => {
                if (err) console.error(`Erro ao excluir imagem: ${err.message}`);
            });
        }

        // Remover o desafio do banco de dados
        await prisma.desafio.delete({ where: { id: parseInt(id) } });

        res.json({ message: 'Desafio deletado com sucesso, imagem removida se existia.' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao deletar desafio.' });
    }
};

// Exportando o upload de imagem para uso nas rotas
exports.upload = upload;