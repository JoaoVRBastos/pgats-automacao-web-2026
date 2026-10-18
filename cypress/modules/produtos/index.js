const seletores = {
  tituloListagem: '.features_items h2.title',
  cardsDeProduto: '.features_items .product-image-wrapper',
  nomeDoProdutoNoCard: '.productinfo p',
  primeiroVerProduto: '.features_items .choose a[href^="/product_details/"]',
  campoPesquisa: '#search_product',
  botaoPesquisar: '#submit_search',
  detalhes: '.product-information',
  nomeDoProduto: '.product-information h2',
  adicionarAoCarrinho: (idProduto) => `.features_items .productinfo a.add-to-cart[data-product-id="${idProduto}"]`,
  tituloModalAdicionado: '#cartModal .modal-title',
  botaoContinuarComprando: '#cartModal button.close-modal'
}

function validarListagemDeProdutos(titulo = 'All Products') {
  cy.location('pathname').should('eq', '/products')
  cy.get(seletores.tituloListagem).should('be.visible').and('have.text', titulo)
  cy.get(seletores.cardsDeProduto).should('have.length.greaterThan', 0)
}

function abrirDetalhesDoPrimeiroProduto() {
  cy.get(seletores.primeiroVerProduto).first().click()
}

function validarDetalhesDoProduto() {
  cy.location('pathname').should('match', /^\/product_details\/\d+$/)
  cy.get(seletores.nomeDoProduto).should('be.visible').and('not.be.empty')
  cy.get(seletores.detalhes)
    .should('contain.text', 'Category:')
    .and('contain.text', 'Rs.')
    .and('contain.text', 'Availability:')
    .and('contain.text', 'Condition:')
    .and('contain.text', 'Brand:')
}

function pesquisarProduto(termo) {
  cy.get(seletores.campoPesquisa).type(termo)
  cy.get(seletores.botaoPesquisar).click()
}

function validarResultadoDaPesquisa(termo) {
  cy.get(seletores.tituloListagem).should('be.visible').and('have.text', 'Searched Products')
  cy.get(seletores.cardsDeProduto)
    .should('have.length.greaterThan', 0)
    .find(seletores.nomeDoProdutoNoCard)
    .each(($nome) => {
      expect($nome.text().toLowerCase()).to.contain(termo.toLowerCase())
    })
}

function adicionarProdutosAoCarrinho(idsProdutos) {
  idsProdutos.forEach((idProduto) => {
    cy.get(seletores.adicionarAoCarrinho(idProduto)).click()
    cy.get(seletores.tituloModalAdicionado).should('be.visible').and('have.text', 'Added!')
    cy.get(seletores.botaoContinuarComprando).click()
    cy.get(seletores.tituloModalAdicionado).should('not.be.visible')
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
