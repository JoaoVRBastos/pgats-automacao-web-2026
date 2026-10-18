const seletores = {
  titulo: '//div[@class="contact-form"]/h2[contains(@class, "title")]',
  nome: '//input[@data-qa="name"]',
  email: '//input[@data-qa="email"]',
  assunto: '//input[@data-qa="subject"]',
  mensagem: '//textarea[@data-qa="message"]',
  arquivo: '//input[@type="file"][@name="upload_file"]',
  botaoEnviar: '//input[@data-qa="submit-button"]',
  mensagemSucesso: '//div[@class="contact-form"]/div[contains(@class, "status")]',
  botaoVoltarInicio: '//div[@id="form-section"]/a[contains(., "Home")]'
}

function enviarMensagemDeContato(contato, arquivo) {
  cy.xpath(seletores.titulo).should('be.visible').and('have.text', 'Get In Touch')
  cy.xpath(seletores.nome).type(contato.nome)
  cy.xpath(seletores.email).type(contato.email)
  cy.xpath(seletores.assunto).type(contato.assunto)
  cy.xpath(seletores.mensagem).type(contato.mensagem)
  cy.xpath(seletores.arquivo).selectFile(arquivo)

  cy.on('window:confirm', (texto) => {
    expect(texto).to.eq('Press OK to proceed!')
    return true
  })
  cy.xpath(seletores.botaoEnviar).click()
}

function validarMensagemEnviada() {
  cy.xpath(seletores.mensagemSucesso)
    .should('be.visible')
    .and('have.text', 'Success! Your details have been submitted successfully.')
}

function voltarParaPaginaInicial() {
  cy.xpath(seletores.botaoVoltarInicio).click()
}

module.exports = {
  enviarMensagemDeContato,
  validarMensagemEnviada,
  voltarParaPaginaInicial
}
