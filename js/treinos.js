import { TreinoModel } from "./model/AcademiaModel.js";
import { mostrarToast, protegerPagina, ativarMenuMobile } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const model = new TreinoModel();
const form = document.getElementById("formTreino");
const nomeTreino = document.getElementById("nomeTreino");
const grupoTreino = document.getElementById("grupoTreino");
const duracaoTreino = document.getElementById("duracaoTreino");
const descricaoTreino = document.getElementById("descricaoTreino");
const tabela = document.getElementById("tabelaTreinos");

function renderizar() {
  tabela.innerHTML = "";
  model.listar().forEach(treino => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${treino.nome}</td>
      <td>${treino.grupo}</td>
      <td>${treino.duracao}</td>
      <td><button class="action-btn delete" data-id="${treino.id}">🗑️</button></td>
    `;
    tabela.appendChild(linha);
  });
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  model.cadastrar({
    nome: nomeTreino.value.trim(),
    grupo: grupoTreino.value.trim(),
    duracao: duracaoTreino.value.trim(),
    descricao: descricaoTreino.value.trim()
  });

  form.reset();
  renderizar();
  mostrarToast("Treino cadastrado com sucesso!");
});

tabela.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("delete")) {
    model.excluir(Number(evento.target.dataset.id));
    renderizar();
    mostrarToast("Treino excluído com sucesso!");
  }
});

renderizar();
