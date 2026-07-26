import { ativarMenuMobile, formatarMoeda, mostrarToast, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const form = document.getElementById("formPagamento");
const alunoPagamento = document.getElementById("alunoPagamento");
const valorPagamento = document.getElementById("valorPagamento");
const dataPagamento = document.getElementById("dataPagamento");
const statusPagamento = document.getElementById("statusPagamento");
const tabela = document.getElementById("tabelaPagamentos");
let pagamentoEditando = null;

async function carregarAlunos() {
    const resposta = await fetch("http://localhost:3000/api/alunos");
    const alunos = await resposta.json();

    alunoPagamento.innerHTML = '<option value="">Selecione um aluno</option>';

    alunos.forEach(aluno => {
        alunoPagamento.innerHTML += `
            <option value="${aluno.id}">${aluno.nome}</option>
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
            <td>${new Date(pagamento.data_pagamento).toLocaleDateString("pt-BR")}</td>
            <td>${pagamento.status}</td>
            <td class="acoes">
    <button class="action-btn edit" data-id="${pagamento.id}">
        ✏️
    </button>
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

    const url = pagamentoEditando
        ? `http://localhost:3000/api/pagamentos/${pagamentoEditando}`
        : "http://localhost:3000/api/pagamentos";

    const metodo = pagamentoEditando ? "PUT" : "POST";

    await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    mostrarToast(
        pagamentoEditando
            ? "Pagamento atualizado com sucesso!"
            : "Pagamento cadastrado com sucesso!"
    );

    pagamentoEditando = null;
    form.reset();
    carregarPagamentos();

});

tabela.addEventListener("click", async (evento) => {
    const id = evento.target.dataset.id;

    if (evento.target.classList.contains("edit")) {
        const resposta = await fetch("http://localhost:3000/api/pagamentos");
        const pagamentos = await resposta.json();

        const pagamento = pagamentos.find(
            (item) => Number(item.id) === Number(id)
        );

        if (!pagamento) {
            mostrarToast("Pagamento não encontrado.", "error");
            return;
        }

        pagamentoEditando = pagamento.id;

        alunoPagamento.value = pagamento.aluno_id;
        valorPagamento.value = pagamento.valor;
        dataPagamento.value = pagamento.data_pagamento.split("T")[0];
        statusPagamento.value = pagamento.status;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }

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