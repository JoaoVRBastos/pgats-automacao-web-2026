const seletores = {
  tituloNovoUsuario: '.signup-form h2',
  nomeNovoUsuario: '[data-qa="signup-name"]',
  emailNovoUsuario: '[data-qa="signup-email"]',
  botaoIniciarCadastro: '[data-qa="signup-button"]',
  mensagemEmailExistente: '.signup-form form p',

  tituloInformacoesDaConta: '.login-form h2.title',
  tratamento: (tratamento) => `input[name="title"][value="${tratamento}"]`,
  senha: '[data-qa="password"]',
  dia: '[data-qa="days"]',
  mes: '[data-qa="months"]',
  ano: '[data-qa="years"]',
  newsletter: '#newsletter',
  ofertas: '#optin',
  primeiroNome: '[data-qa="first_name"]',
  sobrenome: '[data-qa="last_name"]',
  empresa: '[data-qa="company"]',
  endereco: '[data-qa="address"]',
  complemento: '[data-qa="address2"]',
  pais: '[data-qa="country"]',
  estado: '[data-qa="state"]',
  cidade: '[data-qa="city"]',
  cep: '[data-qa="zipcode"]',
  celular: '[data-qa="mobile_number"]',
  botaoCriarConta: '[data-qa="create-account"]',

  tituloContaCriada: '[data-qa="account-created"]',
  tituloContaExcluida: '[data-qa="account-deleted"]',
  botaoContinuar: '[data-qa="continue-button"]',
  menuExcluirConta: '.navbar-nav a[href="/delete_account"]'
}

function iniciarCadastro(nome, email) {
  cy.get(seletores.tituloNovoUsuario).should('be.visible').and('have.text', 'New User Signup!')
  cy.get(seletores.nomeNovoUsuario).type(nome)
  cy.get(seletores.emailNovoUsuario).type(email)
  cy.get(seletores.botaoIniciarCadastro).click()
}

function preencherInformacoesDaConta(usuario) {
  cy.get(seletores.tituloInformacoesDaConta).first().should('be.visible').and('have.text', 'Enter Account Information')
  cy.get(seletores.tratamento(usuario.tratamento)).check()
  cy.get(seletores.senha).type(usuario.senha, { log: false })
  cy.get(seletores.dia).select(usuario.nascimento.dia)
  cy.get(seletores.mes).select(usuario.nascimento.mes)
  cy.get(seletores.ano).select(usuario.nascimento.ano)
  cy.get(seletores.newsletter).check()
  cy.get(seletores.ofertas).check()
  cy.get(seletores.primeiroNome).type(usuario.primeiroNome)
  cy.get(seletores.sobrenome).type(usuario.sobrenome)
  cy.get(seletores.empresa).type(usuario.empresa)
  cy.get(seletores.endereco).type(usuario.endereco)
  cy.get(seletores.complemento).type(usuario.complemento)
  cy.get(seletores.pais).select(usuario.pais)
  cy.get(seletores.estado).type(usuario.estado)
  cy.get(seletores.cidade).type(usuario.cidade)
  cy.get(seletores.cep).type(usuario.cep)
  cy.get(seletores.celular).type(usuario.celular)
  cy.get(seletores.botaoCriarConta).click()
}

function validarContaCriada() {
  cy.get(seletores.tituloContaCriada).should('be.visible').and('have.text', 'Account Created!')
  cy.get(seletores.botaoContinuar).click()
}

function cadastrarUsuario(usuario) {
  iniciarCadastro(usuario.nome, usuario.email)
  preencherInformacoesDaConta(usuario)
  validarContaCriada()
}

function validarMensagemEmailExistente() {
  cy.get(seletores.mensagemEmailExistente)
    .should('be.visible')
    .and('have.text', 'Email Address already exist!')
}

function excluirConta() {
  cy.get(seletores.menuExcluirConta).click()
  cy.get(seletores.tituloContaExcluida).should('be.visible').and('have.text', 'Account Deleted!')
  cy.get(seletores.botaoContinuar).click()
}

module.exports = {
  iniciarCadastro,
  preencherInformacoesDaConta,
  validarContaCriada,
  cadastrarUsuario,
  validarMensagemEmailExistente,
  excluirConta
}
