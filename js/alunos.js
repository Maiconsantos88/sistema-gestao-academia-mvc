import { AlunoModel, PlanoModel } from "./model/AcademiaModel.js";
import { mostrarToast, mascaraTelefone, emailValido, protegerPagina, ativarMenuMobile } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const model = new AlunoModel();
const planoModel = new PlanoModel();

const form = document.getElementById("formAluno");
const alunoId = document.getElementById("alunoId");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const plano = document.getElementById("plano");
const dataInicio = document.getElementById("dataInicio");
const statusAluno = document.getElementById("status");
const observacoes = document.getElementById("observacoes");
const tabela = document.getElementById("tabelaAlunos");
const busca = document.getElementById("busca");
const btnCancelar = document.getElementById("btnCancelar");
const modal = document.getElementById("modalConfirmacao");
const btnSimExcluir = document.getElementById("btnSimExcluir");
const btnNaoExcluir = document.getElementById("btnNaoExcluir");

let idParaExcluir = null;

function carregarPlanos() {
  plano.innerHTML = `<option value="">Selecione um plano</option>`;
  planoModel.listar().forEach(item => {
    plano.innerHTML += `<option value="${item.nome}">${item.nome}</option>`;
  });
}

function limparFormulario() {
  form.reset();
  alunoId.value = "";
}

function renderizarTabela(dados = model.listar()) {
  tabela.innerHTML = "";

  if (dados.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6">Nenhum aluno cadastrado.</td></tr>`;
    return;
  }

  dados.forEach(aluno => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td>${aluno.telefone}</td>
      <td>${aluno.plano}</td>
      <td><span class="badge ${aluno.status}">${aluno.status}</span></td>
      <td>
        <button class="action-btn edit" data-id="${aluno.id}">✏️</button>
        <button class="action-btn delete" data-id="${aluno.id}">🗑️</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

telefone.addEventListener("input", () => {
  telefone.value = mascaraTelefone(telefone.value);
});

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!emailValido(email.value)) {
    mostrarToast("Digite um e-mail válido.", "error");
    return;
  }

  const dados = {
    nome: nome.value.trim(),
    email: email.value.trim(),
    telefone: telefone.value.trim(),
    plano: plano.value,
    dataInicio: dataInicio.value,
    status: statusAluno.value,
    observacoes: observacoes.value.trim()
  };

  if (alunoId.value) {
    model.atualizar(Number(alunoId.value), dados);
    mostrarToast("Aluno atualizado com sucesso!");
  } else {
    model.cadastrar(dados);
    mostrarToast("Aluno cadastrado com sucesso!");
  }

  limparFormulario();
  renderizarTabela();
});

btnCancelar.addEventListener("click", limparFormulario);

busca.addEventListener("input", () => {
  renderizarTabela(model.pesquisar(busca.value));
});

tabela.addEventListener("click", (evento) => {
  const id = Number(evento.target.dataset.id);

  if (evento.target.classList.contains("edit")) {
    const aluno = model.buscarPorId(id);
    alunoId.value = aluno.id;
    nome.value = aluno.nome;
    email.value = aluno.email;
    telefone.value = aluno.telefone;
    plano.value = aluno.plano;
    dataInicio.value = aluno.dataInicio;
    statusAluno.value = aluno.status;
    observacoes.value = aluno.observacoes;
    mostrarToast("Aluno carregado para edição.");
  }

  if (evento.target.classList.contains("delete")) {
    idParaExcluir = id;
    modal.classList.remove("hidden");
  }
});

btnNaoExcluir.addEventListener("click", () => {
  modal.classList.add("hidden");
});

btnSimExcluir.addEventListener("click", () => {
  model.excluir(idParaExcluir);
  modal.classList.add("hidden");
  renderizarTabela();
  mostrarToast("Aluno excluído com sucesso!");
});

carregarPlanos();
renderizarTabela();
