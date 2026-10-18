const seletores = {
  tituloLogin: '//div[@class="login-form"]/h2',
  email: '//input[@data-qa="login-email"]',
  senha: '//input[@data-qa="login-password"]',
  botaoEntrar: '//button[@data-qa="login-button"]',
  mensagemErro: '//div[@class="login-form"]/form/p',
  // Seleciona pelo texto do link e desce até o <b> com o nome: CSS não consegue filtrar por texto
  usuarioAutenticado: '//ul[contains(@class, "navbar-nav")]//a[contains(., "Logged in as")]/b',
  menuLogout: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Logout"]'
}

function efetuarLogin(email, senha) {
  cy.xpath(seletores.tituloLogin).should('be.visible').and('have.text', 'Login to your account')
  cy.xpath(seletores.email).type(email)
  cy.xpath(seletores.senha).type(senha, { log: false })
  cy.xpath(seletores.botaoEntrar).click()
}

function validarUsuarioAutenticado(nome) {
  cy.xpath(seletores.usuarioAutenticado)
    .should('be.visible')
    .and('have.text', nome)
}

function validarMensagemCredenciaisInvalidas() {
  cy.xpath(seletores.mensagemErro)
    .should('be.visible')
    .and('have.text', 'Your email or password is incorrect!')
}

function efetuarLogout() {
  cy.xpath(seletores.menuLogout).click()
}

function validarPaginaDeLoginVisivel() {
  cy.location('pathname').should('eq', '/login')
  cy.xpath(seletores.tituloLogin).should('be.visible').and('have.text', 'Login to your account')
}

module.exports = {
  efetuarLogin,
  validarUsuarioAutenticado,
  validarMensagemCredenciaisInvalidas,
  efetuarLogout,
  validarPaginaDeLoginVisivel
}
