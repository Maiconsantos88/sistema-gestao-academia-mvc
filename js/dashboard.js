import { ativarMenuMobile, formatarMoeda, protegerPagina } from "./utils/helpers.js";

protegerPagina();
ativarMenuMobile();

let alunosBusca = [];
let planosBusca = [];
let treinosBusca = [];
let pagamentosBusca = [];

function carregarPerfilAdministrador() {

const usuarioLogado = JSON.parse(
  localStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) return;

const nome = usuarioLogado.nome || "Administrador";
const email = usuarioLogado.email || "admin@academia.com";

const nomeUsuarioTopo =
  document.getElementById("nomeUsuarioTopo");

const avatarUsuarioTopo =
  document.getElementById("avatarUsuarioTopo");

const nomeUsuarioBoasVindas =
  document.getElementById("nomeUsuarioBoasVindas");

const nomeUsuarioSidebar =
  document.getElementById("nomeUsuarioSidebar");

const emailUsuarioSidebar =
  document.getElementById("emailUsuarioSidebar");

if (nomeUsuarioTopo) {
  nomeUsuarioTopo.textContent = nome;
}

if (avatarUsuarioTopo) {
  avatarUsuarioTopo.textContent =
    nome.charAt(0).toUpperCase();
}

if (nomeUsuarioBoasVindas) {
  nomeUsuarioBoasVindas.textContent = nome;
}

if (nomeUsuarioSidebar) {
  nomeUsuarioSidebar.textContent = nome;
}

if (emailUsuarioSidebar) {
  emailUsuarioSidebar.textContent = email;
}
}

async function carregarDashboard() {
  try {
    const [
      respostaAlunos,
      respostaPlanos,
      respostaTreinos,
      respostaPagamentos
    ] = await Promise.all([
      fetch("https://sistema-gestao-academia-mvc.onrender.com/api/alunos"),
      fetch("https://sistema-gestao-academia-mvc.onrender.com/api/planos"),
      fetch("https://sistema-gestao-academia-mvc.onrender.com/api/treinos"),
      fetch("https://sistema-gestao-academia-mvc.onrender.com/api/pagamentos")
    ]);

    const alunos = await respostaAlunos.json();
    const planos = await respostaPlanos.json();
    const treinos = await respostaTreinos.json();
    const pagamentos = await respostaPagamentos.json();

    alunosBusca = alunos;
    planosBusca = planos;
    treinosBusca = treinos;
    pagamentosBusca = pagamentos;

    document.getElementById("totalAlunos").textContent =
      alunos.filter((aluno) => aluno.status === "Ativo").length;

    document.getElementById("totalPlanos").textContent = planos.length;
    document.getElementById("totalTreinos").textContent = treinos.length;

    const receita = pagamentos
      .filter((pagamento) => pagamento.status === "Pago")
      .reduce(
        (total, pagamento) =>
          total + Number(pagamento.valor),
        0
      );

    document.getElementById("receitaMes").textContent =
      formatarMoeda(receita);

    const listaRecentes =
      document.getElementById("alunosRecentes");

    listaRecentes.innerHTML = "";

    alunos
      .slice(-5)
      .reverse()
      .forEach((aluno) => {
        const item = document.createElement("div");
        item.className = "recent-item";

        item.innerHTML = `
                    <div>
                        <strong>${aluno.nome}</strong><br>
                        <small>${aluno.plano || "Sem plano"}</small>
                    </div>

                    <span class="badge ${aluno.status}">
                        ${aluno.status}
                    </span>
                `;

        listaRecentes.appendChild(item);
      });
  } catch (erro) {
    console.error("Erro ao carregar Dashboard:", erro);
  }
}

carregarDashboard();

const btnNotificacoes = document.getElementById("btnNotificacoes");
const painelNotificacoes = document.getElementById("painelNotificacoes");

const btnConfiguracoes = document.getElementById("btnConfiguracoes");
const menuConfiguracoes = document.getElementById("menuConfiguracoes");

const btnSairTopo = document.getElementById("btnSairTopo");
const btnPerfilTopo = document.getElementById("btnPerfilTopo");
const btnPerfil = document.getElementById("btnPerfil");

btnPerfilTopo.addEventListener("click", (evento) => {
  evento.stopPropagation();

  menuConfiguracoes.classList.toggle("hidden");
  painelNotificacoes.classList.add("hidden");
});

btnPerfil.addEventListener("click", (evento) => {
  evento.stopPropagation();
  window.location.href = "perfil.html";
});

btnNotificacoes.addEventListener("click", () => {
  painelNotificacoes.classList.toggle("hidden");
  menuConfiguracoes.classList.add("hidden");
});

btnConfiguracoes.addEventListener("click", () => {
  menuConfiguracoes.classList.toggle("hidden");
  painelNotificacoes.classList.add("hidden");
});

btnSairTopo.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
});

document.addEventListener("click", (evento) => {
  if (
    !evento.target.closest(".menu-topo") &&
    !evento.target.closest(".perfil-topo")
  ) {
    painelNotificacoes.classList.add("hidden");
    menuConfiguracoes.classList.add("hidden");
  }
});

const btnAbrirConfiguracoes =
  document.getElementById("btnAbrirConfiguracoes");

const modalConfiguracoes =
  document.getElementById("modalConfiguracoes");

const btnFecharConfiguracoes =
  document.getElementById("btnFecharConfiguracoes");

const temaSistema =
  document.getElementById("temaSistema");

function aplicarTema(tema) {
  const sistemaEscuro = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const usarEscuro =
    tema === "dark" ||
    (tema === "system" && sistemaEscuro);

  document.body.classList.toggle(
    "dark-mode",
    usarEscuro
  );
}

btnAbrirConfiguracoes.addEventListener("click", (evento) => {
  evento.stopPropagation();

  modalConfiguracoes.classList.remove("hidden");
  menuConfiguracoes.classList.add("hidden");
});

btnFecharConfiguracoes.addEventListener("click", () => {
  modalConfiguracoes.classList.add("hidden");
});

modalConfiguracoes.addEventListener("click", (evento) => {
  if (evento.target === modalConfiguracoes) {
    modalConfiguracoes.classList.add("hidden");
  }
});

const temaSalvo =
  localStorage.getItem("temaSistema") || "system";

temaSistema.value = temaSalvo;
aplicarTema(temaSalvo);

temaSistema.addEventListener("change", () => {
  const temaSelecionado = temaSistema.value;

  localStorage.setItem(
    "temaSistema",
    temaSelecionado
  );

  aplicarTema(temaSelecionado);
});

const buscaGlobal = document.getElementById("buscaGlobal");
const resultadoBusca = document.getElementById("resultadoBusca");

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function criarResultado(tipo, titulo, detalhe, pagina, id) {
  return {
    tipo,
    titulo,
    detalhe,
    pagina,
    id
  };
}


buscaGlobal.addEventListener("input", () => {
  const termo = normalizarTexto(buscaGlobal.value.trim());

  if (termo.length < 2) {
    resultadoBusca.innerHTML = "";
    resultadoBusca.classList.add("hidden");
    return;
  }

  const resultados = [];

  alunosBusca.forEach((aluno) => {
    const texto = normalizarTexto(
      `${aluno.nome} ${aluno.email} ${aluno.telefone} ${aluno.plano}`
    );

    if (texto.includes(termo)) {
      resultados.push(
        criarResultado(
          "👤 Aluno",
          aluno.nome,
          aluno.email || aluno.plano || "",
          "alunos.html",
          aluno.id
        )
      );
    }
  });

  planosBusca.forEach((plano) => {
    const texto = normalizarTexto(
      `${plano.nome} ${plano.valor} ${plano.duracao}`
    );

    if (texto.includes(termo)) {
      resultados.push(
        criarResultado(
          "📋 Plano",
          plano.nome,
          plano.valor
            ? formatarMoeda(plano.valor)
            : "",
          "planos.html",
          plano.id
        )
      );
    }
  });

  treinosBusca.forEach((treino) => {
    const texto = normalizarTexto(
      `${treino.nome} ${treino.aluno} ${treino.grupo_muscular} ${treino.descricao}`
    );

    if (texto.includes(termo)) {
      resultados.push(
        criarResultado(
          "🏋️ Treino",
          treino.nome,
          treino.aluno,
          "treinos.html",
          treino.id
        )
      );
    }
  });

  pagamentosBusca.forEach((pagamento) => {
    const texto = normalizarTexto(
      `${pagamento.aluno} ${pagamento.valor} ${pagamento.status}`
    );

    if (texto.includes(termo)) {
      resultados.push(
        criarResultado(
          "💳 Pagamento",
          pagamento.aluno,
          `${formatarMoeda(pagamento.valor)} • ${pagamento.status}`,
          "pagamentos.html",
          pagamento.id
        )
      );
    }
  });

  resultadoBusca.innerHTML = "";

  if (resultados.length === 0) {
    resultadoBusca.innerHTML = `
            <div class="resultado-item">
                <strong>Nenhum resultado encontrado</strong>
                <small>Tente outro termo.</small>
            </div>
        `;
  } else {
    resultados.slice(0, 8).forEach((resultado) => {
      const item = document.createElement("div");
      item.className = "resultado-item";

      item.innerHTML = `
    <strong>${resultado.titulo}</strong>
    <small>${resultado.tipo}</small>
    <small>${resultado.detalhe}</small>
`;

      item.addEventListener("click", () => {
        const destino = resultado.id
          ? `${resultado.pagina}?id=${resultado.id}`
          : resultado.pagina;

        window.location.href = destino;
      });

      resultadoBusca.appendChild(item);
    });
  }

  resultadoBusca.classList.remove("hidden");
});

document.addEventListener("click", (evento) => {
  if (
    !evento.target.closest("#buscaGlobal") &&
    !evento.target.closest("#resultadoBusca")
  ) {
    resultadoBusca.classList.add("hidden");
  }
});

carregarPerfilAdministrador();