import { AlunoModel, PagamentoModel } from "./model/AcademiaModel.js";
import { mostrarToast, formatarMoeda, protegerPagina, ativarMenuMobile } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const alunoModel = new AlunoModel();
const model = new PagamentoModel();

const form = document.getElementById("formPagamento");
const alunoPagamento = document.getElementById("alunoPagamento");
const valorPagamento = document.getElementById("valorPagamento");
const dataPagamento = document.getElementById("dataPagamento");
const statusPagamento = document.getElementById("statusPagamento");
const tabela = document.getElementById("tabelaPagamentos");

function carregarAlunos() {
  alunoPagamento.innerHTML = `<option value="">Selecione um aluno</option>`;
  alunoModel.listar().forEach(aluno => {
    alunoPagamento.innerHTML += `<option value="${aluno.nome}">${aluno.nome}</option>`;
  });
}

function renderizar() {
  tabela.innerHTML = "";

  model.listar().forEach(pagamento => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${pagamento.aluno}</td>
      <td>${formatarMoeda(pagamento.valor)}</td>
      <td>${pagamento.data}</td>
      <td><span class="badge ${pagamento.status}">${pagamento.status}</span></td>
      <td><button class="action-btn delete" data-id="${pagamento.id}">🗑️</button></td>
    `;
    tabela.appendChild(linha);
  });
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  model.cadastrar({
    aluno: alunoPagamento.value,
    valor: Number(valorPagamento.value),
    data: dataPagamento.value,
    status: statusPagamento.value
  });

  form.reset();
  renderizar();
  mostrarToast("Pagamento registrado com sucesso!");
});

tabela.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("delete")) {
    model.excluir(Number(evento.target.dataset.id));
    renderizar();
    mostrarToast("Pagamento excluído com sucesso!");
  }
});

carregarAlunos();
renderizar();
