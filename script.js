// ===== Educa+ — script principal =====

// ---------- 1. DADOS: conteúdos ----------
const ASSUNTOS = {
  porcentagem: { nome: "Porcentagem", conceitos: [
    ["O que é porcentagem", "É uma fração de denominador 100. Exemplo: 20% = 20/100 = 0,20."],
    ["Porcentagem de um valor", "Para achar 20% de 150, calcule 150 × 0,20 = 30."],
    ["Desconto e aumento", "Desconto de 15%: multiplique por 0,85. Aumento de 15%: multiplique por 1,15."]] },
  equacoes: { nome: "Equações", conceitos: [
    ["Equação do 1º grau", "Isole o x. Em 2x + 6 = 14: 2x = 8, então x = 4."],
    ["Regra de ouro", "O que você faz de um lado da igualdade, faça do outro."],
    ["Equação do 2º grau", "Em ax² + bx + c = 0 use Δ = b² − 4ac e x = (−b ± √Δ) / 2a."]] },
  funcoes: { nome: "Funções", conceitos: [
    ["O que é função", "Cada valor de x tem um único valor de y. Escrevemos y = f(x)."],
    ["Função afim", "f(x) = ax + b. Se a > 0 cresce; se a < 0 decresce; b é onde corta o eixo y."],
    ["Calcular f(x)", "Para f(x) = 2x + 3, temos f(4) = 2·4 + 3 = 11."]] },
  geometria: { nome: "Geometria", conceitos: [
    ["Área e perímetro", "Perímetro é a soma dos lados. Área do retângulo: base × altura. Do triângulo: (base × altura) / 2."],
    ["Círculo", "Área = π·r². Comprimento = 2·π·r."],
    ["Teorema de Pitágoras", "No triângulo retângulo: hipotenusa² = cateto² + cateto². Com 3 e 4: 9 + 16 = 25, hipotenusa 5."]] }
};
const ORDEM = ["porcentagem", "equacoes", "funcoes", "geometria"];

// ---------- 2. DADOS: banco de questões ----------
// q() cria objetos no formato { id, assunto, pergunta, opcoes, resposta }
let contadorId = 0;
const q = (assunto, pergunta, opcoes, resposta) =>
  ({ id: ++contadorId, assunto, pergunta, opcoes, resposta });

// Diagnóstico: 3 questões por conteúdo (12 no total)
const DIAGNOSTICO = [
  q("porcentagem", "Quanto é 20% de 150?", ["20", "25", "30", "35"], "30"),
  q("porcentagem", "Um produto de R$ 80 recebe 15% de desconto. Quanto passa a custar?", ["R$ 65", "R$ 68", "R$ 70", "R$ 72"], "R$ 68"),
  q("porcentagem", "Um salário de R$ 2.000 teve aumento de 10%. Qual é o novo salário?", ["R$ 2.100", "R$ 2.200", "R$ 2.020", "R$ 2.400"], "R$ 2.200"),
  q("equacoes", "Resolva: 2x + 6 = 14", ["x = 2", "x = 3", "x = 4", "x = 5"], "x = 4"),
  q("equacoes", "Resolva: 3x − 5 = 10", ["x = 3", "x = 4", "x = 5", "x = 6"], "x = 5"),
  q("equacoes", "Quais são as raízes de x² − 5x + 6 = 0?", ["1 e 6", "2 e 3", "−2 e −3", "2 e −3"], "2 e 3"),
  q("funcoes", "Se f(x) = 2x + 3, quanto vale f(4)?", ["8", "9", "11", "14"], "11"),
  q("funcoes", "Se f(x) = x² − 1, quanto vale f(3)?", ["8", "10", "6", "9"], "8"),
  q("funcoes", "Em que ponto f(x) = 3x − 6 corta o eixo x?", ["x = −2", "x = 2", "x = 3", "x = 6"], "x = 2"),
  q("geometria", "Qual é a área de um retângulo de lados 8 e 5?", ["13", "26", "40", "80"], "40"),
  q("geometria", "Qual é o perímetro de um quadrado de lado 7?", ["14", "28", "49", "21"], "28"),
  q("geometria", "Um triângulo retângulo tem catetos 3 e 4. Qual é a hipotenusa?", ["5", "6", "7", "12"], "5")
];

// Treino: 5 questões por conteúdo (usadas depois do diagnóstico)
const TREINO = [
  q("porcentagem", "Quanto é 50% de 240?", ["100", "110", "120", "150"], "120"),
  q("porcentagem", "15 é quantos por cento de 60?", ["20%", "25%", "30%", "15%"], "25%"),
  q("porcentagem", "Um produto de R$ 200 teve aumento de 20%. Qual o novo preço?", ["R$ 220", "R$ 240", "R$ 250", "R$ 260"], "R$ 240"),
  q("porcentagem", "Quanto é 10% de 350?", ["3", "35", "350", "45"], "35"),
  q("porcentagem", "Uma camisa de R$ 120 tem 25% de desconto. Quanto custa agora?", ["R$ 95", "R$ 90", "R$ 85", "R$ 100"], "R$ 90"),
  q("equacoes", "Resolva: x + 9 = 21", ["x = 10", "x = 11", "x = 12", "x = 13"], "x = 12"),
  q("equacoes", "Resolva: 5x = 45", ["x = 8", "x = 9", "x = 10", "x = 40"], "x = 9"),
  q("equacoes", "Resolva: 4x − 8 = 12", ["x = 4", "x = 5", "x = 6", "x = 3"], "x = 5"),
  q("equacoes", "Quais são as soluções de x² = 49?", ["7", "−7", "7 e −7", "49"], "7 e −7"),
  q("equacoes", "Resolva: 2(x + 3) = 18", ["x = 6", "x = 9", "x = 12", "x = 3"], "x = 6"),
  q("funcoes", "Se f(x) = 5x, quanto vale f(2)?", ["7", "10", "25", "52"], "10"),
  q("funcoes", "Se f(x) = x + 7, quanto vale f(−3)?", ["4", "10", "−4", "−10"], "4"),
  q("funcoes", "A função f(x) = −2x + 4 é:", ["Crescente", "Decrescente", "Constante", "Não é função"], "Decrescente"),
  q("funcoes", "Qual é o coeficiente linear de y = 4x + 9?", ["4", "9", "13", "5"], "9"),
  q("funcoes", "Se f(x) = x², quanto vale f(−4)?", ["−16", "16", "8", "−8"], "16"),
  q("geometria", "Qual é a área de um triângulo de base 10 e altura 6?", ["60", "30", "16", "32"], "30"),
  q("geometria", "Quanto vale a soma dos ângulos internos de um triângulo?", ["90°", "180°", "270°", "360°"], "180°"),
  q("geometria", "Qual é a área de um círculo de raio 3? (use π = 3,14)", ["18,84", "9,42", "28,26", "37,68"], "28,26"),
  q("geometria", "Qual é o perímetro de um retângulo de lados 6 e 4?", ["10", "20", "24", "28"], "20"),
  q("geometria", "Catetos 6 e 8: qual é a hipotenusa?", ["10", "12", "14", "100"], "10")
];

// ---------- 3. ARMAZENAMENTO (localStorage com proteção) ----------
const CHAVE = "educaplus_v1";
let memoria = null; // plano B: se o navegador bloquear o localStorage, o app continua funcionando

function carregarDados() {
  try {
    const texto = localStorage.getItem(CHAVE);
    if (texto) {
      const d = JSON.parse(texto);
      if (d && Array.isArray(d.historico)) return d;
    }
  } catch (e) { /* ignora */ }
  return memoria || { nome: "", historico: [] };
}
function salvarDados(d) {
  memoria = d;
  try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch (e) { /* ignora */ }
}
function ultimoResultado(pos) { // pos = 1 último, 2 penúltimo
  const h = carregarDados().historico;
  return h[h.length - (pos || 1)] || null;
}

// ---------- 4. FUNÇÕES AUXILIARES ----------
function classificar(p) {
  if (p < 40) return { texto: "Precisa revisar", emoji: "🔴", cor: "vermelho" };
  if (p < 70) return { texto: "Precisa praticar", emoji: "🟡", cor: "amarelo" };
  return { texto: "Bom domínio", emoji: "🟢", cor: "verde" };
}
function embaralhar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function ordenarPorDesempenho(r) { // do pior para o melhor
  return ORDEM.slice().sort((x, y) => r.porAssunto[x] - r.porAssunto[y]);
}
function el(id) { return document.getElementById(id); }

// ---------- 5. TELAS ----------
const RENDER = {
  "tela-identificacao": prepararIdentificacao,
  "tela-resultado": renderResultado,
  "tela-trilha": renderTrilha,
  "tela-conteudo": renderConteudo,
  "tela-evolucao": renderEvolucao
};
function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  if (RENDER[id]) RENDER[id]();
  el(id).classList.add("ativa");
  window.scrollTo(0, 0);
}

// Um único "ouvinte" para todos os botões da página (inclusive os criados depois)
let conteudoAtual = "porcentagem";
document.addEventListener("click", function (e) {
  const ir = e.target.closest("[data-ir]");
  const treinar = e.target.closest("[data-treinar]");
  const estudar = e.target.closest("[data-estudar]");
  const acao = e.target.closest("[data-acao]");
  if (ir) { e.preventDefault(); mostrarTela(ir.dataset.ir); }
  else if (treinar) iniciarTreino(treinar.dataset.treinar);
  else if (estudar) { conteudoAtual = estudar.dataset.estudar; mostrarTela("tela-conteudo"); }
  else if (acao && acao.dataset.acao === "diagnostico") comecarDiagnostico();
  else if (acao && acao.dataset.acao === "apagar") apagarDados();
});

// ---------- 6. PÁGINA INICIAL e IDENTIFICAÇÃO ----------
el("btn-comecar").addEventListener("click", () => mostrarTela("tela-identificacao"));

function prepararIdentificacao() {
  el("campo-nome").value = carregarDados().nome;
  el("erro-nome").textContent = "";
}
function confirmarNome() {
  const nome = el("campo-nome").value.trim();
  if (nome.length < 2) {
    el("erro-nome").textContent = "Digite seu nome com pelo menos 2 letras.";
    return;
  }
  const d = carregarDados();
  d.nome = nome;
  salvarDados(d);
  iniciarDiagnostico();
}
el("btn-nome").addEventListener("click", confirmarNome);
el("campo-nome").addEventListener("keydown", e => { if (e.key === "Enter") confirmarNome(); });

function comecarDiagnostico() { // usado em "Refazer diagnóstico"
  if (carregarDados().nome) iniciarDiagnostico();
  else mostrarTela("tela-identificacao");
}

// ---------- 7. PERGUNTAS (diagnóstico e treino) ----------
let quiz = { modo: "", lista: [], i: 0, respostas: [], escolhida: null, respondida: false, assunto: "" };

function iniciarDiagnostico() {
  quiz = { modo: "diagnostico", lista: embaralhar(DIAGNOSTICO), i: 0, respostas: [], escolhida: null, respondida: false, assunto: "" };
  el("quiz-titulo").textContent = "Diagnóstico de Matemática";
  mostrarPergunta();
  mostrarTela("tela-quiz");
}
function iniciarTreino(assunto) {
  const lista = TREINO.filter(x => x.assunto === assunto);
  quiz = { modo: "treino", lista: embaralhar(lista), i: 0, respostas: [], escolhida: null, respondida: false, assunto: assunto };
  el("quiz-titulo").textContent = "Treino: " + ASSUNTOS[assunto].nome;
  mostrarPergunta();
  mostrarTela("tela-quiz");
}

function mostrarPergunta() {
  const p = quiz.lista[quiz.i];
  const total = quiz.lista.length;
  quiz.escolhida = null;
  quiz.respondida = false;
  el("quiz-contador").textContent = "Pergunta " + (quiz.i + 1) + " de " + total;
  el("quiz-barra").style.width = (quiz.i / total * 100) + "%";
  el("quiz-pergunta").textContent = p.pergunta;
  el("quiz-feedback").textContent = "";
  el("btn-quiz").textContent = "Responder";

  const caixa = el("quiz-opcoes");
  caixa.innerHTML = "";
  p.opcoes.forEach(function (texto) {
    const b = document.createElement("button");
    b.className = "opcao";
    b.textContent = texto;
    b.addEventListener("click", function () {
      if (quiz.respondida) return;
      quiz.escolhida = texto;
      caixa.querySelectorAll(".opcao").forEach(o => o.classList.remove("marcada"));
      b.classList.add("marcada");
      el("quiz-feedback").textContent = "";
    });
    caixa.appendChild(b);
  });
}

el("btn-quiz").addEventListener("click", function () {
  if (quiz.escolhida === null) {
    el("quiz-feedback").textContent = "Escolha uma alternativa para continuar.";
    return;
  }
  const p = quiz.lista[quiz.i];

  if (!quiz.respondida) {
    quiz.respondida = true;
    const acertou = quiz.escolhida === p.resposta;
    quiz.respostas.push({ assunto: p.assunto, acertou: acertou });

    if (quiz.modo === "treino") { // no treino mostramos se acertou
      el("quiz-opcoes").querySelectorAll(".opcao").forEach(function (o) {
        if (o.textContent === p.resposta) o.classList.add("certa");
        else if (o.textContent === quiz.escolhida) o.classList.add("errada");
      });
      el("quiz-feedback").textContent = acertou ? "Correto! 🎉" : "Quase! A resposta certa é: " + p.resposta;
      el("btn-quiz").textContent = (quiz.i === quiz.lista.length - 1) ? "Ver resultado do treino" : "Próxima";
      return;
    }
  }

  quiz.i++;
  if (quiz.i >= quiz.lista.length) {
    if (quiz.modo === "diagnostico") finalizarDiagnostico(); else finalizarTreino();
  } else {
    mostrarPergunta();
  }
});

// ---------- 8. CORREÇÃO e DESEMPENHO POR CONTEÚDO ----------
function finalizarDiagnostico() {
  const cont = {};
  ORDEM.forEach(a => cont[a] = { acertos: 0, total: 0 });
  quiz.respostas.forEach(function (r) {
    cont[r.assunto].total++;
    if (r.acertou) cont[r.assunto].acertos++;
  });
  const porAssunto = {};
  let acertosGeral = 0;
  ORDEM.forEach(function (a) {
    porAssunto[a] = Math.round(cont[a].acertos / cont[a].total * 100);
    acertosGeral += cont[a].acertos;
  });
  const resultado = {
    data: new Date().toISOString(),
    geral: Math.round(acertosGeral / quiz.respostas.length * 100),
    porAssunto: porAssunto
  };
  const d = carregarDados();
  d.historico.push(resultado);
  salvarDados(d);
  mostrarTela("tela-resultado");
}

function linhaAssunto(a, pct) {
  const c = classificar(pct);
  return '<div class="linha"><span class="linha-nome">' + ASSUNTOS[a].nome + '</span>' +
    '<div class="barra"><div class="barra-cheia ' + c.cor + '" style="width:' + pct + '%"></div></div>' +
    '<span class="linha-valor">' + pct + '% ' + c.emoji + ' ' + c.texto + '</span></div>';
}

// ---------- 9. RESULTADO ----------
function renderResultado() {
  const r = ultimoResultado();
  const caixa = el("resultado-conteudo");
  if (!r) {
    caixa.innerHTML = '<p>Você ainda não fez o diagnóstico.</p><button class="btn" data-acao="diagnostico">Fazer diagnóstico</button>';
    return;
  }
  el("resultado-titulo").textContent = "Resultado de " + (carregarDados().nome || "aluno");
  const ordenados = ordenarPorDesempenho(r);
  const pior = ordenados[0];
  let linhas = "";
  ORDEM.forEach(a => linhas += linhaAssunto(a, r.porAssunto[a]));

  let aviso;
  if (r.porAssunto[pior] >= 70) {
    aviso = 'Parabéns! Todos os conteúdos estão com bom domínio. Para continuar evoluindo, treine <strong>' + ASSUNTOS[pior].nome + '</strong>, seu conteúdo mais baixo.';
  } else {
    aviso = 'Seu principal ponto de atenção é <strong>' + ASSUNTOS[pior].nome + '</strong>.';
  }

  caixa.innerHTML =
    '<p class="geral">' + r.geral + '%<small>Desempenho geral</small></p>' +
    '<div class="atencao">' + aviso + '</div>' + linhas +
    '<div class="acoes"><button class="btn" data-ir="tela-trilha">Ver minha trilha de estudos</button>' +
    '<button class="btn btn-claro" data-ir="tela-evolucao">Ver evolução</button></div>';
}

// ---------- 10. TRILHA PERSONALIZADA ----------
function renderTrilha() {
  const r = ultimoResultado();
  const caixa = el("trilha-conteudo");
  if (!r) {
    caixa.innerHTML = '<p>Faça o diagnóstico para receber sua trilha personalizada.</p><button class="btn" data-acao="diagnostico">Fazer diagnóstico</button>';
    return;
  }
  const ordenados = ordenarPorDesempenho(r);
  let foco = ordenados.filter(a => r.porAssunto[a] < 70); // do menor para o maior desempenho
  let intro = "Priorizamos os conteúdos em que você foi pior, começando pelo menor desempenho.";
  if (foco.length === 0) {
    foco = [ordenados[0]];
    intro = "Você foi bem em tudo! Para continuar evoluindo, sua trilha é sobre o conteúdo mais baixo.";
  }

  let html = "<p>" + intro + "</p>";
  foco.forEach(function (a, n) {
    const pct = r.porAssunto[a];
    const c = classificar(pct);
    let conceitos = "";
    ASSUNTOS[a].conceitos.forEach(x => conceitos += "<li>" + x[0] + "</li>");
    html += '<div class="trilha-bloco">' +
      '<h3>Prioridade ' + (n + 1) + ': ' + ASSUNTOS[a].nome + ' (' + pct + '% ' + c.emoji + ')</h3>' +
      '<div class="etapa"><b>1. Revisão dos conceitos básicos</b><ul>' + conceitos + '</ul>' +
      '<button class="btn" data-estudar="' + a + '">Estudar ' + ASSUNTOS[a].nome + '</button></div>' +
      '<div class="etapa"><b>2. Pratique</b>5 questões de treino para fixar o conteúdo.<br><br>' +
      '<button class="btn" data-treinar="' + a + '">Fazer as 5 questões</button></div>' +
      '<div class="etapa"><b>3. Novo desafio</b>Meta: acertar pelo menos 4 das 5 questões do treino.</div>' +
      '</div>';
  });
  html += '<div class="etapa"><b>4. Novo diagnóstico</b>Refaça o diagnóstico para comparar seu desempenho.<br><br>' +
    '<button class="btn" data-acao="diagnostico">Refazer diagnóstico</button></div>';
  caixa.innerHTML = html;
}

// ---------- 11. TREINO (5 questões) ----------
function finalizarTreino() {
  const acertos = quiz.respostas.filter(r => r.acertou).length;
  const total = quiz.respostas.length;
  const a = quiz.assunto;
  const msg = acertos >= 4
    ? "Muito bem! Você atingiu a meta. Refaça o diagnóstico e veja sua evolução."
    : "Continue praticando: releia o conteúdo e tente de novo para chegar a 4 acertos.";
  el("fim-treino-conteudo").innerHTML =
    '<h2>Treino de ' + ASSUNTOS[a].nome + '</h2>' +
    '<p class="geral">' + acertos + ' de ' + total + '<small>questões corretas</small></p>' +
    '<div class="atencao">' + msg + '</div>' +
    '<div class="acoes"><button class="btn" data-acao="diagnostico">Refazer diagnóstico</button>' +
    '<button class="btn btn-claro" data-treinar="' + a + '">Treinar de novo</button>' +
    '<button class="btn btn-claro" data-estudar="' + a + '">Rever conteúdo</button></div>';
  mostrarTela("tela-fim-treino");
}

// ---------- 12. CONTEÚDO ----------
function renderConteudo() {
  let abas = "";
  ORDEM.forEach(a => abas += '<button class="aba' + (a === conteudoAtual ? " ativa" : "") + '" data-estudar="' + a + '">' + ASSUNTOS[a].nome + '</button>');
  el("abas").innerHTML = abas;
  let html = "";
  ASSUNTOS[conteudoAtual].conceitos.forEach(x => html += '<div class="conceito"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>');
  html += '<button class="btn" data-treinar="' + conteudoAtual + '">Treinar com 5 questões</button>';
  el("conteudo-painel").innerHTML = html;
}

// ---------- 13. EVOLUÇÃO ----------
function textoPontos(dif) {
  if (dif > 0) return '<span class="pontos sobe">+' + dif + ' pontos de evolução</span>';
  if (dif < 0) return '<span class="pontos desce">' + dif + ' pontos</span>';
  return '<span class="pontos igual">Sem mudança</span>';
}
function renderEvolucao() {
  const caixa = el("evolucao-conteudo");
  const hist = carregarDados().historico;
  if (hist.length === 0) {
    caixa.innerHTML = '<p>Você ainda não fez nenhum diagnóstico. Quando fizer, seus resultados aparecem aqui.</p><button class="btn" data-acao="diagnostico">Fazer diagnóstico</button>';
    return;
  }
  const atual = ultimoResultado(1);
  const antes = ultimoResultado(2);
  let html = "";

  if (!antes) {
    html += "<p>Este é seu primeiro diagnóstico. Faça o treino e refaça o diagnóstico para ver sua evolução.</p>";
    ORDEM.forEach(a => html += linhaAssunto(a, atual.porAssunto[a]));
  } else {
    html += '<p>Comparação entre seus dois últimos diagnósticos.</p>' +
      '<div class="evo-linha"><b>Desempenho geral:</b> ' + antes.geral + '% → ' + atual.geral + '% · ' + textoPontos(atual.geral - antes.geral) + '</div>';
    ORDEM.forEach(function (a) {
      const x = antes.porAssunto[a], y = atual.porAssunto[a];
      html += '<div class="evo-linha"><b>' + ASSUNTOS[a].nome + '</b>' +
        '<div class="barra antes"><div class="barra-cheia" style="width:' + x + '%"></div></div>' +
        '<div class="barra"><div class="barra-cheia ' + classificar(y).cor + '" style="width:' + y + '%"></div></div>' +
        '<span class="texto-pequeno">Antes: ' + x + '% · Agora: ' + y + '% · </span>' + textoPontos(y - x) + '</div>';
    });
  }

  html += '<h3 style="margin-top:20px">Histórico</h3><ul class="historico">';
  hist.slice().reverse().forEach(function (h) {
    html += "<li>" + new Date(h.data).toLocaleDateString("pt-BR") + " — geral " + h.geral + "%</li>";
  });
  html += '</ul><div class="acoes"><button class="btn" data-acao="diagnostico">Refazer diagnóstico</button>' +
    '<button class="btn btn-claro" data-acao="apagar">Apagar meus dados</button></div>';
  caixa.innerHTML = html;
}
function apagarDados() {
  if (confirm("Apagar nome e todo o histórico de diagnósticos?")) {
    salvarDados({ nome: "", historico: [] });
    mostrarTela("tela-inicio");
  }
}