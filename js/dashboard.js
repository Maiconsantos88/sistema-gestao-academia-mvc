import { AlunoModel, PlanoModel, PagamentoModel, TreinoModel } from "./model/AcademiaModel.js";
import { formatarMoeda, protegerPagina, ativarMenuMobile } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const alunoModel = new AlunoModel();
const planoModel = new PlanoModel();
const pagamentoModel = new PagamentoModel();
const treinoModel = new TreinoModel();

const alunos = alunoModel.listar();
const planos = planoModel.listar();
const pagamentos = pagamentoModel.listar();
const treinos = treinoModel.listar();

document.getElementById("totalAlunos").textContent = alunos.filter(a => a.status === "Ativo").length;
document.getElementById("totalPlanos").textContent = planos.length;
document.getElementById("totalTreinos").textContent = treinos.length;

const receita = pagamentos
  .filter(p => p.status === "Pago")
  .reduce((total, p) => total + Number(p.valor), 0);

document.getElementById("receitaMes").textContent = formatarMoeda(receita);

const listaRecentes = document.getElementById("alunosRecentes");
listaRecentes.innerHTML = "";

alunos.slice(-5).reverse().forEach(aluno => {
  const item = document.createElement("div");
  item.className = "recent-item";
  item.innerHTML = `
    <div>
      <strong>${aluno.nome}</strong><br>
      <small>${aluno.plano}</small>
    </div>
    <span class="badge ${aluno.status}">${aluno.status}</span>
  `;
  listaRecentes.appendChild(item);
});
