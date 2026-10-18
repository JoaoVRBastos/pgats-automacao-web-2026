// Comandos de apoio que usam a API pública do Automation Exercise
// (https://automationexercise.com/api_list) para preparar e limpar a massa de dados.
// Assim, apenas o comportamento que está sendo testado passa pela interface.

Cypress.Commands.add('criarContaViaApi', (usuario) => {
  cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    body: {
      name: usuario.nome,
      email: usuario.email,
      password: usuario.senha,
      title: usuario.tratamento,
      birth_date: usuario.nascimento.dia,
      birth_month: usuario.nascimento.mes,
      birth_year: usuario.nascimento.ano,
      firstname: usuario.primeiroNome,
      lastname: usuario.sobrenome,
      company: usuario.empresa,
      address1: usuario.endereco,
      address2: usuario.complemento,
      country: usuario.pais,
      zipcode: usuario.cep,
      state: usuario.estado,
      city: usuario.cidade,
      mobile_number: usuario.celular
    }
  })
    .its('body')
    // A API responde JSON com content-type text/html, então o corpo chega como texto
    .then((body) => (typeof body === 'string' ? JSON.parse(body) : body))
    .its('responseCode')
    .should('eq', 201)
})

Cypress.Commands.add('excluirContaViaApi', (usuario) => {
  // A conta pode já ter sido excluída pela própria interface, então a resposta não é validada
  cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',
    form: true,
    body: { email: usuario.email, password: usuario.senha },
    failOnStatusCode: false
  })
})
