// Carregado automaticamente antes de cada spec.
import './commands'
import 'cypress-xpath'
import 'cypress-mochawesome-reporter/register'

// Scripts de terceiros do site (anúncios bloqueados) lançam erros que não pertencem à aplicação testada
Cypress.on('uncaught:exception', () => false)
