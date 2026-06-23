import { PlanoModel } from "./model/AcademiaModel.js";
import { mostrarToast, formatarMoeda, protegerPagina, ativarMenuMobile } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const model = new PlanoModel();
const form = document.getElementById("formPlano");
const planoId = document.getElementById("planoId");
const nomePlano = document.getElementById("nomePlano");
const valorPlano = document.getElementById("valorPlano");
const duracaoPlano = document.getElementById("duracaoPlano");
const tabela = document.getElementById("tabelaPlanos");
const btnCancelar = document.getElementById("btnCancelar");

function limpar() {
  form.reset();
  planoId.value = "";
}

function renderizar() {
  tabela.innerHTML = "";
  model.listar().forEach(plano => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${plano.nome}</td>
      <td>${formatarMoeda(plano.valor)}</td>
      <td>${plano.duracao}</td>
      <td>
        <button class="action-btn edit" data-id="${plano.id}">✏️</button>
        <button class="action-btn delete" data-id="${plano.id}">🗑️</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = {
    nome: nomePlano.value.trim(),
    valor: Number(valorPlano.value),
    duracao: duracaoPlano.value
  };

  if (planoId.value) {
    model.atualizar(Number(planoId.value), dados);
    mostrarToast("Plano atualizado com sucesso!");
  } else {
    model.cadastrar(dados);
    mostrarToast("Plano cadastrado com sucesso!");
  }

  limpar();
  renderizar();
});

btnCancelar.addEventListener("click", limpar);

tabela.addEventListener("click", (evento) => {
  const id = Number(evento.target.dataset.id);

  if (evento.target.classList.contains("edit")) {
    const plano = model.buscarPorId(id);
    planoId.value = plano.id;
    nomePlano.value = plano.nome;
    valorPlano.value = plano.valor;
    duracaoPlano.value = plano.duracao;
  }

  if (evento.target.classList.contains("delete")) {
    if (confirm("Deseja excluir este plano?")) {
      model.excluir(id);
      renderizar();
      mostrarToast("Plano excluído com sucesso!");
    }
  }
});

renderizar();
