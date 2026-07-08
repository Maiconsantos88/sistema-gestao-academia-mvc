import { ativarMenuMobile, mostrarToast, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const form = document.getElementById("formTreino");
const nomeTreino = document.getElementById("nomeTreino");
const grupoTreino = document.getElementById("grupoTreino");
const descricaoTreino = document.getElementById("descricaoTreino");
const tabela = document.getElementById("tabelaTreinos");

async function carregarTreinos() {
    const resposta = await fetch("http://localhost:3000/api/treinos");
    const treinos = await resposta.json();

    tabela.innerHTML = "";

    treinos.forEach(treino => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${treino.nome}</td>
            <td>${treino.grupo_muscular}</td>
            <td>${treino.duracao}</td>
            <td>${treino.descricao}</td>
            <td>
                <button class="action-btn delete" data-id="${treino.id}">🗑️</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
        nome: nomeTreino.value.trim(),
        grupo_muscular: grupoTreino.value.trim(),
        duracao: duracaoTreino.value.trim(),
        descricao: descricaoTreino.value.trim()
    };

    await fetch("http://localhost:3000/api/treinos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    mostrarToast("Treino cadastrado com sucesso!");
    form.reset();
    carregarTreinos();
});

tabela.addEventListener("click", async (evento) => {
    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("delete")) {
        if (confirm("Deseja excluir este treino?")) {
            await fetch(`http://localhost:3000/api/treinos/${id}`, {
                method: "DELETE"
            });

            mostrarToast("Treino excluído com sucesso!");
            carregarTreinos();
        }
    }
});

carregarTreinos();