# pgats-automacao-web-2026

[![Testes E2E (Cypress + XPath)](https://github.com/JoaoVRBastos/pgats-automacao-web-2026/actions/workflows/e2e.yml/badge.svg)](https://github.com/JoaoVRBastos/pgats-automacao-web-2026/actions/workflows/e2e.yml)

Automação de testes E2E do site [Automation Exercise](https://automationexercise.com/) com [Cypress](https://www.cypress.io/) e a biblioteca [`cypress-xpath`](https://www.npmjs.com/package/cypress-xpath), desenvolvida para a disciplina **Automação de Testes na Camada de Interface (Web)** da Pós-Graduação em Automação de Testes de Software (PGATS).

## Atividade

> Instale a biblioteca `cypress-xpath` no projeto e tente adaptar os seletores para usar XPath.

O que foi feito:

1. Montada uma suíte com 11 casos de teste do Automation Exercise usando seletores **CSS** (commit de linha de base).
2. Instalado o `cypress-xpath` e registrado o comando `cy.xpath()` em `cypress/support/e2e.js`.
3. **Todos** os seletores dos módulos foram convertidos para XPath, trocando `cy.get()` por `cy.xpath()`.
4. Comparadas as duas versões em legibilidade e velocidade de execução (veja [Comparativo CSS x XPath](#comparativo-css-x-xpath)).
5. Criada a spec de entrega `automation-exercise-xpath.cy.js`, autocontida: os mesmos 11 casos com todos os seletores XPath no próprio arquivo, sem depender dos módulos, fixtures ou Faker. Ela roda em qualquer projeto Cypress que tenha o `cypress-xpath` registrado no support.

O diff completo da adaptação está no commit [Adapta seletores para XPath com cypress-xpath](https://github.com/JoaoVRBastos/pgats-automacao-web-2026/commit/c9c7d33).

## Tecnologias

- [Cypress](https://www.cypress.io/) 16
- [cypress-xpath](https://www.npmjs.com/package/cypress-xpath) 2.0.1
- [Faker](https://fakerjs.dev/) para gerar dados aleatórios (nome, e-mail, endereço, etc.)
- [cypress-mochawesome-reporter](https://www.npmjs.com/package/cypress-mochawesome-reporter) para o relatório HTML
- GitHub Actions para execução contínua

## Casos de teste

Baseados na lista oficial em [automationexercise.com/test_cases](https://automationexercise.com/test_cases):

| Caso | Cenário |
| --- | --- |
| 01 | Registrar usuário |
| 02 | Login com e-mail e senha corretos |
| 03 | Login com e-mail e senha incorretos |
| 04 | Deslogar usuário |
| 05 | Registrar usuário com e-mail já existente |
| 06 | Formulário de contato (com upload de arquivo e confirmação) |
| 08 | Verificar todos os produtos e a página de detalhes |
| 09 | Pesquisar produto |
| 10 | Verificar inscrição na página inicial |
| 15 | Fazer pedido registrando-se antes do checkout |
| 16 | Fazer pedido efetuando login antes do checkout |

Os cenários que precisam de um usuário já existente (02, 04, 05 e 16) criam a conta pela [API pública do site](https://automationexercise.com/api_list) (`cy.criarContaViaApi`). Depois de cada teste a conta é removida pela API (`cy.excluirContaViaApi`), assim nenhum usuário fica sobrando.

## Estrutura

```
cypress/
├── e2e/
│   ├── automation-exercise.cy.js        # cenários: só orquestram as ações de negócio
│   └── automation-exercise-xpath.cy.js  # spec de entrega: autocontida, seletores XPath no arquivo
├── fixtures/
│   ├── pedido.json                 # produtos, comentário e cartão de teste do checkout
│   └── anexo-contato.txt           # arquivo enviado no formulário de contato
├── modules/                        # ações de negócio + seletores XPath + asserções
│   ├── cadastro/index.js
│   ├── contato/index.js
│   ├── inscricao/index.js
│   ├── login/index.js
│   ├── navegacao/index.js
│   ├── pedido/index.js
│   └── produtos/index.js
└── support/
    ├── commands.js                 # criação/exclusão de conta via API
    ├── dados.js                    # geração de dados com Faker
    └── e2e.js                      # registra cypress-xpath e o reporter
```

Na spec modular (`automation-exercise.cy.js`), cada módulo concentra seus seletores em uma constante `seletores`, e a spec não conhece nenhum seletor nem faz asserções diretamente. A spec de entrega (`automation-exercise-xpath.cy.js`) reúne tudo em um único arquivo para poder ser enviada sozinha.

## Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 20 ou superior.

```bash
npm install
```

Abrir o Cypress em modo interativo:

```bash
npm run cy:open
```

Executar todos os testes em modo headless (Electron):

```bash
npm test
```

Executar no Chrome:

```bash
npm run test:chrome
```

Ao final da execução headless, o relatório HTML fica em `cypress/reports/index.html`. No GitHub Actions, o relatório e os screenshots de falha são publicados como artefato `relatorio-cypress`.

## Usando o cypress-xpath

Instalação:

```bash
npm install -D cypress-xpath
```

Registro do comando em `cypress/support/e2e.js`:

```js
import 'cypress-xpath'
```

Uso nos módulos:

```js
const seletores = {
  email: '//input[@data-qa="login-email"]',
  senha: '//input[@data-qa="login-password"]',
  botaoEntrar: '//button[@data-qa="login-button"]'
}

function efetuarLogin(email, senha) {
  cy.xpath(seletores.email).type(email)
  cy.xpath(seletores.senha).type(senha, { log: false })
  cy.xpath(seletores.botaoEntrar).click()
}
```

`cy.xpath()` também pode ser encadeado com um caminho relativo (`.//`), que é avaliado dentro do elemento anterior:

```js
cy.xpath('//ul[@id="address_delivery"]').xpath('.//li[contains(@class, "address_firstname")]')
```

## Comparativo CSS x XPath

### Exemplos da adaptação

| Elemento | CSS (antes) | XPath (depois) |
| --- | --- | --- |
| Campo de e-mail do login | `[data-qa="login-email"]` | `//input[@data-qa="login-email"]` |
| Menu "Signup / Login" | `.navbar-nav a[href="/login"]` | `//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Signup / Login"]` |
| Nome do usuário logado | `.navbar-nav li a b` + `.parent()` para conferir "Logged in as" | `//ul[contains(@class, "navbar-nav")]//a[contains(., "Logged in as")]/b` |
| Título "Enter Account Information" | `.login-form h2.title` + `.first()` | `(//div[@class="login-form"]//h2[contains(@class, "title")])[1]` |
| Primeiro link "View Product" | `.features_items .choose a[href^="/product_details/"]` + `.first()` | `(//div[contains(@class, "features_items")]//a[starts-with(@href, "/product_details/")])[1]` |
| Botão "Continue Shopping" do modal | `#cartModal button.close-modal` | `//div[@id="cartModal"]//button[normalize-space()="Continue Shopping"]` |
| Mensagem de pedido confirmado | `[data-qa="order-placed"] + p` | `//h2[@data-qa="order-placed"]/following-sibling::p[1]` |

### Legibilidade

- **Seletores simples ficam maiores em XPath.** `[data-qa="login-email"]` vira `//input[@data-qa="login-email"]`, e uma classe precisa de `contains(@class, "...")` em vez de `.classe`. Para os campos com `data-qa`, o CSS é mais curto e mais fácil de ler.
- **XPath consegue filtrar pelo texto.** `normalize-space()="Continue Shopping"` e `contains(., "Logged in as")` encontram o elemento pelo que o usuário vê, coisa que o CSS não faz (no Cypress isso exigiria `cy.contains`). Isso ajudou nos links do menu e nos botões sem `id` ou `data-qa`.
- **XPath navega para os lados e para cima no DOM.** Eixos como `following-sibling::` (e `ancestor::`, `parent::`) e índices globais como `(...)[1]` deixaram o seletor descrever sozinho o elemento desejado, sem `.first()` ou `.parent()` na cadeia de comandos.
- **Seletores por texto são mais frágeis.** Uma mudança de texto ou idioma quebra o XPath, enquanto um `data-qa` continua estável.
- **Mensagens de erro.** Quando um XPath falha, o Cypress mostra a expressão inteira (`Expected to find element: //button[...]`), que é mais longa de ler que o seletor CSS equivalente.

### Velocidade

Execução completa da suíte (11 testes, Electron headless, mesma máquina):

| Versão | Execução 1 | Execução 2 |
| --- | --- | --- |
| CSS (`cy.get`) | 1 min 28 s | 1 min 34 s |
| XPath (`cy.xpath`) | 1 min 27 s | 1 min 23 s |

Tempo por teste (uma execução de cada versão):

| Caso | CSS | XPath |
| --- | ---: | ---: |
| 01 | 12,9 s | 12,3 s |
| 02 | 8,4 s | 7,8 s |
| 03 | 3,4 s | 3,1 s |
| 04 | 6,6 s | 6,1 s |
| 05 | 4,0 s | 3,4 s |
| 06 | 7,3 s | 5,9 s |
| 08 | 5,1 s | 4,8 s |
| 09 | 7,0 s | 4,8 s |
| 10 | 2,7 s | 2,5 s |
| 15 | 20,5 s | 16,0 s |
| 16 | 13,4 s | 18,0 s |

A diferença entre as versões fica dentro da variação normal entre execuções e não segue um padrão: em alguns casos o CSS foi mais rápido, em outros o XPath (o caso 16 com XPath levou 18,0 s em uma execução e 13,7 s na seguinte). O tempo é dominado pela rede e pelo carregamento das páginas do site. No Chrome headless a suíte XPath rodou em 1 min 2 s.

Medindo só a resolução dos seletores no navegador (5.000 repetições na página de login), o `querySelectorAll` levou entre 0,3 e 1 µs por busca, e o `document.evaluate` do XPath entre 5 e 12 µs. O XPath é cerca de 10 vezes mais lento nesse nível, mas a diferença some dentro de um comando Cypress, que levou cerca de 0,8 a 0,9 ms tanto com `cy.get` quanto com `cy.xpath`.

### Conclusão

Para este site, XPath não trouxe ganho de velocidade, e para elementos com `data-qa` ou `id` o seletor CSS continua mais legível. O XPath compensa quando é preciso localizar elementos pelo texto, pela posição ou pela relação com outro elemento. Vale lembrar que o pacote `cypress-xpath` está marcado como sem suporte no npm, então em projetos novos o mais indicado é CSS com `data-*` mais `cy.contains()` para buscas por texto.

## Observações sobre o site

- Os anúncios do Google deixam o site lento e às vezes abrem um anúncio de tela cheia (`#google_vignette`). Os domínios de anúncio são bloqueados com `blockHosts` no `cypress.config.js`.
- Erros de JavaScript dos scripts de terceiros do site são ignorados em `cypress/support/e2e.js`, porque não fazem parte da aplicação testada.
- O cartão usado no checkout (`4111 1111 1111 1111`) é um número de teste público; o site é uma loja fictícia de prática.
