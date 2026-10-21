# Educa+ Matemática

Plataforma educacional que faz um diagnóstico rápido de Matemática do Ensino Médio, identifica em quais conteúdos o aluno tem mais dificuldade e monta uma trilha de estudos personalizada.

> MVP desenvolvido em HTML, CSS e JavaScript puro. Funciona abrindo o `index.html` no navegador, sem servidor, sem banco de dados e sem internet.

<!-- Adicione aqui capturas de tela: ![Tela inicial](assets/tela-inicial.png) -->

## O problema

Muitos estudantes recebem uma nota baixa em uma prova, mas não sabem exatamente quais conteúdos precisam melhorar. A nota diz *quanto* o aluno foi mal, mas não diz *onde*.

O cenário da Matemática no Ensino Médio é desafiador: segundo o Saeb 2023, apenas 5% dos alunos do 3º ano da rede pública tinham aprendizado adequado na disciplina ([CNN Brasil](https://www.cnnbrasil.com.br/educacao/matematica-so-5-dos-alunos-do-3o-ano-medio-tem-bom-nivel-de-aprendizagem/)). Em 2025, a média do 3º ano subiu de 263,9 para 268,0 pontos (escala de 0 a 500), mas a Matemática do Ensino Médio continua sendo o maior gargalo ([IstoÉ/Agência Brasil](https://istoe.com.br/saeb-2025-aprendizagem-desafio-brasil)).

## A solução

Fluxo principal:

**Entrar → Fazer diagnóstico → Identificar dificuldades → Receber trilha personalizada → Estudar → Refazer diagnóstico → Ver evolução**

- **Diagnóstico:** 12 questões, 3 para cada conteúdo (Porcentagem, Equações, Funções e Geometria).
- **Resultado por conteúdo:** o desempenho é calculado separadamente em cada conteúdo e classificado.
- **Trilha de estudos:** montada automaticamente, começando pelo conteúdo com pior desempenho.
- **5 questões de treino:** exercícios para fixar o conteúdo mais fraco, com correção na hora.
- **Evolução:** compara os dois últimos diagnósticos e mostra quantos pontos o aluno ganhou.

### Classificação

| Desempenho | Classificação |
|---|---|
| 0% a 39% | Precisamos dar atenção a este conteúdo (vermelho) |
| 40% a 69% | Pratique mais (amarelo) |
| 70% a 100% | Bom domínio (verde) |

## Como executar

1. Baixe ou clone o repositório:
   ```bash
   git clone <URL-DO-REPOSITORIO>
   ```
2. Abra o arquivo `index.html` no navegador (Chrome, Edge, Firefox ou Safari).

Não há instalação, dependências ou build.

## Estrutura do projeto

```text
educa-plus/
├── index.html   # estrutura das telas
├── style.css    # visual (tema "caderno de estudos") e responsividade
├── script.js    # banco de questões, lógica, correção, trilha e evolução
└── assets/      # reservado para imagens
```

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (Vanilla JS)
- `localStorage` para guardar nome e histórico de diagnósticos no navegador

Sem frameworks, bibliotecas, APIs externas, inteligência artificial ou serviços pagos.

## Como funciona

- **Banco de questões:** duas listas no `script.js`, `DIAGNOSTICO` (12 questões) e `TREINO` (20 questões, 5 por conteúdo). Cada questão é um objeto com `id`, `assunto`, `pergunta`, `opcoes` e `resposta`.
- **Correção:** compara a alternativa escolhida com a `resposta` da questão.
- **Desempenho por conteúdo:** `acertos / total × 100` para cada assunto.
- **Trilha:** reúne os conteúdos abaixo de 70%, ordenados do menor para o maior desempenho.
- **Evolução:** diferença entre o último e o penúltimo diagnóstico, por conteúdo.
- **Armazenamento:** os dados ficam na chave `educaplus_v1` do `localStorage`. Se o navegador bloquear o armazenamento, o app continua funcionando com os dados na memória da página.

### Como adicionar questões

No `script.js`, copie uma linha de `DIAGNOSTICO` ou `TREINO` e altere os textos:

```javascript
q("geometria", "Qual é a área de um retângulo de lados 8 e 5?", ["13", "26", "40", "80"], "40")
```

O `assunto` deve ser `porcentagem`, `equacoes`, `funcoes` ou `geometria`, e a `resposta` precisa ser idêntica a uma das opções. Mantenha o mesmo número de questões por assunto no diagnóstico.

## Limitações atuais

- Apenas Matemática, com 4 conteúdos.
- Banco de questões pequeno: o diagnóstico usa sempre as mesmas 12 questões (apenas em ordem diferente).
- Os dados ficam só no navegador do aluno: não há login nem sincronização entre dispositivos.
- Os conteúdos de estudo são resumos curtos.

## Próximos passos

- [ ] Ampliar o banco de questões e sortear parte delas a cada diagnóstico
- [ ] Explicação passo a passo das respostas erradas
- [ ] Painel para o professor acompanhar a turma
- [ ] Outras disciplinas
- [ ] Armazenamento online com login

## Equipe

<!-- Nomes dos integrantes -->

## Licença

<!-- Defina a licença do projeto (por exemplo, MIT) -->
