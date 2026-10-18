const seletores = {
  linhasDoCarrinho: '//table[@id="cart_info_table"]/tbody/tr[starts-with(@id, "product-")]',
  linhaDoProduto: (idProduto) => `//table[@id="cart_info_table"]//tr[@id="product-${idProduto}"]`,
  botaoProsseguirCheckout: '//a[normalize-space()="Proceed To Checkout"]',
  enderecoEntrega: '//ul[@id="address_delivery"]',
  enderecoCobranca: '//ul[@id="address_invoice"]',
  // Caminho relativo (.//) aplicado sobre o endereço já encontrado
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

function validarProdutosNoCarrinho(idsProdutos) {
  cy.location('pathname').should('eq', '/view_cart')
  cy.xpath(seletores.linhasDoCarrinho).should('have.length', idsProdutos.length)
  idsProdutos.forEach((idProduto) => {
    cy.xpath(seletores.linhaDoProduto(idProduto)).should('be.visible')
  })
}

function prosseguirParaCheckout() {
  cy.xpath(seletores.botaoProsseguirCheckout).click()
}

function validarRevisaoDoPedido(usuario, quantidadeDeProdutos) {
  const nomeCompleto = `${usuario.tratamento}. ${usuario.primeiroNome} ${usuario.sobrenome}`

  cy.location('pathname').should('eq', '/checkout')
  ;[seletores.enderecoEntrega, seletores.enderecoCobranca].forEach((endereco) => {
    cy.xpath(endereco).xpath(seletores.nomeNoEndereco).should('have.text', nomeCompleto)
    cy.xpath(endereco)
      .should('contain.text', usuario.empresa)
      .and('contain.text', usuario.endereco)
      .and('contain.text', usuario.cidade)
      .and('contain.text', usuario.estado)
      .and('contain.text', usuario.cep)
      .and('contain.text', usuario.pais)
      .and('contain.text', usuario.celular)
  })
  cy.xpath(seletores.linhasDoPedido).should('have.length', quantidadeDeProdutos)
}

function fazerPedido(comentario, cartao) {
  cy.xpath(seletores.comentario).type(comentario)
  cy.xpath(seletores.botaoFazerPedido).click()
  cy.xpath(seletores.nomeNoCartao).type(cartao.nome)
  cy.xpath(seletores.numeroDoCartao).type(cartao.numero)
  cy.xpath(seletores.cvc).type(cartao.cvc)
  cy.xpath(seletores.mesDeValidade).type(cartao.mesValidade)
  cy.xpath(seletores.anoDeValidade).type(cartao.anoValidade)
  cy.xpath(seletores.botaoPagar).click()
}

function validarPedidoConfirmado() {
  cy.location('pathname').should('match', /^\/payment_done\//)
  cy.xpath(seletores.tituloPedidoConfirmado).should('be.visible').and('have.text', 'Order Placed!')
  cy.xpath(seletores.mensagemPedidoConfirmado).should('have.text', 'Congratulations! Your order has been confirmed!')
}

module.exports = {
  validarProdutosNoCarrinho,
  prosseguirParaCheckout,
  validarRevisaoDoPedido,
  fazerPedido,
  validarPedidoConfirmado
}
