/// <reference types="cypress" />

// Spec autocontida da atividade "cypress-xpath": todos os seletores estão escritos em XPath
// e são usados com cy.xpath(). Pré-requisitos no projeto:
//   npm install -D cypress-xpath
//   cypress/support/e2e.js -> import 'cypress-xpath'

const URL_BASE = 'https://automationexercise.com'

// Anúncios do Google deixam o site lento e abrem o "google_vignette" por cima da página
const ANUNCIOS = /googlesyndication|doubleclick|googleadservices|google-analytics|googletagmanager|googletagservices|adtrafficquality|fundingchoicesmessages/

const seletores = {
  menu: {
    login: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Signup / Login"]',
    // O ícone do menu Produtos é um caractere da fonte Material Icons, por isso contains()
    produtos: '//ul[contains(@class, "navbar-nav")]//a[contains(., "Products")]',
    carrinho: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Cart"]',
    contato: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Contact us"]',
    logout: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Logout"]',
    excluirConta: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Delete Account"]',
    // Filtra o link pelo texto e desce até o <b> com o nome do usuário
    usuarioAutenticado: '//ul[contains(@class, "navbar-nav")]//a[contains(., "Logged in as")]/b'
  },
  paginaInicial: {
    carrossel: '//div[@id="slider-carousel"]'
  },
  login: {
    titulo: '//div[@class="login-form"]/h2',
    email: '//input[@data-qa="login-email"]',
    senha: '//input[@data-qa="login-password"]',
    botaoEntrar: '//button[@data-qa="login-button"]',
    mensagemErro: '//div[@class="login-form"]/form/p'
  },
  cadastro: {
    titulo: '//div[@class="signup-form"]/h2',
    nome: '//input[@data-qa="signup-name"]',
    email: '//input[@data-qa="signup-email"]',
    botaoCadastrar: '//button[@data-qa="signup-button"]',
    mensagemEmailExistente: '//div[@class="signup-form"]/form/p',
    // Há dois h2.title no formulário; o índice entre parênteses pega o primeiro do documento
    tituloInformacoesDaConta: '(//div[@class="login-form"]//h2[contains(@class, "title")])[1]',
    tratamento: (tratamento) => `//input[@name="title"][@value="${tratamento}"]`,
    senha: '//input[@data-qa="password"]',
    dia: '//select[@data-qa="days"]',
    mes: '//select[@data-qa="months"]',
    ano: '//select[@data-qa="years"]',
    newsletter: '//input[@id="newsletter"]',
    ofertas: '//input[@id="optin"]',
    primeiroNome: '//input[@data-qa="first_name"]',
    sobrenome: '//input[@data-qa="last_name"]',
    empresa: '//input[@data-qa="company"]',
    endereco: '//input[@data-qa="address"]',
    complemento: '//input[@data-qa="address2"]',
    pais: '//select[@data-qa="country"]',
    estado: '//input[@data-qa="state"]',
    cidade: '//input[@data-qa="city"]',
    cep: '//input[@data-qa="zipcode"]',
    celular: '//input[@data-qa="mobile_number"]',
    botaoCriarConta: '//button[@data-qa="create-account"]',
    tituloContaCriada: '//h2[@data-qa="account-created"]',
    tituloContaExcluida: '//h2[@data-qa="account-deleted"]',
    botaoContinuar: '//a[@data-qa="continue-button"]'
  },
  contato: {
    titulo: '//div[@class="contact-form"]/h2[contains(@class, "title")]',
    nome: '//input[@data-qa="name"]',
    email: '//input[@data-qa="email"]',
    assunto: '//input[@data-qa="subject"]',
    mensagem: '//textarea[@data-qa="message"]',
    arquivo: '//input[@type="file"][@name="upload_file"]',
    botaoEnviar: '//input[@data-qa="submit-button"]',
    mensagemSucesso: '//div[@class="contact-form"]/div[contains(@class, "status")]',
    botaoVoltarInicio: '//div[@id="form-section"]/a[contains(., "Home")]'
  },
  inscricao: {
    rodape: '//footer[@id="footer"]',
    titulo: '//footer[@id="footer"]//div[@class="single-widget"]/h2',
    email: '//input[@id="susbscribe_email"]',
    botaoInscrever: '//button[@id="subscribe"]',
    mensagemSucesso: '//div[@id="success-subscribe"]/div[contains(@class, "alert-success")]'
  },
  produtos: {
    tituloListagem: '//div[contains(@class, "features_items")]/h2[contains(@class, "title")]',
    cards: '//div[contains(@class, "features_items")]//div[@class="product-image-wrapper"]',
    nomes: '//div[contains(@class, "features_items")]//div[contains(@class, "productinfo")]/p',
    // O índice global (...)[1] substitui o .first() que seria necessário com CSS
    primeiroVerProduto: '(//div[contains(@class, "features_items")]//a[starts-with(@href, "/product_details/")])[1]',
    campoPesquisa: '//input[@id="search_product"]',
    botaoPesquisar: '//button[@id="submit_search"]',
    detalhes: '//div[@class="product-information"]',
    nomeDoProduto: '//div[@class="product-information"]/h2',
    adicionarAoCarrinho: (idProduto) =>
      `//div[contains(@class, "features_items")]//div[contains(@class, "productinfo")]/a[@data-product-id="${idProduto}"]`,
    tituloModal: '//div[@id="cartModal"]//h4[contains(@class, "modal-title")]',
    botaoContinuarComprando: '//div[@id="cartModal"]//button[normalize-space()="Continue Shopping"]'
  },
  pedido: {
    linhasDoCarrinho: '//table[@id="cart_info_table"]/tbody/tr[starts-with(@id, "product-")]',
    linhaDoProduto: (idProduto) => `//table[@id="cart_info_table"]//tr[@id="product-${idProduto}"]`,
    botaoProsseguirCheckout: '//a[normalize-space()="Proceed To Checkout"]',
    enderecoEntrega: '//ul[@id="address_delivery"]',
    enderecoCobranca: '//ul[@id="address_invoice"]',
    // Caminho relativo (.//) avaliado dentro do endereço já encontrado
    nomeNoEndereco: './/li[contains(@class, "address_firstname")]',
    linhasDoPedido: '//*[@id="cart_info"]//tr[starts-with(@id, "product-")]',
    comentario: '//textarea[@name="message"]',
    botaoFazerPedido: '//a[normalize-space()="Place Order"]',
    nomeNoCartao: '//input[@data-qa="name-on-card"]',
    numeroDoCartao: '//input[@data-qa="card-number"]',
    cvc: '//input[@data-qa="cvc"]',
    mesDeValidade: '//input[@data-qa="expiry-month"]',
    anoDeValidade: '//input[@data-qa="expiry-year"]',
    botaoPagar: '//button[@data-qa="pay-button"]',
    tituloPedidoConfirmado: '//h2[@data-qa="order-placed"]',
    // Eixo following-sibling: o parágrafo logo após o título
    mensagemPedidoConfirmado: '//h2[@data-qa="order-placed"]/following-sibling::p[1]'
  }
}

const PRODUTOS_DO_PEDIDO = [1, 2]

const CARTAO_DE_TESTE = {
  nome: 'PGATS XPath',
  numero: '4111111111111111',
  cvc: '123',
  mesValidade: '12',
  anoValidade: '2030'
}

function gerarUsuario() {
  const id = `${Date.now()}${Cypress._.random(100, 999)}`

  return {
    nome: 'PGATS XPath',
    email: `pgats-xpath-${id}@mail.com`,
    senha: `senha${id}`,
    tratamento: 'Mrs',
    nascimento: { dia: '10', mes: '5', ano: '1990' },
    primeiroNome: 'PGATS',
    sobrenome: 'XPath',
    empresa: 'PGATS Automação',
    endereco: 'Rua das Flores, 123',
    complemento: 'Apto 45',
    pais: 'Canada',
    estado: 'Ontario',
    cidade: 'Toronto',
    cep: '12345',
    celular: '11999998888'
  }
}

// Pré-condições e limpeza pela API pública do site (https://automationexercise.com/api_list)
function criarContaViaApi(usuario) {
  cy.request({
    method: 'POST',
    url: `${URL_BASE}/api/createAccount`,
    form: true,
    body: {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: usuario.tratamento,
      birth_date: usuario.nascimento.dia,
      birth_month: usuario.nascimento.mes,
      birth_year: usuario.nascimento.ano,
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: usuario.empresa,
      address1: usuario.endereco,
      address2: usuario.complemento,
      country: usuario.pais,
      zipcode: usuario.cep,
      state: usuario.estado,
      city: usuario.cidade,
      mobile_number: usuario.celular
    }
  })
    .its('body')
    // A API responde JSON com content-type text/html, então o corpo chega como texto
    .then((body) => (typeof body === 'string' ? JSON.parse(body) : body))
    .its('responseCode')
    .should('eq', 201)
}

function excluirContaViaApi(usuario) {
  // A conta pode já ter sido excluída pela interface, então a resposta não é validada
  cy.request({
    method: 'DELETE',
    url: `${URL_BASE}/api/deleteAccount`,
    form: true,
    body: { email: usuario.email, password: usuario.senha },
    failOnStatusCode: false
  })
}

function validarPaginaInicial() {
  cy.url().should('eq', `${URL_BASE}/`)
  cy.xpath(seletores.paginaInicial.carrossel)
    .should('be.visible')
    .and('contain.text', 'Full-Fledged practice website for Automation Engineers')
}

function efetuarLogin(email, senha) {
  cy.xpath(seletores.menu.login).click()
  cy.xpath(seletores.login.titulo).should('be.visible').and('have.text', 'Login to your account')
  cy.xpath(seletores.login.email).type(email)
  cy.xpath(seletores.login.senha).type(senha, { log: false })
  cy.xpath(seletores.login.botaoEntrar).click()
}

function validarUsuarioAutenticado(nome) {
  cy.xpath(seletores.menu.usuarioAutenticado).should('be.visible').and('have.text', nome)
}

function iniciarCadastro(nome, email) {
  cy.xpath(seletores.menu.login).click()
  cy.xpath(seletores.cadastro.titulo).should('be.visible').and('have.text', 'New User Signup!')
  cy.xpath(seletores.cadastro.nome).type(nome)
  cy.xpath(seletores.cadastro.email).type(email)
  cy.xpath(seletores.cadastro.botaoCadastrar).click()
}

function cadastrarUsuario(usuario) {
  iniciarCadastro(usuario.nome, usuario.email)

  cy.xpath(seletores.cadastro.tituloInformacoesDaConta)
    .should('be.visible')
    .and('have.text', 'Enter Account Information')
  cy.xpath(seletores.cadastro.tratamento(usuario.tratamento)).check()
  cy.xpath(seletores.cadastro.senha).type(usuario.senha, { log: false })
  cy.xpath(seletores.cadastro.dia).select(usuario.nascimento.dia)
  cy.xpath(seletores.cadastro.mes).select(usuario.nascimento.mes)
  cy.xpath(seletores.cadastro.ano).select(usuario.nascimento.ano)
  cy.xpath(seletores.cadastro.newsletter).check()
  cy.xpath(seletores.cadastro.ofertas).check()
  cy.xpath(seletores.cadastro.primeiroNome).type(usuario.primeiroNome)
  cy.xpath(seletores.cadastro.sobrenome).type(usuario.sobrenome)
  cy.xpath(seletores.cadastro.empresa).type(usuario.empresa)
  cy.xpath(seletores.cadastro.endereco).type(usuario.endereco)
  cy.xpath(seletores.cadastro.complemento).type(usuario.complemento)
  cy.xpath(seletores.cadastro.pais).select(usuario.pais)
  cy.xpath(seletores.cadastro.estado).type(usuario.estado)
  cy.xpath(seletores.cadastro.cidade).type(usuario.cidade)
  cy.xpath(seletores.cadastro.cep).type(usuario.cep)
  cy.xpath(seletores.cadastro.celular).type(usuario.celular)
  cy.xpath(seletores.cadastro.botaoCriarConta).click()

  cy.xpath(seletores.cadastro.tituloContaCriada).should('be.visible').and('have.text', 'Account Created!')
  cy.xpath(seletores.cadastro.botaoContinuar).click()
  validarUsuarioAutenticado(usuario.nome)
}

function excluirConta() {
  cy.xpath(seletores.menu.excluirConta).click()
  cy.xpath(seletores.cadastro.tituloContaExcluida).should('be.visible').and('have.text', 'Account Deleted!')
  cy.xpath(seletores.cadastro.botaoContinuar).click()
}

function acessarListagemDeProdutos() {
  cy.xpath(seletores.menu.produtos).click()
  cy.location('pathname').should('eq', '/products')
  cy.xpath(seletores.produtos.tituloListagem).should('be.visible').and('have.text', 'All Products')
  cy.xpath(seletores.produtos.cards).should('have.length.greaterThan', 0)
}

function comprarProdutos(usuario) {
  PRODUTOS_DO_PEDIDO.forEach((idProduto) => {
    cy.xpath(seletores.produtos.adicionarAoCarrinho(idProduto)).click()
    cy.xpath(seletores.produtos.tituloModal).should('be.visible').and('have.text', 'Added!')
    cy.xpath(seletores.produtos.botaoContinuarComprando).click()
    cy.xpath(seletores.produtos.tituloModal).should('not.be.visible')
  })

  cy.xpath(seletores.menu.carrinho).click()
  cy.location('pathname').should('eq', '/view_cart')
  cy.xpath(seletores.pedido.linhasDoCarrinho).should('have.length', PRODUTOS_DO_PEDIDO.length)
  PRODUTOS_DO_PEDIDO.forEach((idProduto) => {
    cy.xpath(seletores.pedido.linhaDoProduto(idProduto)).should('be.visible')
  })
  cy.xpath(seletores.pedido.botaoProsseguirCheckout).click()

  const nomeCompleto = `${usuario.tratamento}. ${usuario.primeiroNome} ${usuario.sobrenome}`
  cy.location('pathname').should('eq', '/checkout')
  ;[seletores.pedido.enderecoEntrega, seletores.pedido.enderecoCobranca].forEach((endereco) => {
    cy.xpath(endereco).xpath(seletores.pedido.nomeNoEndereco).should('have.text', nomeCompleto)
    cy.xpath(endereco)
      .should('contain.text', usuario.empresa)
      .and('contain.text', usuario.endereco)
      .and('contain.text', usuario.cidade)
      .and('contain.text', usuario.estado)
      .and('contain.text', usuario.cep)
      .and('contain.text', usuario.pais)
      .and('contain.text', usuario.celular)
  })
  cy.xpath(seletores.pedido.linhasDoPedido).should('have.length', PRODUTOS_DO_PEDIDO.length)

  cy.xpath(seletores.pedido.comentario).type('Pedido criado pela automação de testes (PGATS).')
  cy.xpath(seletores.pedido.botaoFazerPedido).click()
  cy.xpath(seletores.pedido.nomeNoCartao).type(CARTAO_DE_TESTE.nome)
  cy.xpath(seletores.pedido.numeroDoCartao).type(CARTAO_DE_TESTE.numero)
  cy.xpath(seletores.pedido.cvc).type(CARTAO_DE_TESTE.cvc)
  cy.xpath(seletores.pedido.mesDeValidade).type(CARTAO_DE_TESTE.mesValidade)
  cy.xpath(seletores.pedido.anoDeValidade).type(CARTAO_DE_TESTE.anoValidade)
  cy.xpath(seletores.pedido.botaoPagar).click()

  cy.location('pathname').should('match', /^\/payment_done\//)
  cy.xpath(seletores.pedido.tituloPedidoConfirmado).should('be.visible').and('have.text', 'Order Placed!')
  cy.xpath(seletores.pedido.mensagemPedidoConfirmado)
    .should('have.text', 'Congratulations! Your order has been confirmed!')
}

describe('Automation Exercise com seletores XPath', () => {
  let usuario

  beforeEach(() => {
    // Erros dos scripts de terceiros do site não fazem parte da aplicação testada
    cy.on('uncaught:exception', () => false)
    cy.intercept({ url: ANUNCIOS }, { statusCode: 204, body: '' })

    usuario = gerarUsuario()
    cy.visit(URL_BASE)
    validarPaginaInicial()
  })

  afterEach(() => {
    excluirContaViaApi(usuario)
  })

  it('Caso de Teste 01: Registrar usuário', () => {
    cadastrarUsuario(usuario)
    excluirConta()
  })

  it('Caso de Teste 02: Login com e-mail e senha corretos', () => {
    criarContaViaApi(usuario)

    efetuarLogin(usuario.email, usuario.senha)
    validarUsuarioAutenticado(usuario.nome)
    excluirConta()
  })

  it('Caso de Teste 03: Login com e-mail e senha incorretos', () => {
    efetuarLogin(usuario.email, usuario.senha)

    cy.xpath(seletores.login.mensagemErro)
      .should('be.visible')
      .and('have.text', 'Your email or password is incorrect!')
  })

  it('Caso de Teste 04: Deslogar usuário', () => {
    criarContaViaApi(usuario)

    efetuarLogin(usuario.email, usuario.senha)
    validarUsuarioAutenticado(usuario.nome)
    cy.xpath(seletores.menu.logout).click()

    cy.location('pathname').should('eq', '/login')
    cy.xpath(seletores.login.titulo).should('be.visible').and('have.text', 'Login to your account')
  })

  it('Caso de Teste 05: Registrar usuário com e-mail já existente', () => {
    criarContaViaApi(usuario)

    iniciarCadastro(usuario.nome, usuario.email)

    cy.xpath(seletores.cadastro.mensagemEmailExistente)
      .should('be.visible')
      .and('have.text', 'Email Address already exist!')
  })

  it('Caso de Teste 06: Formulário de contato', () => {
    cy.xpath(seletores.menu.contato).click()
    cy.xpath(seletores.contato.titulo).should('be.visible').and('have.text', 'Get In Touch')
    cy.xpath(seletores.contato.nome).type(usuario.nome)
    cy.xpath(seletores.contato.email).type(usuario.email)
    cy.xpath(seletores.contato.assunto).type('Atividade cypress-xpath')
    cy.xpath(seletores.contato.mensagem).type('Mensagem enviada pela automação de testes com XPath.')
    cy.xpath(seletores.contato.arquivo).selectFile({
      contents: Cypress.Buffer.from('Anexo enviado pela automação PGATS.'),
      fileName: 'anexo-contato.txt'
    })

    cy.on('window:confirm', (texto) => {
      expect(texto).to.eq('Press OK to proceed!')
      return true
    })
    cy.xpath(seletores.contato.botaoEnviar).click()

    cy.xpath(seletores.contato.mensagemSucesso)
      .should('be.visible')
      .and('have.text', 'Success! Your details have been submitted successfully.')
    cy.xpath(seletores.contato.botaoVoltarInicio).click()
    validarPaginaInicial()
  })

  it('Caso de Teste 08: Verificar todos os produtos e a página de detalhes', () => {
    acessarListagemDeProdutos()
    cy.xpath(seletores.produtos.primeiroVerProduto).click()

    cy.location('pathname').should('match', /^\/product_details\/\d+$/)
    cy.xpath(seletores.produtos.nomeDoProduto).should('be.visible').and('not.be.empty')
    cy.xpath(seletores.produtos.detalhes)
      .should('contain.text', 'Category:')
      .and('contain.text', 'Rs.')
      .and('contain.text', 'Availability:')
      .and('contain.text', 'Condition:')
      .and('contain.text', 'Brand:')
  })

  it('Caso de Teste 09: Pesquisar produto', () => {
    const termo = 'Jeans'

    acessarListagemDeProdutos()
    cy.xpath(seletores.produtos.campoPesquisa).type(termo)
    cy.xpath(seletores.produtos.botaoPesquisar).click()

    cy.xpath(seletores.produtos.tituloListagem).should('be.visible').and('have.text', 'Searched Products')
    cy.xpath(seletores.produtos.nomes)
      .should('have.length.greaterThan', 0)
      .each(($nome) => {
        expect($nome.text().toLowerCase()).to.contain(termo.toLowerCase())
      })
  })

  it('Caso de Teste 10: Verificar inscrição na página inicial', () => {
    cy.xpath(seletores.inscricao.rodape).scrollIntoView()
    cy.xpath(seletores.inscricao.titulo).should('be.visible').and('have.text', 'Subscription')
    cy.xpath(seletores.inscricao.email).type(usuario.email)
    cy.xpath(seletores.inscricao.botaoInscrever).click()

    cy.xpath(seletores.inscricao.mensagemSucesso)
      .should('be.visible')
      .and('have.text', 'You have been successfully subscribed!')
  })

  it('Caso de Teste 15: Fazer pedido registrando-se antes do checkout', () => {
    cadastrarUsuario(usuario)
    comprarProdutos(usuario)
    excluirConta()
  })

  it('Caso de Teste 16: Fazer pedido efetuando login antes do checkout', () => {
    criarContaViaApi(usuario)

    efetuarLogin(usuario.email, usuario.senha)
    validarUsuarioAutenticado(usuario.nome)
    comprarProdutos(usuario)
    excluirConta()
  })
})
