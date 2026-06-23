export default class BaseStorage {
  constructor(chave, dadosPadrao = []) {
    this.chave = chave;
    this.dadosPadrao = dadosPadrao;
    this.garantirDadosIniciais();
  }

  garantirDadosIniciais() {
    if (!localStorage.getItem(this.chave)) {
      localStorage.setItem(this.chave, JSON.stringify(this.dadosPadrao));
    }
  }

  listar() {
    return JSON.parse(localStorage.getItem(this.chave)) || [];
  }

  salvarTodos(dados) {
    localStorage.setItem(this.chave, JSON.stringify(dados));
  }

  cadastrar(item) {
    const dados = this.listar();
    item.id = Date.now();
    dados.push(item);
    this.salvarTodos(dados);
  }

  atualizar(id, novosDados) {
    const dados = this.listar().map(item =>
      item.id === id ? { ...item, ...novosDados } : item
    );
    this.salvarTodos(dados);
  }

  excluir(id) {
    const dados = this.listar().filter(item => item.id !== id);
    this.salvarTodos(dados);
  }

  buscarPorId(id) {
    return this.listar().find(item => item.id === id);
  }
}
