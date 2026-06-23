export function mostrarToast(mensagem, tipo = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = mensagem;
  toast.className = `toast show ${tipo}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 2800);
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function mascaraTelefone(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2")
    .slice(0, 15);
}

export function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function protegerPagina() {
  const logado = localStorage.getItem("fitness_logado");
  if (logado !== "sim") {
    window.location.href = "index.html";
  }
}

export function sairSistema() {
  localStorage.removeItem("fitness_logado");
  window.location.href = "index.html";
}

export function ativarMenuMobile() {
  const btnMenu = document.getElementById("btnMenu");
  const sidebar = document.querySelector(".sidebar");

  if (btnMenu && sidebar) {
    btnMenu.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  const btnSair = document.getElementById("btnSair");
  if (btnSair) {
    btnSair.addEventListener("click", sairSistema);
  }
}
