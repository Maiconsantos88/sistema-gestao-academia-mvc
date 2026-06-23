import BaseStorage from "./BaseStorage.js";

export class AlunoModel extends BaseStorage {
  constructor() {
    super("fitness_alunos", [
      {
        id: 1,
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(51) 99999-1111",
        plano: "Plano Hipertrofia",
        dataInicio: "2026-06-01",
        status: "Ativo",
        observacoes: "Aluno cadastrado como exemplo."
      },
      {
        id: 2,
        nome: "Maria Oliveira",
        email: "maria@email.com",
        telefone: "(51) 99999-2222",
        plano: "Plano Emagrecimento",
        dataInicio: "2026-06-05",
        status: "Ativo",
        observacoes: "Aluno cadastrado como exemplo."
      }
    ]);
  }

  pesquisar(texto) {
    const termo = texto.toLowerCase();
    return this.listar().filter(aluno =>
      aluno.nome.toLowerCase().includes(termo) ||
      aluno.email.toLowerCase().includes(termo)
    );
  }
}

export class PlanoModel extends BaseStorage {
  constructor() {
    super("fitness_planos", [
      { id: 1, nome: "Plano Hipertrofia", valor: 149.90, duracao: "Mensal" },
      { id: 2, nome: "Plano Emagrecimento", valor: 129.90, duracao: "Mensal" },
      { id: 3, nome: "Plano Funcional", valor: 109.90, duracao: "Mensal" }
    ]);
  }
}

export class PagamentoModel extends BaseStorage {
  constructor() {
    super("fitness_pagamentos", [
      { id: 1, aluno: "João Silva", valor: 149.90, data: "2026-06-10", status: "Pago" },
      { id: 2, aluno: "Maria Oliveira", valor: 129.90, data: "2026-06-11", status: "Pendente" }
    ]);
  }
}

export class TreinoModel extends BaseStorage {
  constructor() {
    super("fitness_treinos", [
      { id: 1, nome: "Treino A - Hipertrofia", grupo: "Peito / Tríceps", duracao: "60 min", descricao: "Supino, crucifixo e tríceps." },
      { id: 2, nome: "Treino B - Costas", grupo: "Costas / Bíceps", duracao: "60 min", descricao: "Puxada, remada e rosca." }
    ]);
  }
}
