import { ativarMenuMobile, formatarMoeda, mostrarToast, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const form = document.getElementById("formPagamento");
const alunoPagamento = document.getElementById("alunoPagamento");
const valorPagamento = document.getElementById("valorPagamento");
const dataPagamento = document.getElementById("dataPagamento");
const statusPagamento = document.getElementById("statusPagamento");
const tabela = document.getElementById("tabelaPagamentos");

async function carregarAlunos() {
    const resposta = await fetch("http://localhost:3000/api/alunos");
    const alunos = await resposta.json();

    alunoPagamento.innerHTML = '<option value="">Selecione um aluno</option>';

    alunos.forEach(aluno => {
        alunoPagamento.innerHTML += `
            <option value="${aluno.nome}">${aluno.nome}</option>
        `;
    });
}

async function carregarPagamentos() {
    const resposta = await fetch("http://localhost:3000/api/pagamentos");
    const pagamentos = await resposta.json();

    tabela.innerHTML = "";

    pagamentos.forEach(pagamento => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${pagamento.aluno}</td>
            <td>${formatarMoeda(pagamento.valor)}</td>
            <td>${pagamento.data_pagamento}</td>
            <td>${pagamento.status}</td>
            <td>
                <button class="action-btn delete" data-id="${pagamento.id}">🗑️</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
        aluno: alunoPagamento.value,
        valor: Number(valorPagamento.value),
        data_pagamento: dataPagamento.value,
        status: statusPagamento.value
    };

    await fetch("http://localhost:3000/api/pagamentos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    mostrarToast("Pagamento cadastrado com sucesso!");
    form.reset();
    carregarPagamentos();
});

tabela.addEventListener("click", async (evento) => {
    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("delete")) {
        if (confirm("Deseja excluir este pagamento?")) {
            await fetch(`http://localhost:3000/api/pagamentos/${id}`, {
                method: "DELETE"
            });

            mostrarToast("Pagamento excluído com sucesso!");
            carregarPagamentos();
        }
    }
});

carregarAlunos();
carregarPagamentos();