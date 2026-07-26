-- ======================================
-- COMANDOS ÚTEIS - FITNESS ACADEMIA
-- ======================================

-- Selecionar banco
USE fitness_academia;

-- Mostrar bancos de dados
SHOW DATABASES;

-- Mostrar tabelas
SHOW TABLES;

-- Estrutura das tabelas
DESCRIBE alunos;
DESCRIBE planos;
DESCRIBE pagamentos;
DESCRIBE treinos;

-- Ver todos os registros
SELECT * FROM alunos;
SELECT * FROM planos;
SELECT * FROM pagamentos;
SELECT * FROM treinos;

-- Contar registros
SELECT COUNT(*) AS total_alunos FROM alunos;
SELECT COUNT(*) AS total_planos FROM planos;
SELECT COUNT(*) AS total_pagamentos FROM pagamentos;
SELECT COUNT(*) AS total_treinos FROM treinos;

-- Consultar alunos com o nome do plano
SELECT
    a.id,
    a.nome,
    p.nome AS plano
FROM alunos a
LEFT JOIN planos p
ON a.plano_id = p.id;

-- Consultar treinos com o nome do aluno
SELECT
    t.id,
    a.nome AS aluno,
    t.nome AS treino,
    t.grupo_muscular,
    t.duracao
FROM treinos t
LEFT JOIN alunos a
ON t.aluno_id = a.id;

-- Mostrar criação da tabela
SHOW CREATE TABLE alunos;
SHOW CREATE TABLE planos;
SHOW CREATE TABLE pagamentos;
SHOW CREATE TABLE treinos;

-- Mostrar índices
SHOW INDEX FROM alunos;
SHOW INDEX FROM planos;
SHOW INDEX FROM pagamentos;
SHOW INDEX FROM treinos;

-- Mostrar chaves estrangeiras
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'fitness_academia'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Apagar todos os dados (cuidado!)
DELETE FROM pagamentos;
DELETE FROM treinos;
DELETE FROM alunos;
DELETE FROM planos;

-- Reiniciar AUTO_INCREMENT
ALTER TABLE alunos AUTO_INCREMENT = 1;
ALTER TABLE planos AUTO_INCREMENT = 1;
ALTER TABLE pagamentos AUTO_INCREMENT = 1;
ALTER TABLE treinos AUTO_INCREMENT = 1;