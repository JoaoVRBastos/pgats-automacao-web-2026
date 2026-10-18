const seletores = {
  carrosselPaginaInicial: '#slider-carousel',
  menuLogin: '.navbar-nav a[href="/login"]',
  menuProdutos: '.navbar-nav a[href="/products"]',
  menuCarrinho: '.navbar-nav a[href="/view_cart"]',
  menuContato: '.navbar-nav a[href="/contact_us"]'
}

function acessarPaginaInicial() {
  cy.visit('/')
  validarPaginaInicialVisivel()
}

function validarPaginaInicialVisivel() {
  cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
  cy.get(seletores.carrosselPaginaInicial)
    .should('be.visible')
    .and('contain.text', 'Full-Fledged practice website for Automation Engineers')
}

function acessarLoginECadastro() {
  cy.get(seletores.menuLogin).click()
}

function acessarProdutos() {
  cy.get(seletores.menuProdutos).click()
}

function acessarCarrinho() {
  cy.get(seletores.menuCarrinho).click()
}

function acessarContato() {
  cy.get(seletores.menuContato).click()
}

module.exports = {
  acessarPaginaInicial,
  validarPaginaInicialVisivel,
  acessarLoginECadastro,
  acessarProdutos,
  acessarCarrinho,
  acessarContato
}
