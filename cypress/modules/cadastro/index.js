const seletores = {
  tituloNovoUsuario: '//div[@class="signup-form"]/h2',
  nomeNovoUsuario: '//input[@data-qa="signup-name"]',
  emailNovoUsuario: '//input[@data-qa="signup-email"]',
  botaoIniciarCadastro: '//button[@data-qa="signup-button"]',
  mensagemEmailExistente: '//div[@class="signup-form"]/form/p',

  // A página tem dois títulos h2.title no formulário; o índice entre parênteses pega o primeiro do documento
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
  botaoContinuar: '//a[@data-qa="continue-button"]',
  menuExcluirConta: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Delete Account"]'
}

function iniciarCadastro(nome, email) {
  cy.xpath(seletores.tituloNovoUsuario).should('be.visible').and('have.text', 'New User Signup!')
  cy.xpath(seletores.nomeNovoUsuario).type(nome)
  cy.xpath(seletores.emailNovoUsuario).type(email)
  cy.xpath(seletores.botaoIniciarCadastro).click()
}

function preencherInformacoesDaConta(usuario) {
  cy.xpath(seletores.tituloInformacoesDaConta).should('be.visible').and('have.text', 'Enter Account Information')
  cy.xpath(seletores.tratamento(usuario.tratamento)).check()
  cy.xpath(seletores.senha).type(usuario.senha, { log: false })
  cy.xpath(seletores.dia).select(usuario.nascimento.dia)
  cy.xpath(seletores.mes).select(usuario.nascimento.mes)
  cy.xpath(seletores.ano).select(usuario.nascimento.ano)
  cy.xpath(seletores.newsletter).check()
  cy.xpath(seletores.ofertas).check()
  cy.xpath(seletores.primeiroNome).type(usuario.primeiroNome)
  cy.xpath(seletores.sobrenome).type(usuario.sobrenome)
  cy.xpath(seletores.empresa).type(usuario.empresa)
  cy.xpath(seletores.endereco).type(usuario.endereco)
  cy.xpath(seletores.complemento).type(usuario.complemento)
  cy.xpath(seletores.pais).select(usuario.pais)
  cy.xpath(seletores.estado).type(usuario.estado)
  cy.xpath(seletores.cidade).type(usuario.cidade)
  cy.xpath(seletores.cep).type(usuario.cep)
  cy.xpath(seletores.celular).type(usuario.celular)
  cy.xpath(seletores.botaoCriarConta).click()
}

function validarContaCriada() {
  cy.xpath(seletores.tituloContaCriada).should('be.visible').and('have.text', 'Account Created!')
  cy.xpath(seletores.botaoContinuar).click()
}

function cadastrarUsuario(usuario) {
  iniciarCadastro(usuario.nome, usuario.email)
  preencherInformacoesDaConta(usuario)
  validarContaCriada()
}

function validarMensagemEmailExistente() {
  cy.xpath(seletores.mensagemEmailExistente)
    .should('be.visible')
    .and('have.text', 'Email Address already exist!')
}

function excluirConta() {
  cy.xpath(seletores.menuExcluirConta).click()
  cy.xpath(seletores.tituloContaExcluida).should('be.visible').and('have.text', 'Account Deleted!')
  cy.xpath(seletores.botaoContinuar).click()
}

module.exports = {
  iniciarCadastro,
  preencherInformacoesDaConta,
  validarContaCriada,
  cadastrarUsuario,
  validarMensagemEmailExistente,
  excluirConta
}
