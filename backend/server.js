require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        return;
    }

    console.log('Conectado ao MySQL com sucesso!');
});

app.get('/api/alunos', (req, res) => {

    const sql = `
    SELECT
        alunos.*,
        planos.nome AS plano
    FROM alunos
    LEFT JOIN planos
    ON alunos.plano_id = planos.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro na consulta:', err);
            return res.status(500).json(err);
        }

        res.json(results);
    });

});

app.post('/api/alunos', (req, res) => {
    const { nome, email, telefone, plano_id, status } = req.body;

    const sql = `
        INSERT INTO alunos (nome, email, telefone, plano_id, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, email, telefone, plano_id, status], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar aluno:', err);
            return res.status(500).json(err);
        }

        res.json({ mensagem: 'Aluno cadastrado com sucesso!' });
    });
});

app.delete('/api/alunos/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM alunos WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({
                mensagem: 'Aluno excluído com sucesso'
            });
        }
    );
});

app.put('/api/alunos/:id', (req, res) => {
    const id = req.params.id;

    const {
        nome,
        email,
        telefone,
        plano,
        status
    } = req.body;

    db.query(
        `UPDATE alunos
         SET nome = ?, email = ?, telefone = ?, plano = ?, status = ?
         WHERE id = ?`,
        [nome, email, telefone, plano, status, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({
                mensagem: 'Aluno atualizado com sucesso'
            });
        }
    );
});

app.get('/api/planos', (req, res) => {
    db.query('SELECT * FROM planos', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

app.post('/api/planos', (req, res) => {
    const { nome, valor, duracao } = req.body;

    db.query(
        'INSERT INTO planos (nome, valor, duracao) VALUES (?, ?, ?)',
        [nome, valor, duracao],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({ mensagem: 'Plano cadastrado com sucesso' });
        }
    );
});

app.delete('/api/planos/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM planos WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({ mensagem: 'Plano excluído com sucesso' });
        }
    );
});

app.put('/api/planos/:id', (req, res) => {
    const id = req.params.id;
    const { nome, valor, duracao } = req.body;

    db.query(
        'UPDATE planos SET nome = ?, valor = ?, duracao = ? WHERE id = ?',
        [nome, valor, duracao, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({ mensagem: 'Plano atualizado com sucesso' });
        }
    );
});

app.get('/api/pagamentos', (req, res) => {
    db.query('SELECT * FROM pagamentos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/pagamentos', (req, res) => {
    const { aluno, valor, data_pagamento, status } = req.body;

    db.query(
        'INSERT INTO pagamentos (aluno, valor, data_pagamento, status) VALUES (?, ?, ?, ?)',
        [aluno, valor, data_pagamento, status],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ mensagem: 'Pagamento cadastrado com sucesso' });
        }
    );
});

app.delete('/api/pagamentos/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM pagamentos WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ mensagem: 'Pagamento excluído com sucesso' });
        }
    );
});

app.get('/api/treinos', (req, res) => {
    db.query('SELECT * FROM treinos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/treinos', (req, res) => {
    const { nome, grupo_muscular, duracao, descricao } = req.body;

    db.query(
        'INSERT INTO treinos (nome, grupo_muscular, duracao, descricao) VALUES (?, ?, ?, ?)',
        [nome, grupo_muscular, duracao, descricao],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ mensagem: 'Treino cadastrado com sucesso' });
        }
    );
});

app.delete('/api/treinos/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM treinos WHERE id = ?',
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ mensagem: 'Treino excluído com sucesso' });
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});