import { mostrarToast } from "./utils/helpers.js";

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch(
            "http://localhost:3000/api/login",
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

    } catch (erro) {
        console.error("Erro no login:", erro);

        mostrarToast(
            "Não foi possível conectar ao servidor.",
            "error"
        );
    }
});