/* =========================================================
   Una Melhor — script.js
   Tudo roda no navegador, os dados ficam no localStorage.
   ========================================================= */

/* ---------- Configuração ---------- */
const CATEGORIAS = {
  lixo: "🗑️ Limpeza e lixo",
  infra: "🚧 Infraestrutura",
  luz: "💡 Iluminação",
  agua: "💧 Água e saneamento",
  ambiente: "🌳 Meio ambiente",
  transito: "🚦 Trânsito",
  acessibilidade: "♿ Acessibilidade",
  espacos: "🏫 Espaços públicos"
};

const STATUS = {
  pendente: "🔴 Pendente",
  analise: "🟡 Em análise",
  andamento: "🔵 Em andamento",
  resolvido: "🟢 Resolvido"
};

// Textos da barra de progresso na tela de detalhes
const ETAPAS = [
  "REGISTRADO",
  "EM ANÁLISE",
  "EM ANDAMENTO",
  "RESOLVIDO"
];

const CHAVE = "unamelhor_dados";

/* ---------- Dados (localStorage) ---------- */
function lerProblemas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (erro) {
    console.error("Erro ao ler os dados:", erro);
    return [];
  }
}

function salvarProblemas(lista) {
  localStorage.setItem(CHAVE, JSON.stringify(lista));
}

// Escapa o texto pra ninguém conseguir injetar HTML pelo formulário
function esc(t) {
  const d = document.createElement("div");
  d.textContent = t ?? "";
  return d.innerHTML;
}

const formatarData = (iso) => {
  const data = new Date(iso);

  return Number.isNaN(data.getTime())
    ? "Data não informada"
    : data.toLocaleDateString("pt-BR");
};

/* ---------- Navegação entre telas ---------- */
function mostrarTela(nome) {
  document
    .querySelectorAll(".tela")
    .forEach(t => t.classList.remove("ativa"));

  // Se o nome não existir, volta pra home
  const tela =
    document.getElementById(nome) ||
    document.getElementById("home");

  tela.classList.add("ativa");

  // Destaca no menu a página em que a pessoa está
  document.querySelectorAll(".menu a").forEach(l =>
    l.classList.toggle(
      "atual",
      l.dataset.tela === tela.id
    )
  );

  // Fecha o menu do celular
  const menu = document.getElementById("menu");

  if (menu) {
    menu.classList.remove("aberto");
  }

  window.scrollTo(0, 0);

  // Recarrega o conteúdo toda vez que a tela abre, pra não ficar desatualizado
  if (tela.id === "home") {
    atualizarHome();
  }

  if (tela.id === "problemas") {
    renderizarLista();
  }

  if (tela.id === "dashboard") {
    renderizarDashboard();
  }

  if (tela.id === "registrar") {
    document.getElementById("sucesso").hidden = true;
  }
}

// Qualquer elemento com data-tela funciona como link de navegação
document.addEventListener("click", function (e) {
  const link = e.target.closest("[data-tela]");

  if (!link) return;

  e.preventDefault();

  mostrarTela(link.dataset.tela);
});

document
  .getElementById("menuBotao")
  .addEventListener("click", () =>
    document
      .getElementById("menu")
      .classList.toggle("aberto")
  );

// Monta as <option> dos selects (a primeira é o texto padrão)
function opcoes(obj, primeira) {
  return (
    `<option value="">${primeira}</option>` +
    Object.keys(obj)
      .map(
        k =>
          `<option value="${k}">${obj[k]}</option>`
      )
      .join("")
  );
}

document.getElementById("categoria").innerHTML =
  opcoes(
    CATEGORIAS,
    "Selecione uma categoria"
  );

document.getElementById("filtroCategoria").innerHTML =
  opcoes(
    CATEGORIAS,
    "Todas as categorias"
  );

document.getElementById("filtroStatus").innerHTML =
  opcoes(
    STATUS,
    "Todos os status"
  );

/* ---------- Registrar problema ---------- */
document
  .getElementById("formulario")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const arquivo =
      document.getElementById("imagem").files[0];

    // O localStorage tem pouco espaço, por isso o limite de 500 KB
    if (arquivo && arquivo.size > 500 * 1024) {
      alert(
        "A imagem é grande demais. Escolha uma de até 500 KB."
      );
      return;
    }

    // A foto é guardada como texto (base64), então precisa ler o arquivo antes de salvar
    const leitor = new FileReader();

    leitor.onload = () =>
      salvarNovo(
        arquivo ? leitor.result : ""
      );

    if (arquivo) {
      leitor.readAsDataURL(arquivo);
    } else {
      salvarNovo("");
    }
  });

function salvarNovo(imagem) {
  const lista = lerProblemas();

  // unshift coloca o novo no começo, aí o mais recente aparece primeiro
  lista.unshift({
    id: Date.now(),
    categoria:
      document.getElementById("categoria").value,
    titulo:
      document.getElementById("titulo").value.trim(),
    descricao:
      document
        .getElementById("descricao")
        .value.trim(),
    localizacao:
      document
        .getElementById("localizacao")
        .value.trim(),
    imagem,
    status: "pendente",
    data: new Date().toISOString()
  });

  try {
    salvarProblemas(lista);
  } catch (erro) {
    alert(
      "Não foi possível salvar (espaço cheio). Tente sem imagem."
    );
    return;
  }

  document.getElementById("formulario").reset();

  document.getElementById("sucesso").hidden = false;

  atualizarHome();
}

/* ---------- Lista, filtros e busca ---------- */
function renderizarLista() {
  const cat =
    document.getElementById("filtroCategoria").value;

  const st =
    document.getElementById("filtroStatus").value;

  const busca =
    document
      .getElementById("busca")
      .value
      .toLowerCase()
      .trim();

  const todos = lerProblemas();

  // Filtro vazio deixa passar tudo; a busca olha título, local e descrição
  const filtrados = todos.filter(p =>
    (!cat || p.categoria === cat) &&
    (!st || p.status === st) &&
    `${p.titulo} ${p.localizacao} ${p.descricao}`
      .toLowerCase()
      .includes(busca)
  );

  // Três casos: nada registrado ainda, nada bate com o filtro, ou mostra os cards
  document.getElementById("listaProblemas").innerHTML =
    filtrados.length === 0
      ? todos.length === 0
        ? `
          <p class="vazio">
            Ainda não há problemas registrados.
            <a href="#registrar" data-tela="registrar">
              <b>Registre o primeiro</b>
            </a>.
          </p>
        `
        : `
          <p class="vazio">
            Nenhum problema encontrado.
            Tente mudar os filtros.
          </p>
        `
      : filtrados
          .map(
            p => `
              <article class="card">

                <small>
                  ${
                    CATEGORIAS[p.categoria] ||
                    "Categoria não informada"
                  }
                </small>

                <h3>
                  ${esc(p.titulo)}
                </h3>

                <small>
                  📍 ${esc(p.localizacao)}
                  · ${formatarData(p.data)}
                </small>

                <span class="etiqueta st-${p.status}">
                  ${
                    STATUS[p.status] ||
                    p.status
                  }
                </span>

                <p>
                  ${esc(p.descricao.slice(0, 90))}
                  ${
                    p.descricao.length > 90
                      ? "…"
                      : ""
                  }
                </p>

                <button
                  class="botao"
                  onclick="abrirDetalhes(${p.id})"
                >
                  Ver detalhes
                </button>

              </article>
            `
          )
          .join("");
}

// Atualiza a lista na hora, conforme a pessoa digita ou muda o filtro
[
  "busca",
  "filtroCategoria",
  "filtroStatus"
].forEach(id =>
  document
    .getElementById(id)
    .addEventListener(
      "input",
      renderizarLista
    )
);

/* ---------- Detalhes e mudança de status ---------- */

function encontrarProblema(id) {
  return lerProblemas().find(
    p => p.id === id
  );
}

function abrirDetalhes(id) {
  const p = encontrarProblema(id);

  if (!p) {
    alert(
      "Esse registro não foi encontrado."
    );

    mostrarTela("problemas");

    return;
  }

  // Posição do status atual, usada pra pintar a barra de progresso
  const posicao = Math.max(
    0,
    Object.keys(STATUS).indexOf(
      p.status
    )
  );

  document.getElementById(
    "conteudoDetalhes"
  ).innerHTML = `

    <button
      class="voltar"
      data-tela="problemas"
    >
      ← Voltar para a lista
    </button>

    <div class="detalhe-caixa">

      <small>
        ${
          CATEGORIAS[p.categoria] ||
          "Categoria não informada"
        }
      </small>

      <h2>
        ${esc(p.titulo)}
      </h2>

      <span class="etiqueta st-${p.status}">
        ${
          STATUS[p.status] ||
          p.status
        }
      </span>

      <p>
        ${esc(p.descricao)}
      </p>

      <p>
        📍 ${esc(p.localizacao)}
        <br>
        📅 ${formatarData(p.data)}
      </p>

      ${
        p.imagem
          ? `
            <img
              src="${p.imagem}"
              alt="Foto do problema"
            >
          `
          : ""
      }

      <div class="progresso">

        ${ETAPAS.map(
          (etapa, i) =>
            `
              <div
                class="etapa ${
                  i <= posicao
                    ? "feita"
                    : ""
                }"
              >
                ${etapa}
              </div>
            `
        ).join("")}

      </div>

      <div class="demo">

        <strong>
          🧪 Modo demonstração
        </strong>

        <br>

        Alterar status:

        <select
          onchange="mudarStatus(${p.id}, this.value)"
        >

          ${Object.keys(STATUS)
            .map(
              k =>
                `
                  <option
                    value="${k}"
                    ${
                      k === p.status
                        ? "selected"
                        : ""
                    }
                  >
                    ${STATUS[k]}
                  </option>
                `
            )
            .join("")}

        </select>

      </div>

      <div class="acoes-detalhe">

        <button
          class="botao botao-editar"
          type="button"
          onclick="ativarEdicao(${p.id})"
        >
          ✏️ Editar registro
        </button>

        <button
          class="botao botao-excluir"
          type="button"
          onclick="excluirProblema(${p.id})"
        >
          🗑️ Excluir registro
        </button>

      </div>

    </div>
  `;

  mostrarTela("detalhes");
}

function mudarStatus(id, novo) {
  const lista = lerProblemas();

  const problema = lista.find(
    p => p.id === id
  );

  if (!problema) return;

  problema.status = novo;

  salvarProblemas(lista);

  // Reabre os detalhes pra mostrar o novo status e atualiza os números
  abrirDetalhes(id);

  atualizarHome();

  renderizarDashboard();
}

/* ---------- Editar ---------- */

function ativarEdicao(id) {
  const p = encontrarProblema(id);

  if (!p) {
    alert(
      "Esse registro não foi encontrado."
    );
    return;
  }

  document.getElementById(
    "conteudoDetalhes"
  ).innerHTML = `

    <button
      class="voltar"
      type="button"
      onclick="abrirDetalhes(${p.id})"
    >
      ← Cancelar edição
    </button>

    <div class="detalhe-caixa">

      <h2>
        Editar registro
      </h2>

      <p class="em-breve">
        Altere os dados e clique em salvar.
      </p>

      <form
        id="formEdicao"
        class="form-edicao"
      >

        <label>
          Categoria

          <select
            id="editarCategoria"
            required
          >

            ${Object.keys(CATEGORIAS)
              .map(
                k =>
                  `
                    <option
                      value="${k}"
                      ${
                        k === p.categoria
                          ? "selected"
                          : ""
                      }
                    >
                      ${CATEGORIAS[k]}
                    </option>
                  `
              )
              .join("")}

          </select>

        </label>

        <label>
          Título

          <input
            id="editarTitulo"
            maxlength="80"
            value="${esc(p.titulo)}"
            required
          >

        </label>

        <label>
          Descrição

          <textarea
            id="editarDescricao"
            rows="5"
            required
          >${esc(p.descricao)}</textarea>

        </label>

        <label>
          Localização

          <input
            id="editarLocalizacao"
            value="${esc(p.localizacao)}"
            required
          >

        </label>

        <label>
          Nova foto
          (opcional, até 500 KB)

          <input
            id="editarImagem"
            type="file"
            accept="image/*"
          >

        </label>

        ${
          p.imagem
            ? `
              <div class="foto-atual">

                <small>
                  Foto atual:
                </small>

                <img
                  src="${p.imagem}"
                  alt="Foto atual do problema"
                >

              </div>
            `
            : ""
        }

        <div class="acoes-detalhe">

          <button
            class="botao botao-destaque"
            type="submit"
          >
            💾 Salvar alterações
          </button>

          <button
            class="botao botao-cancelar"
            type="button"
            onclick="abrirDetalhes(${p.id})"
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  `;

  // O formulário acabou de ser criado, então o evento é ligado aqui
  document
    .getElementById("formEdicao")
    .addEventListener(
      "submit",
      e => {
        e.preventDefault();

        salvarEdicao(id);
      }
    );

  mostrarTela("detalhes");
}

function salvarEdicao(id) {
  const lista = lerProblemas();

  const problema = lista.find(
    p => p.id === id
  );

  if (!problema) {
    alert(
      "Esse registro não foi encontrado."
    );
    return;
  }

  const arquivo =
    document.getElementById(
      "editarImagem"
    ).files[0];

  if (
    arquivo &&
    arquivo.size > 500 * 1024
  ) {
    alert(
      "A nova imagem é grande demais. Escolha uma de até 500 KB."
    );

    return;
  }

  problema.categoria =
    document.getElementById(
      "editarCategoria"
    ).value;

  problema.titulo =
    document.getElementById(
      "editarTitulo"
    ).value.trim();

  problema.descricao =
    document.getElementById(
      "editarDescricao"
    ).value.trim();

  problema.localizacao =
    document.getElementById(
      "editarLocalizacao"
    ).value.trim();

  // novaImagem vem null quando a pessoa não escolheu foto nova
  const finalizar = novaImagem => {

    if (novaImagem !== null) {
      problema.imagem = novaImagem;
    }

    try {
      salvarProblemas(lista);

      alert(
        "Registro atualizado com sucesso!"
      );

      abrirDetalhes(id);

      atualizarHome();

      renderizarDashboard();

    } catch (erro) {

      alert(
        "Não foi possível salvar as alterações. Tente remover a imagem."
      );

    }
  };

  if (arquivo) {

    const leitor =
      new FileReader();

    leitor.onload = () =>
      finalizar(
        leitor.result
      );

    leitor.onerror = () =>
      alert(
        "Não foi possível ler a nova imagem."
      );

    leitor.readAsDataURL(
      arquivo
    );

  } else {

    // Sem foto nova, fica a que já estava
    finalizar(null);

  }
}

/* ---------- Excluir ---------- */

function excluirProblema(id) {
  const problema =
    encontrarProblema(id);

  if (!problema) {
    alert(
      "Esse registro não foi encontrado."
    );

    return;
  }

  const confirmou = confirm(
    `Tem certeza que deseja excluir "${problema.titulo}"?\n\nEssa ação não pode ser desfeita.`
  );

  if (!confirmou) return;

  const novaLista =
    lerProblemas().filter(
      p => p.id !== id
    );

  try {

    salvarProblemas(
      novaLista
    );

    alert(
      "Registro excluído com sucesso!"
    );

    atualizarHome();

    renderizarDashboard();

    mostrarTela("problemas");

  } catch (erro) {

    alert(
      "Não foi possível excluir o registro."
    );

  }
}

/* ---------- Estatísticas ---------- */

function contar(lista, status) {
  return lista.filter(
    p => p.status === status
  ).length;
}

// Atalho pra não repetir document.getElementById toda hora
const $ = id =>
  document.getElementById(id);

const CORES_CAT = {
  lixo: "#D8322B",
  infra: "#1B2FA8",
  luz: "#F2B01E",
  agua: "#0EA5E9",
  ambiente: "#2E9E55",
  transito: "#8B5CF6",
  acessibilidade: "#EC4899",
  espacos: "#64748B"
};

const CORES_STATUS = {
  pendente: "#D8322B",
  analise: "#F2B01E",
  andamento: "#3B82F6",
  resolvido: "#2E9E55"
};

// Faz o número subir de 0 até o valor final (começa rápido e vai desacelerando)
function animar(el, alvo) {
  if (!el) return;

  const inicio =
    performance.now();

  (function passo(agora) {

    const p = Math.min(
      (agora - inicio) / 700,
      1
    );

    el.textContent =
      Math.round(
        alvo *
          (1 -
            Math.pow(
              1 - p,
              3
            ))
      );

    if (p < 1) {
      requestAnimationFrame(
        passo
      );
    }

  })(inicio);
}

/* ---------- Home ---------- */

function atualizarHome() {
  const lista = lerProblemas();

  animar(
    $("statTotal"),
    lista.length
  );

  animar(
    $("statAnalise"),
    contar(
      lista,
      "analise"
    )
  );

  animar(
    $("statAndamento"),
    contar(
      lista,
      "andamento"
    )
  );

  animar(
    $("statResolvidos"),
    contar(
      lista,
      "resolvido"
    )
  );

  // Cartãozinho do mapa: o último registro fica sempre na posição 0
  $("ultimoRegistro").innerHTML =
    lista[0]

      ? `
        <span class="ponto"></span>

        <div>

          <small>
            Último registro
          </small>

          <b>
            ${esc(
              lista[0].titulo
            )}
          </b>

        </div>
      `

      : `
        <span class="ponto"></span>

        <div>

          <small>
            Aguardando registros
          </small>

          <b>
            Seja o primeiro a registrar!
          </b>

        </div>
      `;
}

/* ---------- Panorama ---------- */

function renderizarDashboard() {
  const lista = lerProblemas();

  const n = lista.length;

  const cards = [
    {
      cor: "#1B2FA8",
      icone: "📋",
      valor: n,
      texto: "Total de problemas"
    },

    {
      cor: "#D8322B",
      icone: "🔴",
      valor: contar(
        lista,
        "pendente"
      ),
      texto: "Pendentes"
    },

    {
      cor: "#F2B01E",
      icone: "🟡",
      valor: contar(
        lista,
        "analise"
      ),
      texto: "Em análise"
    },

    {
      cor: "#3B82F6",
      icone: "🔵",
      valor: contar(
        lista,
        "andamento"
      ),
      texto: "Em andamento"
    },

    {
      cor: "#2E9E55",
      icone: "🟢",
      valor: contar(
        lista,
        "resolvido"
      ),
      texto: "Resolvidos"
    }
  ];

  $("statsDashboard").innerHTML =
    cards
      .map(
        card => `
          <div
            class="stat"
            style="--c:${card.cor}"
          >

            <span class="icone">
              ${card.icone}
            </span>

            <strong data-n="${card.valor}">
              0
            </strong>

            <span>
              ${card.texto}
            </span>

          </div>
        `
      )
      .join("");

  $("statsDashboard")
    .querySelectorAll("strong")
    .forEach(el =>
      animar(
        el,
        Number(
          el.dataset.n
        )
      )
    );

  // Gráfico de rosca: cada status ocupa uma fatia (em %) do conic-gradient
  let acumulado = 0;

  const fatias = [];

  Object.keys(STATUS)
    .forEach(k => {

      const quantidade =
        contar(
          lista,
          k
        );

      if (
        quantidade &&
        n
      ) {

        const inicio =
          acumulado;

        const fim =
          acumulado +
          (quantidade / n) *
            100;

        fatias.push(
          `${CORES_STATUS[k]} ${inicio}% ${fim}%`
        );

        acumulado =
          fim;
      }

    });

  // Sem nenhum registro, a rosca fica cinza
  $("rosca").style.background =
    n
      ? `conic-gradient(${fatias.join(",")})`
      : "#E1E7EF";

  const resolvidos =
    contar(
      lista,
      "resolvido"
    );

  $("roscaPct").textContent =
    `${
      n
        ? Math.round(
            (resolvidos / n) *
              100
          )
        : 0
    }%`;

  $("legenda").innerHTML =
    Object.keys(STATUS)
      .map(
        k => `
          <li>

            <i
              style="background:${CORES_STATUS[k]}"
            ></i>

            <span>
              ${STATUS[k]}
            </span>

            <b>
              ${contar(
                lista,
                k
              )}
            </b>

          </li>
        `
      )
      .join("");

  // Barras por categoria, da que tem mais problemas pra que tem menos
  $("barrasCategoria").innerHTML =
    Object.keys(
      CATEGORIAS
    )

      .map(k => ({
        k,

        qtd:
          lista.filter(
            p =>
              p.categoria ===
              k
          ).length
      }))

      .sort(
        (a, b) =>
          b.qtd - a.qtd
      )

      .map(c => {

        const pct =
          n
            ? Math.round(
                (c.qtd / n) *
                  100
              )
            : 0;

        return `
          <div class="barra-linha">

            <span>
              ${CATEGORIAS[c.k]}
            </span>

            <div class="barra-fundo">

              <div
                class="barra"
                style="
                  --w:${pct}%;
                  background:${CORES_CAT[c.k]}
                "
              ></div>

            </div>

            <b>
              ${pct}%
            </b>

          </div>
        `;

      })

      .join("");
}

/* ---------- Categorias da home (clicáveis) ---------- */

$("chips").innerHTML =
  Object.keys(
    CATEGORIAS
  )
    .map(
      (k, i) =>
        `
          <button
            class="chip"
            style="
              --c:${CORES_CAT[k]};
              animation-delay:${i * 60}ms
            "
            data-cat="${k}"
          >
            ${CATEGORIAS[k]}
          </button>
        `
    )
    .join("");

// Clicou numa categoria: abre a lista já filtrada por ela
$("chips").addEventListener(
  "click",
  function (e) {

    const botao =
      e.target.closest(
        ".chip"
      );

    if (!botao) return;

    $("filtroCategoria").value =
      botao.dataset.cat;

    mostrarTela(
      "problemas"
    );
  }
);

// Se a pessoa abre "Problemas" pelo menu, zera o filtro de categoria
// pra não ficar preso na categoria que ela clicou antes
document
  .querySelectorAll(
    ".menu a[data-tela=problemas]"
  )
  .forEach(link =>
    link.addEventListener(
      "click",
      () => {
        $("filtroCategoria")
          .value = "";
      }
    )
  );

/* ---------- Começo ---------- */

// Abre a tela que está no endereço (#problemas, por exemplo) ou a home
mostrarTela(
  location.hash.replace(
    "#",
    ""
  ) || "home"
);