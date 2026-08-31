require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require("bcrypt");
const speakeasy = require('speakeasy');

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
    const {
        nome,
        email,
        telefone,
        plano_id,
        dataInicio,
        status,
        observacoes
    } = req.body;

    const sql = `
    INSERT INTO alunos
    (nome, email, telefone, plano_id, data_inicio, status, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`;

    db.query(
        sql,
        [
            nome,
            email,
            telefone,
            plano_id,
            dataInicio || null,
            status,
            observacoes || null
        ],
        (err, result) => {
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
        plano_id,
        dataInicio,
        status,
        observacoes
    } = req.body;

    db.query(
        `UPDATE alunos
         SET nome = ?,
             email = ?,
             telefone = ?,
             plano_id = ?,
             data_inicio = ?,
             status = ?,
             observacoes = ?
         WHERE id = ?`,
        [
            nome,
            email,
            telefone,
            plano_id,
            dataInicio || null,
            status,
            observacoes || null,
            id
        ],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar aluno:', err);
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
    db.query(`
        SELECT
            pagamentos.id,
            alunos.nome AS aluno,
            pagamentos.valor,
            pagamentos.data_pagamento,
            pagamentos.status,
            pagamentos.aluno AS aluno_id
        FROM pagamentos
        INNER JOIN alunos
        ON pagamentos.aluno = alunos.id
        ORDER BY pagamentos.id DESC
    `, (err, results) => {
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

app.put("/api/pagamentos/:id", (req, res) => {
    const id = req.params.id;

    const {
        aluno,
        valor,
        data_pagamento,
        status
    } = req.body;

    const sql = `
        UPDATE pagamentos
        SET aluno = ?,
            valor = ?,
            data_pagamento = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [aluno, valor, data_pagamento, status, id],
        (err, result) => {
            if (err) {
                console.error("Erro ao atualizar pagamento:", err);
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Pagamento não encontrado"
                });
            }

            res.json({
                mensagem: "Pagamento atualizado com sucesso"
            });
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
    const sql = `
        SELECT
            treinos.*,
            alunos.nome AS aluno
        FROM treinos
        LEFT JOIN alunos
            ON treinos.aluno_id = alunos.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao listar treinos:', err);
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

app.post('/api/treinos', (req, res) => {
    const {
        aluno_id,
        nome,
        grupo_muscular,
        duracao,
        descricao
    } = req.body;

    const sql = `
        INSERT INTO treinos
        (aluno_id, nome, grupo_muscular, duracao, descricao)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [aluno_id, nome, grupo_muscular, duracao, descricao],
        (err, result) => {
            if (err) {
                console.error('Erro ao cadastrar treino:', err);
                return res.status(500).json(err);
            }

            res.json({
                mensagem: 'Treino cadastrado com sucesso'
            });
        }
    );
});

app.put('/api/treinos/:id', (req, res) => {
    const id = req.params.id;

    const {
        aluno_id,
        nome,
        grupo_muscular,
        duracao,
        descricao
    } = req.body;

    const sql = `
        UPDATE treinos
        SET aluno_id = ?,
            nome = ?,
            grupo_muscular = ?,
            duracao = ?,
            descricao = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [aluno_id, nome, grupo_muscular, duracao, descricao, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar treino:', err);
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: 'Treino não encontrado'
                });
            }

            res.json({
                mensagem: 'Treino atualizado com sucesso'
            });
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

app.post("/api/usuarios/inicializar", async (req, res) => {
    try {
        const senhaInicial = process.env.ADMIN_PASSWORD;

        if (!senhaInicial) {
            return res.status(500).json({
                erro: "Senha inicial do administrador não configurada"
            });
        }

        const senhaHash = await bcrypt.hash(senhaInicial, 10);

        const sql = `
            INSERT INTO usuarios
            (nome, email, senha, cargo, dois_fatores)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                "Administrador",
                "admin@academia.com",
                senhaHash,
                "Administrador",
                false
            ],
            (err) => {
                if (err) {
                    console.error("Erro ao criar usuário:", err);

                    return res.status(500).json({
                        erro: "Erro ao criar usuário"
                    });
                }

                res.json({
                    mensagem: "Administrador criado com sucesso"
                });
            }
        );
    } catch (erro) {
        console.error("Erro interno:", erro);

        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

app.post("/api/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            erro: "E-mail e senha são obrigatórios"
        });
    }

    const sql = `
        SELECT id, nome, email, senha, cargo, dois_fatores
        FROM usuarios
        WHERE email = ?
        LIMIT 1
    `;

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);

            return res.status(500).json({
                erro: "Erro interno do servidor"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos"
            });
        }

        const usuario = results[0];

        try {
            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    erro: "E-mail ou senha inválidos"
                });
            }

            if (Boolean(usuario.dois_fatores)) {
                return res.json({
                    mensagem: "Autenticação em dois fatores necessária",
                    requer2FA: true,
                    usuarioId: usuario.id
                });
            }

            return res.json({
                mensagem: "Login realizado com sucesso",
                requer2FA: Boolean(usuario.dois_fatores),
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    cargo: usuario.cargo,
                    doisFatores: Boolean(usuario.dois_fatores)
                }
            });
        } catch (erro) {
            console.error("Erro ao comparar senha:", erro);

            return res.status(500).json({
                erro: "Erro interno do servidor"
            });
        }
    });
});

// Buscar perfil do usuário
app.get("/api/usuarios/:id/perfil", (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT id, nome, email, cargo, dois_fatores
        FROM usuarios
        WHERE id = ?
        LIMIT 1
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Erro ao buscar perfil:", err);

            return res.status(500).json({
                erro: "Erro interno do servidor"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        const usuario = results[0];

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            cargo: usuario.cargo,
            doisFatores: Boolean(usuario.dois_fatores)
        });
    });
});

// Atualizar perfil do usuário
app.put("/api/usuarios/:id/perfil", (req, res) => {
    const id = req.params.id;
    const { nome, email, cargo, doisFatores } = req.body;

    if (!nome || !email || !cargo) {
        return res.status(400).json({
            erro: "Nome, e-mail e cargo são obrigatórios"
        });
    }

    const sql = `
    UPDATE usuarios
    SET nome = ?,
        email = ?,
        cargo = ?,
        dois_fatores = ?,
        segredo_2fa = CASE
            WHEN ? = false THEN NULL
            ELSE segredo_2fa
        END
    WHERE id = ?
`;

    db.query(
        sql,
        [
            nome,
            email,
            cargo,
            Boolean(doisFatores),
            Boolean(doisFatores),
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Erro ao atualizar perfil:", err);

                return res.status(500).json({
                    erro: "Erro ao atualizar perfil"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Usuário não encontrado"
                });
            }

            res.json({
                mensagem: "Perfil atualizado com sucesso"
            });
        }
    );
});

// Alterar senha do usuário
app.put("/api/usuarios/:id/senha", (req, res) => {
    const id = req.params.id;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
            erro: "Senha atual e nova senha são obrigatórias"
        });
    }

    if (novaSenha.length < 6) {
        return res.status(400).json({
            erro: "A nova senha deve ter pelo menos 6 caracteres"
        });
    }

    const sqlBuscar = `
        SELECT senha
        FROM usuarios
        WHERE id = ?
        LIMIT 1
    `;

    db.query(sqlBuscar, [id], async (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuário:", err);

            return res.status(500).json({
                erro: "Erro interno do servidor"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        try {
            const senhaCorreta = await bcrypt.compare(
                senhaAtual,
                results[0].senha
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    erro: "Senha atual incorreta"
                });
            }

            const novaSenhaHash = await bcrypt.hash(
                novaSenha,
                10
            );

            const sqlAtualizar = `
                UPDATE usuarios
                SET senha = ?
                WHERE id = ?
            `;

            db.query(
                sqlAtualizar,
                [novaSenhaHash, id],
                (err, result) => {
                    if (err) {
                        console.error(
                            "Erro ao alterar senha:",
                            err
                        );

                        return res.status(500).json({
                            erro: "Erro ao alterar senha"
                        });
                    }

                    res.json({
                        mensagem: "Senha alterada com sucesso"
                    });
                }
            );

        } catch (erro) {
            console.error(
                "Erro ao processar senha:",
                erro
            );

            res.status(500).json({
                erro: "Erro interno do servidor"
            });
        }
    });
});

// Gerar e salvar segredo para autenticação em dois fatores
app.post("/api/usuarios/:id/2fa/gerar", (req, res) => {
    const id = req.params.id;

    const segredo = speakeasy.generateSecret({
        name: `Fitness Academia (${id})`
    });

    const sql = `
        UPDATE usuarios
        SET segredo_2fa = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [segredo.base32, id],
        (err, result) => {
            if (err) {
                console.error("Erro ao salvar segredo 2FA:", err);

                return res.status(500).json({
                    erro: "Erro ao salvar segredo 2FA"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    erro: "Usuário não encontrado"
                });
            }

            res.json({
                mensagem: "Segredo 2FA gerado e salvo com sucesso",
                segredoBase32: segredo.base32,
                otpauthUrl: segredo.otpauth_url
            });
        }
    );
});

// Verificar código da autenticação em dois fatores
app.post("/api/usuarios/:id/2fa/verificar", (req, res) => {
    const id = req.params.id;
    const { codigo } = req.body;

    if (!codigo) {
        return res.status(400).json({
            erro: "Código 2FA é obrigatório"
        });
    }

    const sql = `
        SELECT id, nome, email, cargo, segredo_2fa
        FROM usuarios
        WHERE id = ?
        LIMIT 1
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Erro ao buscar segredo 2FA:", err);

            return res.status(500).json({
                erro: "Erro interno do servidor"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        const usuario = results[0];

        if (!usuario.segredo_2fa) {
            return res.status(400).json({
                erro: "2FA não configurado para este usuário"
            });
        }

        const valido = speakeasy.totp.verify({
            secret: usuario.segredo_2fa,
            encoding: "base32",
            token: codigo,
            window: 1
        });

        if (!valido) {
            return res.status(401).json({
                erro: "Código 2FA inválido"
            });
        }

        res.json({
            mensagem: "Código 2FA validado com sucesso",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo,
                doisFatores: true
            }
        });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});