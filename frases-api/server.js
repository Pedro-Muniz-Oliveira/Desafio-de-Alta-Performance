const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware para permitir requisições JSON
app.use(express.json());
app.use(cors());

// Caminho do arquivo JSON
const FILE_PATH = 'frases.json';

// Função para ler o JSON
function lerFrases() {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo:', error);
        return { frases: [] };
    }
}

// Função para salvar no JSON
function salvarFrases(conteudo) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(conteudo, null, 2), 'utf8');
}

// 🚀 **GET /frases** - Retorna todas as frases
app.get('/frases', (req, res) => {
    const data = lerFrases();
    res.json(data);
});

// 🚀 **POST /frases** - Adiciona uma nova frase
app.post('/frases', (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ error: 'O campo "texto" é obrigatório.' });
    }

    const data = lerFrases();
    const novaFrase = {
        id: data.frases.length ? data.frases[data.frases.length - 1].id + 1 : 1,
        texto
    };

    data.frases.push(novaFrase);
    salvarFrases(data);

    res.status(201).json(novaFrase);
});

// 🚀 **DELETE /frases/:id** - Exclui uma frase pelo ID
app.delete('/frases/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = lerFrases();

    const novaLista = data.frases.filter(frase => frase.id !== id);

    if (novaLista.length === data.frases.length) {
        return res.status(404).json({ error: 'Frase não encontrada.' });
    }

    salvarFrases({ frases: novaLista });
    res.status(200).json({ message: 'Frase excluída com sucesso.' });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
