CREATE DATABASE IF NOT EXISTS fitness_academia;

USE fitness_academia;

CREATE TABLE alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    plano VARCHAR(50),
    status VARCHAR(20)
);

CREATE TABLE planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    valor DECIMAL(10,2),
    duracao VARCHAR(50)
);

CREATE TABLE pagamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno VARCHAR(100),
    valor DECIMAL(10,2),
    data_pagamento DATE,
    status VARCHAR(20)
);

CREATE TABLE treinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    grupo_muscular VARCHAR(100),
    descricao TEXT
);