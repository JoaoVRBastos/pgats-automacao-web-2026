const seletores = {
  tituloLogin: '.login-form h2',
  email: '[data-qa="login-email"]',
  senha: '[data-qa="login-password"]',
  botaoEntrar: '[data-qa="login-button"]',
  mensagemErro: '.login-form form p',
  usuarioAutenticado: '.navbar-nav li a b',
  menuLogout: '.navbar-nav a[href="/logout"]'
}

function efetuarLogin(email, senha) {
  cy.get(seletores.tituloLogin).should('be.visible').and('have.text', 'Login to your account')
  cy.get(seletores.email).type(email)
  cy.get(seletores.senha).type(senha, { log: false })
  cy.get(seletores.botaoEntrar).click()
}

function validarUsuarioAutenticado(nome) {
  cy.get(seletores.usuarioAutenticado)
    .should('be.visible')
    .and('have.text', nome)
    .parent()
    .should('contain.text', 'Logged in as')
}

function validarMensagemCredenciaisInvalidas() {
  cy.get(seletores.mensagemErro)
    .should('be.visible')
    .and('have.text', 'Your email or password is incorrect!')
}

function efetuarLogout() {
  cy.get(seletores.menuLogout).click()
}

function validarPaginaDeLoginVisivel() {
  cy.location('pathname').should('eq', '/login')
  cy.get(seletores.tituloLogin).should('be.visible').and('have.text', 'Login to your account')
}

module.exports = {
  efetuarLogin,
  validarUsuarioAutenticado,
  validarMensagemCredenciaisInvalidas,
  efetuarLogout,
  validarPaginaDeLoginVisivel
}
