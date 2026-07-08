USE fitness_academia;

-- Adiciona duração na tabela treinos
 ALTER TABLE treinos
ADD COLUMN duracao VARCHAR(50) AFTER grupo_muscular;

-- Relaciona alunos com planos
ALTER TABLE alunos
ADD COLUMN plano_id INT;

ALTER TABLE alunos
ADD CONSTRAINT fk_aluno_plano
FOREIGN KEY (plano_id)
REFERENCES planos(id);