const seletores = {
  rodape: '//footer[@id="footer"]',
  tituloInscricao: '//footer[@id="footer"]//div[@class="single-widget"]/h2',
  email: '//input[@id="susbscribe_email"]',
  botaoInscrever: '//button[@id="subscribe"]',
  mensagemSucesso: '//div[@id="success-subscribe"]/div[contains(@class, "alert-success")]'
}

function inscreverNaNewsletter(email) {
  cy.xpath(seletores.rodape).scrollIntoView()
  cy.xpath(seletores.tituloInscricao).should('be.visible').and('have.text', 'Subscription')
  cy.xpath(seletores.email).type(email)
  cy.xpath(seletores.botaoInscrever).click()
}

function validarInscricaoRealizada() {
  cy.xpath(seletores.mensagemSucesso)
    .should('be.visible')
    .and('have.text', 'You have been successfully subscribed!')
}

module.exports = {
  inscreverNaNewsletter,
  validarInscricaoRealizada
}
