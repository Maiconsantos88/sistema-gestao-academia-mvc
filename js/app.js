import { mostrarToast } from "./utils/helpers.js";

const formLogin = document.getElementById("formLogin");
const campo2FA = document.getElementById("campo2FA");
const codigo2FA = document.getElementById("codigo2FA");

let usuario2FAId = null;

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
        // Se o sistema ainda não pediu 2FA, faz o login normal
        if (!usuario2FAId) {
            const resposta = await fetch(
                "https://sistema-gestao-academia-mvc.onrender.com/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                mostrarToast(
                    dados.erro || "E-mail ou senha inválidos.",
                    "error"
                );
                return;
            }

            // Se o usuário tem 2FA ativado
            if (dados.requer2FA) {
                usuario2FAId = dados.usuarioId;

                campo2FA.style.display = "block";
                codigo2FA.focus();

                mostrarToast(
                    "Digite o código de autenticação em dois fatores.",
                    "success"
                );

                return;
            }

            // Login sem 2FA
            localStorage.setItem("fitness_logado", "sim");

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(dados.usuario)
            );

            mostrarToast(
                "Login realizado com sucesso!",
                "success"
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

            return;
        }

        // Se chegou aqui, o sistema está aguardando o código 2FA
        const codigo = codigo2FA.value.trim();

        if (!codigo) {
            mostrarToast(
                "Informe o código de autenticação.",
                "error"
            );
            return;
        }

        const resposta2FA = await fetch(
            `https://sistema-gestao-academia-mvc.onrender.com/api/usuarios/${usuarioId}/2fa/verificar`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codigo
                })
            }
        );

        const dados2FA = await resposta2FA.json();

        if (!resposta2FA.ok) {
            mostrarToast(
                dados2FA.erro || "Código 2FA inválido.",
                "error"
            );
            return;
        }

        localStorage.setItem("fitness_logado", "sim");

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(dados2FA.usuario)
        );

        mostrarToast(
            "Autenticação concluída com sucesso!",
            "success"
        );

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } catch (erro) {
        console.error("Erro no login:", erro);

        mostrarToast(
            "Não foi possível conectar ao servidor.",
            "error"
        );
    }
});