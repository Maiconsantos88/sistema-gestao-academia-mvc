import { ativarMenuMobile, mostrarToast, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const form = document.getElementById("formTreino");
const alunoTreino = document.getElementById("alunoTreino");
const nomeTreino = document.getElementById("nomeTreino");
const grupoTreino = document.getElementById("grupoTreino");
const descricaoTreino = document.getElementById("descricaoTreino");
const tabela = document.getElementById("tabelaTreinos");

let treinoEditando = null;

async function carregarAlunos() {
    try {
        const resposta = await fetch("http://localhost:3000/api/alunos");
        const alunos = await resposta.json();

        alunoTreino.innerHTML =
            '<option value="">Selecione um aluno</option>';

        alunos.forEach((aluno) => {
            alunoTreino.innerHTML += `
                <option value="${aluno.id}">${aluno.nome}</option>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        mostrarToast("Erro ao carregar alunos.", "error");
    }
}

async function carregarTreinos() {
    const resposta = await fetch("http://localhost:3000/api/treinos");
    const treinos = await resposta.json();

    tabela.innerHTML = "";

    treinos.forEach(treino => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${treino.aluno}</td>
            <td>${treino.nome}</td>
            <td>${treino.grupo_muscular}</td>
            <td>${treino.duracao}</td>
            <td title="${treino.descricao || ''}">${treino.descricao || ''}</td>
            <td class="acoes">
    <button class="action-btn edit" data-id="${treino.id}">✏️</button>
    <button class="action-btn delete" data-id="${treino.id}">🗑️</button>
</td>
        `;

        tabela.appendChild(linha);
    });
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
        aluno_id: Number(alunoTreino.value),
        nome: nomeTreino.value.trim(),
        grupo_muscular: grupoTreino.value.trim(),
        duracao: duracaoTreino.value.trim(),
        descricao: descricaoTreino.value.trim()
    };

    const url = treinoEditando
        ? `http://localhost:3000/api/treinos/${treinoEditando}`
        : "http://localhost:3000/api/treinos";

    const metodo = treinoEditando ? "PUT" : "POST";

    await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    mostrarToast(
        treinoEditando
            ? "Treino atualizado com sucesso!"
            : "Treino cadastrado com sucesso!"
    );

    treinoEditando = null;
    form.reset();
    carregarTreinos();

});

tabela.addEventListener("click", async (evento) => {
    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("edit")) {
        const resposta = await fetch("http://localhost:3000/api/treinos");
        const treinos = await resposta.json();

        const treino = treinos.find(
            (item) => Number(item.id) === Number(id)
        );

        if (!treino) {
            mostrarToast("Treino não encontrado.", "error");
            return;
        }

        treinoEditando = treino.id;

        alunoTreino.value = treino.aluno_id;
        nomeTreino.value = treino.nome;
        grupoTreino.value = treino.grupo_muscular;
        duracaoTreino.value = treino.duracao;
        descricaoTreino.value = treino.descricao || "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

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

carregarAlunos();
carregarTreinos();