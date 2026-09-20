import { AlunoModel, PlanoModel } from "./model/AcademiaModel.js";
import { ativarMenuMobile, emailValido, mascaraTelefone, mostrarToast, protegerPagina } from "./utils/helpers.js";

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

async function carregarPlanos() {
    const resposta = await fetch("https://sistema-gestao-academia-mvc.onrender.com/api/planos");
    const planos = await resposta.json();

    plano.innerHTML = '<option value="">Selecione um plano</option>';

    planos.forEach(item => {
        plano.innerHTML += `
            <option value="${item.id}">${item.nome}</option>
        `;
    });
}

function limparFormulario() {
    form.reset();
    alunoId.value = "";
}

function renderizarTabela(dados = model.listar()) {
    tabela.innerHTML = "";

    if (dados.length === 0) {
        tabela.innerHTML =
            '<tr><td colspan="6">Nenhum aluno cadastrado.</td></tr>';
        return;
    }

    dados.forEach(aluno => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${aluno.telefone}</td>
            <td>${aluno.plano}</td>
            <td>${aluno.status}</td>
            <td class="acoes">
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
        plano_id: Number(plano.value),
        dataInicio: dataInicio.value,
        status: statusAluno.value,
        observacoes: observacoes.value.trim()
    };

    if (alunoId.value) {
        fetch(`https://sistema-gestao-academia-mvc.onrender.com/api/alunos/${alunoId.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(() => {
                mostrarToast("Aluno atualizado no banco com sucesso!");
                limparFormulario();
                location.reload();
            })
            .catch(error => {
                console.error(error);
                mostrarToast("Erro ao atualizar aluno.", "error");
            });
    } else {

        fetch('https://sistema-gestao-academia-mvc.onrender.com/api/alunos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
            .then(response => response.json())
            .then(() => {
                mostrarToast("Aluno cadastrado no banco com sucesso!");
                limparFormulario();
                location.reload();
            })
            .catch(error => {
                console.error(error);
                mostrarToast("Erro ao cadastrar aluno.", "error");
            });

    }

    limparFormulario();
    renderizarTabela();
});

btnCancelar.addEventListener("click", limparFormulario);

busca.addEventListener("input", () => {
    renderizarTabela(model.pesquisar(busca.value));
});

tabela.addEventListener("click", async (evento) => {
    if (evento.target.classList.contains("edit")) {
        const id = Number(evento.target.dataset.id);

        try {
            const resposta = await fetch("https://sistema-gestao-academia-mvc.onrender.com/api/alunos");
            const alunos = await resposta.json();

            const aluno = alunos.find(
                (item) => Number(item.id) === id
            );

            if (!aluno) {
                mostrarToast("Aluno não encontrado.", "error");
                return;
            }

            alunoId.value = aluno.id;
            nome.value = aluno.nome || "";
            email.value = aluno.email || "";
            telefone.value = aluno.telefone || "";

            plano.value = aluno.plano_id || "";

            dataInicio.value = aluno.data_inicio
                ? aluno.data_inicio.split("T")[0]
                : "";

            statusAluno.value = aluno.status || "Ativo";
            observacoes.value = aluno.observacoes || "";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            mostrarToast(
                "Aluno carregado para edição.",
                "success"
            );
        } catch (erro) {
            console.error("Erro ao carregar aluno:", erro);

            mostrarToast(
                "Erro ao carregar aluno.",
                "error"
            );
        }
    }

    if (evento.target.classList.contains("delete")) {
    const id = Number(evento.target.dataset.id);

    const confirmar = confirm("Deseja realmente excluir este aluno?");

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `https://sistema-gestao-academia-mvc.onrender.com/api/alunos/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!resposta.ok) {
            mostrarToast(
                "Erro ao excluir aluno.",
                "error"
            );
            return;
        }

        mostrarToast(
            "Aluno excluído com sucesso!",
            "success"
        );

        location.reload();

    } catch (erro) {
        console.error("Erro ao excluir aluno:", erro);

        mostrarToast(
            "Erro ao excluir aluno.",
            "error"
        );
    }
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

fetch('https://sistema-gestao-academia-mvc.onrender.com/api/alunos')
    .then(response => response.json())
    .then(dados => {
        console.log(dados);

        tabela.innerHTML = '';

        dados.forEach(aluno => {
            tabela.innerHTML += `
                <tr>
                    <td>${aluno.nome}</td>
                    <td>${aluno.email}</td>
                    <td>${aluno.telefone}</td>
                    <td>${aluno.plano}</td>
                    <td>${aluno.status}</td>
                   <td>
    <button class="btn-edit" data-id="${aluno.id}">
        ✏️
    </button>

    <button class="btn-delete" data-id="${aluno.id}">
        🗑️
    </button>
</td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });

async function abrirAlunoDaBusca() {
    const parametros = new URLSearchParams(window.location.search);
    const idRecebido = Number(parametros.get("id"));

    if (!idRecebido) {
        return;
    }

    try {
        await carregarPlanos();

        const resposta = await fetch(
            "https://sistema-gestao-academia-mvc.onrender.com/api/alunos"
        );

        const alunos = await resposta.json();

        const aluno = alunos.find(
            (item) => Number(item.id) === idRecebido
        );

        if (!aluno) {
            mostrarToast("Aluno não encontrado.", "error");
            return;
        }

        alunoId.value = aluno.id;
        nome.value = aluno.nome || "";
        email.value = aluno.email || "";
        telefone.value = aluno.telefone || "";
        plano.value = aluno.plano_id || "";

        dataInicio.value = aluno.data_inicio
            ? aluno.data_inicio.split("T")[0]
            : "";

        statusAluno.value = aluno.status || "Ativo";
        observacoes.value = aluno.observacoes || "";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        mostrarToast(
            "Aluno carregado para edição.",
            "success"
        );
    } catch (erro) {
        console.error("Erro ao carregar aluno:", erro);

        mostrarToast(
            "Erro ao carregar os dados do aluno.",
            "error"
        );
    }
}
abrirAlunoDaBusca();