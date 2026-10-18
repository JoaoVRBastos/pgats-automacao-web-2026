const seletores = {
  titulo: '.contact-form h2.title',
  nome: '[data-qa="name"]',
  email: '[data-qa="email"]',
  assunto: '[data-qa="subject"]',
  mensagem: '[data-qa="message"]',
  arquivo: 'input[name="upload_file"]',
  botaoEnviar: '[data-qa="submit-button"]',
  mensagemSucesso: '.contact-form .status.alert-success',
  botaoVoltarInicio: '#form-section a.btn-success'
}

function enviarMensagemDeContato(contato, arquivo) {
  cy.get(seletores.titulo).should('be.visible').and('have.text', 'Get In Touch')
  cy.get(seletores.nome).type(contato.nome)
  cy.get(seletores.email).type(contato.email)
  cy.get(seletores.assunto).type(contato.assunto)
  cy.get(seletores.mensagem).type(contato.mensagem)
  cy.get(seletores.arquivo).selectFile(arquivo)

  cy.on('window:confirm', (texto) => {
    expect(texto).to.eq('Press OK to proceed!')
    return true
  })
  cy.get(seletores.botaoEnviar).click()
}

function validarMensagemEnviada() {
  cy.get(seletores.mensagemSucesso)
    .should('be.visible')
    .and('have.text', 'Success! Your details have been submitted successfully.')
}

function voltarParaPaginaInicial() {
  cy.get(seletores.botaoVoltarInicio).click()
}

module.exports = {
  enviarMensagemDeContato,
  validarMensagemEnviada,
  voltarParaPaginaInicial
}
