import { ativarMenuMobile, mostrarToast, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

const formPerfil = document.getElementById("formPerfil");

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
const perfilCargo = document.getElementById("perfilCargo");

const senhaAtual = document.getElementById("senhaAtual");
const novaSenha = document.getElementById("novaSenha");
const confirmarSenha = document.getElementById("confirmarSenha");

const doisFatores = document.getElementById("doisFatores");
const nomePerfilTopo = document.getElementById("nomePerfilTopo");
const cargoPerfilTopo = document.getElementById("cargoPerfilTopo");
const avatarPerfilGrande = document.getElementById("avatarPerfilGrande");

// Carrega os dados salvos
async function carregarPerfil() {
    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!usuarioLogado) {
        mostrarToast("Usuário não encontrado.", "error");
        return;
    }

    try {
        const resposta = await fetch(
            `https://sistema-gestao-academia-mvc.onrender.com/api/usuarios/${usuarioLogado.id}/perfil`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarToast(
                dados.erro || "Erro ao carregar perfil.",
                "error"
            );
            return;
        }

        perfilNome.value = dados.nome || "";
        perfilEmail.value = dados.email || "";
        perfilCargo.value = dados.cargo || "";
        doisFatores.checked = dados.doisFatores || false;

        nomePerfilTopo.textContent = dados.nome || "Administrador";
        cargoPerfilTopo.textContent = dados.cargo || "Administrador";

        avatarPerfilGrande.textContent =
            (dados.nome || "Administrador")
                .charAt(0)
                .toUpperCase();

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);

        mostrarToast(
            "Não foi possível conectar ao servidor.",
            "error"
        );
    }
}

formPerfil.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!usuarioLogado) {
        mostrarToast("Usuário não encontrado.", "error");
        return;
    }

    if (!perfilNome.value.trim()) {
        mostrarToast("Informe o nome.", "error");
        return;
    }

    if (!perfilEmail.value.trim()) {
        mostrarToast("Informe o e-mail.", "error");
        return;
    }

    if (!perfilCargo.value.trim()) {
        mostrarToast("Informe o cargo.", "error");
        return;
    }

    // A troca de senha será feita em uma rota própria
    if (
        senhaAtual.value ||
        novaSenha.value ||
        confirmarSenha.value
    ) {
        mostrarToast(
            "A alteração de senha será configurada na próxima etapa.",
            "error"
        );
        return;
    }

    const perfil = {
        nome: perfilNome.value.trim(),
        email: perfilEmail.value.trim(),
        cargo: perfilCargo.value.trim(),
        doisFatores: doisFatores.checked
    };

    try {
        const resposta = await fetch(
            `https://sistema-gestao-academia-mvc.onrender.com/api/usuarios/${usuarioLogado.id}/perfil`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(perfil)
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarToast(
                dados.erro || "Erro ao atualizar perfil.",
                "error"
            );
            return;
        }

        // Atualiza também os dados da sessão atual
        const usuarioAtualizado = {
            ...usuarioLogado,
            nome: perfil.nome,
            email: perfil.email,
            cargo: perfil.cargo,
            doisFatores: perfil.doisFatores
        };

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioAtualizado)
        );

        nomePerfilTopo.textContent = perfil.nome;
        cargoPerfilTopo.textContent = perfil.cargo;

        avatarPerfilGrande.textContent =
            perfil.nome.charAt(0).toUpperCase();

        mostrarToast(
            "Perfil atualizado com sucesso!",
            "success"
        );

    } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro);

        mostrarToast(
            "Não foi possível conectar ao servidor.",
            "error"
        );
    }
});

carregarPerfil();