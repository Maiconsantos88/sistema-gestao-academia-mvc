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
    const resposta = await fetch("http://localhost:3000/api/planos");
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
            <td>
             <button class="btn-edit" data-id="${aluno.id}">
                    Editar
                </button>

                <button class="btn-delete" data-id="${aluno.id}">
                    Excluir
                </button>
        `;

        tabela.appendChild(linha);
    });

    document.querySelectorAll(".btn-edit").forEach(botao => {
        botao.addEventListener("click", () => {
            alert("Editar aluno ID: " + botao.dataset.id);
        });
    });

    document.querySelectorAll(".btn-delete").forEach(botao => {
        botao.addEventListener("click", () => {
            alert("Excluir aluno ID: " + botao.dataset.id);
        });
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
        fetch(`http://localhost:3000/api/alunos/${alunoId.value}`, {
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

        fetch('http://localhost:3000/api/alunos', {
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

tabela.addEventListener("click", (evento) => {
    const id = Number(evento.target.dataset.id);

    if (evento.target.classList.contains("edit")) {
        const aluno = model.buscarPorId(id);
        alunoId.value = aluno.id;
        nome.value = aluno.nome;
        email.value = aluno.email;
        telefone.value = aluno.telefone;
        plano.value = aluno.plano_id;
        dataInicio.value = aluno.dataInicio;
        statusAluno.value = aluno.status;
        observacoes.value = aluno.observacoes;
        mostrarToast("Aluno carregado para edição.");
    }

    if (evento.target.classList.contains("delete")) {
        idParaExcluir = id;
        modal.classList.remove("hidden");
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

fetch('http://localhost:3000/api/alunos')
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

window.editarAluno = function (id) {
    alert("Editar aluno ID: " + id);
};

window.excluirAluno = function (id) {
    alert("Excluir aluno ID: " + id);
};
tabela.addEventListener("click", (evento) => {
    const id = Number(evento.target.dataset.id);
    if (evento.target.classList.contains("btn-edit")) {
        const linha = evento.target.closest("tr");
        const colunas = linha.querySelectorAll("td");

        alunoId.value = id;
        nome.value = colunas[0].innerText;
        email.value = colunas[1].innerText;
        telefone.value = colunas[2].innerText;
        plano.value = colunas[3].innerText;
        statusAluno.value = colunas[4].innerText;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    if (evento.target.classList.contains("btn-delete")) {

        if (confirm("Deseja excluir este aluno?")) {

            fetch(`http://localhost:3000/api/alunos/${id}`, {
                method: "DELETE"
            })
                .then(() => {
                    alert("Aluno excluído com sucesso!");
                    location.reload();
                })
                .catch(error => {
                    console.error(error);
                    alert("Erro ao excluir aluno.");
                });

        }
    }
});