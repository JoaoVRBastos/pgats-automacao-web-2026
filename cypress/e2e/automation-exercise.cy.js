/// <reference types="cypress" />
import navegacao from '../modules/navegacao'
import cadastro from '../modules/cadastro'
import login from '../modules/login'
import contato from '../modules/contato'
import produtos from '../modules/produtos'
import inscricao from '../modules/inscricao'
import pedido from '../modules/pedido'
import { gerarUsuario, gerarMensagemDeContato, gerarEmail } from '../support/dados'
import dadosDoPedido from '../fixtures/pedido.json'

describe('Automation Exercise', () => {
  let usuario

  beforeEach(() => {
    usuario = gerarUsuario()
    navegacao.acessarPaginaInicial()
  })

  afterEach(() => {
    cy.excluirContaViaApi(usuario)
  })

  context('Cadastro e autenticação', () => {
    it('Caso de Teste 01: Registrar usuário', () => {
      navegacao.acessarLoginECadastro()
      cadastro.cadastrarUsuario(usuario)
      login.validarUsuarioAutenticado(usuario.nome)
      cadastro.excluirConta()
    })

    it('Caso de Teste 02: Login com e-mail e senha corretos', () => {
      cy.criarContaViaApi(usuario)

      navegacao.acessarLoginECadastro()
      login.efetuarLogin(usuario.email, usuario.senha)
      login.validarUsuarioAutenticado(usuario.nome)
      cadastro.excluirConta()
    })

    it('Caso de Teste 03: Login com e-mail e senha incorretos', () => {
      navegacao.acessarLoginECadastro()
      login.efetuarLogin(usuario.email, usuario.senha)
      login.validarMensagemCredenciaisInvalidas()
    })

    it('Caso de Teste 04: Deslogar usuário', () => {
      cy.criarContaViaApi(usuario)

      navegacao.acessarLoginECadastro()
      login.efetuarLogin(usuario.email, usuario.senha)
      login.validarUsuarioAutenticado(usuario.nome)
      login.efetuarLogout()
      login.validarPaginaDeLoginVisivel()
    })

    it('Caso de Teste 05: Registrar usuário com e-mail já existente', () => {
      cy.criarContaViaApi(usuario)

      navegacao.acessarLoginECadastro()
      cadastro.iniciarCadastro(usuario.nome, usuario.email)
      cadastro.validarMensagemEmailExistente()
    })
  })

  context('Contato e inscrição', () => {
    it('Caso de Teste 06: Formulário de contato', () => {
      navegacao.acessarContato()
      contato.enviarMensagemDeContato(gerarMensagemDeContato(), 'cypress/fixtures/anexo-contato.txt')
      contato.validarMensagemEnviada()
      contato.voltarParaPaginaInicial()
      navegacao.validarPaginaInicialVisivel()
    })

    it('Caso de Teste 10: Verificar inscrição na página inicial', () => {
      inscricao.inscreverNaNewsletter(gerarEmail())
      inscricao.validarInscricaoRealizada()
    })
  })

  context('Produtos', () => {
    it('Caso de Teste 08: Verificar todos os produtos e a página de detalhes', () => {
      navegacao.acessarProdutos()
      produtos.validarListagemDeProdutos()
      produtos.abrirDetalhesDoPrimeiroProduto()
      produtos.validarDetalhesDoProduto()
    })

    it('Caso de Teste 09: Pesquisar produto', () => {
      navegacao.acessarProdutos()
      produtos.validarListagemDeProdutos()
      produtos.pesquisarProduto('Jeans')
      produtos.validarResultadoDaPesquisa('Jeans')
    })
  })

  context('Pedido', () => {
    it('Caso de Teste 15: Fazer pedido registrando-se antes do checkout', () => {
      navegacao.acessarLoginECadastro()
      cadastro.cadastrarUsuario(usuario)
      login.validarUsuarioAutenticado(usuario.nome)

      produtos.adicionarProdutosAoCarrinho(dadosDoPedido.produtos)
      navegacao.acessarCarrinho()
      pedido.validarProdutosNoCarrinho(dadosDoPedido.produtos)
      pedido.prosseguirParaCheckout()
      pedido.validarRevisaoDoPedido(usuario, dadosDoPedido.produtos.length)
      pedido.fazerPedido(dadosDoPedido.comentario, dadosDoPedido.cartao)
      pedido.validarPedidoConfirmado()
      cadastro.excluirConta()
    })

    it('Caso de Teste 16: Fazer pedido efetuando login antes do checkout', () => {
      cy.criarContaViaApi(usuario)

      navegacao.acessarLoginECadastro()
      login.efetuarLogin(usuario.email, usuario.senha)
      login.validarUsuarioAutenticado(usuario.nome)

      produtos.adicionarProdutosAoCarrinho(dadosDoPedido.produtos)
      navegacao.acessarCarrinho()
      pedido.validarProdutosNoCarrinho(dadosDoPedido.produtos)
      pedido.prosseguirParaCheckout()
      pedido.validarRevisaoDoPedido(usuario, dadosDoPedido.produtos.length)
      pedido.fazerPedido(dadosDoPedido.comentario, dadosDoPedido.cartao)
      pedido.validarPedidoConfirmado()
      cadastro.excluirConta()
    })
  })
})
