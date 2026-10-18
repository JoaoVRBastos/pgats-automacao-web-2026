import { faker } from '@faker-js/faker'

const PAISES_DISPONIVEIS = ['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']

export function gerarUsuario() {
  const primeiroNome = faker.person.firstName()
  const sobrenome = faker.person.lastName()
  const nascimento = faker.date.birthdate({ mode: 'age', min: 18, max: 70 })

  return {
    nome: `${primeiroNome} ${sobrenome}`,
    email: `pgats-${faker.string.alphanumeric(10).toLowerCase()}@mail.com`,
    senha: faker.internet.password({ length: 10 }),
    tratamento: faker.helpers.arrayElement(['Mr', 'Mrs']),
    nascimento: {
      dia: String(nascimento.getDate()),
      mes: String(nascimento.getMonth() + 1),
      ano: String(nascimento.getFullYear())
    },
    primeiroNome,
    sobrenome,
    empresa: faker.company.name(),
    endereco: faker.location.streetAddress(),
    complemento: faker.location.secondaryAddress(),
    pais: faker.helpers.arrayElement(PAISES_DISPONIVEIS),
    estado: faker.location.state(),
    cidade: faker.location.city(),
    cep: faker.location.zipCode('#####'),
    celular: faker.string.numeric(11)
  }
}

export function gerarMensagemDeContato() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email({ provider: 'mail.com' }),
    assunto: faker.lorem.sentence({ min: 3, max: 6 }),
    mensagem: faker.lorem.paragraph()
  }
}

export function gerarEmail() {
  return `pgats-${faker.string.alphanumeric(10).toLowerCase()}@mail.com`
}
