import { ativarMenuMobile, formatarMoeda, mostrarToast, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

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

async function carregarPlanos() {
    const resposta = await fetch("http://localhost:3000/api/planos");
    const planos = await resposta.json();

    tabela.innerHTML = "";

    planos.forEach(plano => {
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

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
        nome: nomePlano.value.trim(),
        valor: Number(valorPlano.value),
        duracao: duracaoPlano.value
    };

    if (planoId.value) {
        await fetch(`http://localhost:3000/api/planos/${planoId.value}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        mostrarToast("Plano atualizado com sucesso!");
    } else {
        await fetch("http://localhost:3000/api/planos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        mostrarToast("Plano cadastrado com sucesso!");
    }

    limpar();
    carregarPlanos();
});

btnCancelar.addEventListener("click", limpar);

tabela.addEventListener("click", async (evento) => {
    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("edit")) {
        const linha = evento.target.closest("tr");
        const colunas = linha.querySelectorAll("td");

        planoId.value = id;
        nomePlano.value = colunas[0].innerText;
        valorPlano.value = colunas[1].innerText.replace("R$", "").replace(".", "").replace(",", ".").trim();
        duracaoPlano.value = colunas[2].innerText;
    }

    if (evento.target.classList.contains("delete")) {
        if (confirm("Deseja excluir este plano?")) {
            await fetch(`http://localhost:3000/api/planos/${id}`, {
                method: "DELETE"
            });

            mostrarToast("Plano excluído com sucesso!");
            carregarPlanos();
        }
    }
});

async function abrirPlanoDaBusca() {
    const parametros = new URLSearchParams(window.location.search);
    const idRecebido = Number(parametros.get("id"));

    if (!idRecebido) {
        return;
    }

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/planos"
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os planos.");
        }

        const planos = await resposta.json();

        const plano = planos.find(
            (item) => Number(item.id) === idRecebido
        );

        if (!plano) {
            mostrarToast("Plano não encontrado.", "error");
            return;
        }

        planoId.value = plano.id;
        nomePlano.value = plano.nome || "";
        valorPlano.value = plano.valor || "";
        duracaoPlano.value = plano.duracao || "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        mostrarToast(
            "Plano carregado para edição.",
            "success"
        );
    } catch (erro) {
        console.error("Erro ao carregar plano:", erro);

        mostrarToast(
            "Erro ao carregar os dados do plano.",
            "error"
        );
    }
}

carregarPlanos();
abrirPlanoDaBusca();
