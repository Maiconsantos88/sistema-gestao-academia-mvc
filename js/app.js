import { mostrarToast } from "./utils/helpers.js";

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (email === "admin@academia.com" && senha === "123456") {
    localStorage.setItem("fitness_logado", "sim");
    mostrarToast("Login realizado com sucesso!");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  } else {
    mostrarToast("E-mail ou senha inválidos.", "error");
  }
});
