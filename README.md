# Una melhor

> Sua cidade, sua voz, sua mudança.

**Una melhor** é uma plataforma web de participação cidadã. Ela permite que moradores registrem problemas encontrados na cidade, como lixo acumulado, buracos, falta de iluminação, vazamentos, problemas de acessibilidade e trânsito, e acompanhem o andamento de cada um.

Os relatos viram informação organizada: dá para ver quantos problemas existem, em que etapa estão e quais são os mais frequentes.

Projeto desenvolvido por estudantes do ensino médio para uma maratona de tecnologia. Esta é a versão MVP (primeira versão funcional).

## Funcionalidades

- Registro de problemas com categoria, título, descrição, localização e foto opcional
- Lista de problemas com busca e filtros por categoria e status
- Detalhes de cada problema, com acompanhamento visual do andamento
- Modo demonstração para alterar o status dos problemas
- Estatísticas calculadas automaticamente (total, por status e por categoria)
- Layout responsivo (computador, tablet e celular)

## Tecnologias

HTML5, CSS3 e JavaScript puro. Os dados ficam salvos no `localStorage` do navegador. Não há backend, banco de dados nem serviços pagos.

## Como executar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.

## Estrutura

```
├── index.html        Página inicial (estatísticas e últimos problemas)
├── registrar.html    Formulário de novo problema
├── ocorrencias.html  Lista com filtros e detalhes
├── css/style.css     Visual do site
└── js/
    ├── storage.js    Leitura e escrita no localStorage
    ├── dados-demo.js Problemas de exemplo
    ├── stats.js      Cálculo das estatísticas
    └── app.js        Lógica de cada página
```

## Aviso

Os problemas que aparecem ao abrir o site pela primeira vez são **dados fictícios**, criados apenas para demonstração.

## Próximos passos

- Mapa real com a localização dos problemas
- Banco de dados e contas de usuário
- Painel para a prefeitura responder e atualizar os status
- Notificações para quem registrou o problema
