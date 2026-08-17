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
function carregarPerfil() {
    const perfilSalvo = JSON.parse(localStorage.getItem("perfilAdmin"));

    if (perfilSalvo) {
        perfilNome.value = perfilSalvo.nome || "Administrador";
        perfilEmail.value = perfilSalvo.email || "admin@academia.com";
        perfilCargo.value = perfilSalvo.cargo || "Administrador";
        doisFatores.checked = perfilSalvo.doisFatores || false;
        nomePerfilTopo.textContent = perfilSalvo.nome || "Administrador";
        cargoPerfilTopo.textContent = perfilSalvo.cargo || "Administrador do sistema";
        const nome = perfilSalvo.nome || "Administrador";

        avatarPerfilGrande.textContent =
            nome.charAt(0).toUpperCase();
    }
}

formPerfil.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!perfilNome.value.trim()) {
        mostrarToast("Informe o nome.", "error");
        return;
    }

    if (!perfilEmail.value.trim()) {
        mostrarToast("Informe o e-mail.", "error");
        return;
    }

    // Validação da nova senha
    if (novaSenha.value || confirmarSenha.value) {

        if (!senhaAtual.value) {
            mostrarToast("Informe a senha atual.", "error");
            return;
        }

        if (novaSenha.value.length < 6) {
            mostrarToast(
                "A nova senha deve ter pelo menos 6 caracteres.",
                "error"
            );
            return;
        }

        if (novaSenha.value !== confirmarSenha.value) {
            mostrarToast("As novas senhas não coincidem.", "error");
            return;
        }
    }

    const perfil = {
        nome: perfilNome.value.trim(),
        email: perfilEmail.value.trim(),
        cargo: perfilCargo.value.trim(),
        doisFatores: doisFatores.checked
    };

    localStorage.setItem(
        "perfilAdmin",
        JSON.stringify(perfil)
    );

    nomePerfilTopo.textContent = perfil.nome;
    cargoPerfilTopo.textContent = perfil.cargo;

    avatarPerfilGrande.textContent =
        perfil.nome.charAt(0).toUpperCase();

    mostrarToast(
        "Perfil atualizado com sucesso!",
        "success"
    );

    senhaAtual.value = "";
    novaSenha.value = "";
    confirmarSenha.value = "";
});

carregarPerfil();