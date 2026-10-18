const seletores = {
  carrosselPaginaInicial: '//div[@id="slider-carousel"]',
  menuLogin: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Signup / Login"]',
  // O ícone do menu Produtos é um caractere da fonte Material Icons, por isso contains() em vez de igualdade
  menuProdutos: '//ul[contains(@class, "navbar-nav")]//a[contains(., "Products")]',
  menuCarrinho: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Cart"]',
  menuContato: '//ul[contains(@class, "navbar-nav")]//a[normalize-space()="Contact us"]'
}

function acessarPaginaInicial() {
  cy.visit('/')
  validarPaginaInicialVisivel()
}

function validarPaginaInicialVisivel() {
  cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
  cy.xpath(seletores.carrosselPaginaInicial)
    .should('be.visible')
    .and('contain.text', 'Full-Fledged practice website for Automation Engineers')
}

function acessarLoginECadastro() {
  cy.xpath(seletores.menuLogin).click()
}

function acessarProdutos() {
  cy.xpath(seletores.menuProdutos).click()
}

function acessarCarrinho() {
  cy.xpath(seletores.menuCarrinho).click()
}

function acessarContato() {
  cy.xpath(seletores.menuContato).click()
}

module.exports = {
  acessarPaginaInicial,
  validarPaginaInicialVisivel,
  acessarLoginECadastro,
  acessarProdutos,
  acessarCarrinho,
  acessarContato
}
