const seletores = {
  rodape: '#footer',
  tituloInscricao: '#footer .single-widget h2',
  email: '#susbscribe_email',
  botaoInscrever: '#subscribe',
  mensagemSucesso: '#success-subscribe .alert-success'
}

function inscreverNaNewsletter(email) {
  cy.get(seletores.rodape).scrollIntoView()
  cy.get(seletores.tituloInscricao).should('be.visible').and('have.text', 'Subscription')
  cy.get(seletores.email).type(email)
  cy.get(seletores.botaoInscrever).click()
}

function validarInscricaoRealizada() {
  cy.get(seletores.mensagemSucesso)
    .should('be.visible')
    .and('have.text', 'You have been successfully subscribed!')
}

module.exports = {
  inscreverNaNewsletter,
  validarInscricaoRealizada
}
