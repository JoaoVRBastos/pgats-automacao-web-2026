const seletores = {
  linhasDoCarrinho: '#cart_info_table tbody tr[id^="product-"]',
  linhaDoProduto: (idProduto) => `#cart_info_table tr#product-${idProduto}`,
  botaoProsseguirCheckout: '#do_action a.check_out',
  enderecoEntrega: '#address_delivery',
  enderecoCobranca: '#address_invoice',
  nomeNoEndereco: '.address_firstname',
  linhasDoPedido: '#cart_info tbody tr[id^="product-"]',
  comentario: 'textarea[name="message"]',
  botaoFazerPedido: 'a.check_out[href="/payment"]',
  nomeNoCartao: '[data-qa="name-on-card"]',
  numeroDoCartao: '[data-qa="card-number"]',
  cvc: '[data-qa="cvc"]',
  mesDeValidade: '[data-qa="expiry-month"]',
  anoDeValidade: '[data-qa="expiry-year"]',
  botaoPagar: '[data-qa="pay-button"]',
  tituloPedidoConfirmado: '[data-qa="order-placed"]',
  mensagemPedidoConfirmado: '[data-qa="order-placed"] + p'
}

function validarProdutosNoCarrinho(idsProdutos) {
  cy.location('pathname').should('eq', '/view_cart')
  cy.get(seletores.linhasDoCarrinho).should('have.length', idsProdutos.length)
  idsProdutos.forEach((idProduto) => {
    cy.get(seletores.linhaDoProduto(idProduto)).should('be.visible')
  })
}

function prosseguirParaCheckout() {
  cy.get(seletores.botaoProsseguirCheckout).click()
}

function validarRevisaoDoPedido(usuario, quantidadeDeProdutos) {
  const nomeCompleto = `${usuario.tratamento}. ${usuario.primeiroNome} ${usuario.sobrenome}`

  cy.location('pathname').should('eq', '/checkout')
  ;[seletores.enderecoEntrega, seletores.enderecoCobranca].forEach((endereco) => {
    cy.get(endereco).find(seletores.nomeNoEndereco).should('have.text', nomeCompleto)
    cy.get(endereco)
      .should('contain.text', usuario.empresa)
      .and('contain.text', usuario.endereco)
      .and('contain.text', usuario.cidade)
      .and('contain.text', usuario.estado)
      .and('contain.text', usuario.cep)
      .and('contain.text', usuario.pais)
      .and('contain.text', usuario.celular)
  })
  cy.get(seletores.linhasDoPedido).should('have.length', quantidadeDeProdutos)
}

function fazerPedido(comentario, cartao) {
  cy.get(seletores.comentario).type(comentario)
  cy.get(seletores.botaoFazerPedido).click()
  cy.get(seletores.nomeNoCartao).type(cartao.nome)
  cy.get(seletores.numeroDoCartao).type(cartao.numero)
  cy.get(seletores.cvc).type(cartao.cvc)
  cy.get(seletores.mesDeValidade).type(cartao.mesValidade)
  cy.get(seletores.anoDeValidade).type(cartao.anoValidade)
  cy.get(seletores.botaoPagar).click()
}

function validarPedidoConfirmado() {
  cy.location('pathname').should('match', /^\/payment_done\//)
  cy.get(seletores.tituloPedidoConfirmado).should('be.visible').and('have.text', 'Order Placed!')
  cy.get(seletores.mensagemPedidoConfirmado).should('have.text', 'Congratulations! Your order has been confirmed!')
}

module.exports = {
  validarProdutosNoCarrinho,
  prosseguirParaCheckout,
  validarRevisaoDoPedido,
  fazerPedido,
  validarPedidoConfirmado
}
