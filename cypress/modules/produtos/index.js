const seletores = {
  tituloListagem: '//div[contains(@class, "features_items")]/h2[contains(@class, "title")]',
  cardsDeProduto: '//div[contains(@class, "features_items")]//div[@class="product-image-wrapper"]',
  nomesDosProdutos: '//div[contains(@class, "features_items")]//div[contains(@class, "productinfo")]/p',
  // O índice global (...)[1] substitui o .first() que a versão CSS precisava
  primeiroVerProduto: '(//div[contains(@class, "features_items")]//a[starts-with(@href, "/product_details/")])[1]',
  campoPesquisa: '//input[@id="search_product"]',
  botaoPesquisar: '//button[@id="submit_search"]',
  detalhes: '//div[@class="product-information"]',
  nomeDoProduto: '//div[@class="product-information"]/h2',
  adicionarAoCarrinho: (idProduto) =>
    `//div[contains(@class, "features_items")]//div[contains(@class, "productinfo")]/a[@data-product-id="${idProduto}"]`,
  tituloModalAdicionado: '//div[@id="cartModal"]//h4[contains(@class, "modal-title")]',
  botaoContinuarComprando: '//div[@id="cartModal"]//button[normalize-space()="Continue Shopping"]'
}

function validarListagemDeProdutos(titulo = 'All Products') {
  cy.location('pathname').should('eq', '/products')
  cy.xpath(seletores.tituloListagem).should('be.visible').and('have.text', titulo)
  cy.xpath(seletores.cardsDeProduto).should('have.length.greaterThan', 0)
}

function abrirDetalhesDoPrimeiroProduto() {
  cy.xpath(seletores.primeiroVerProduto).click()
}

function validarDetalhesDoProduto() {
  cy.location('pathname').should('match', /^\/product_details\/\d+$/)
  cy.xpath(seletores.nomeDoProduto).should('be.visible').and('not.be.empty')
  cy.xpath(seletores.detalhes)
    .should('contain.text', 'Category:')
    .and('contain.text', 'Rs.')
    .and('contain.text', 'Availability:')
    .and('contain.text', 'Condition:')
    .and('contain.text', 'Brand:')
}

function pesquisarProduto(termo) {
  cy.xpath(seletores.campoPesquisa).type(termo)
  cy.xpath(seletores.botaoPesquisar).click()
}

function validarResultadoDaPesquisa(termo) {
  cy.xpath(seletores.tituloListagem).should('be.visible').and('have.text', 'Searched Products')
  cy.xpath(seletores.nomesDosProdutos)
    .should('have.length.greaterThan', 0)
    .each(($nome) => {
      expect($nome.text().toLowerCase()).to.contain(termo.toLowerCase())
    })
}

function adicionarProdutosAoCarrinho(idsProdutos) {
  idsProdutos.forEach((idProduto) => {
    cy.xpath(seletores.adicionarAoCarrinho(idProduto)).click()
    cy.xpath(seletores.tituloModalAdicionado).should('be.visible').and('have.text', 'Added!')
    cy.xpath(seletores.botaoContinuarComprando).click()
    cy.xpath(seletores.tituloModalAdicionado).should('not.be.visible')
  })
}

module.exports = {
  validarListagemDeProdutos,
  abrirDetalhesDoPrimeiroProduto,
  validarDetalhesDoProduto,
  pesquisarProduto,
  validarResultadoDaPesquisa,
  adicionarProdutosAoCarrinho
}
