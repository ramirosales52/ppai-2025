import TipoDeDato from "./TipoDeDato"

export default class DetalleMuestraSismica {
  private valor: number
  private tipoDeDato: TipoDeDato

  constructor(
    valor: number,
    tipoDeDato: TipoDeDato
  ) {
    this.valor = valor
    this.tipoDeDato = tipoDeDato
  }

  getDatos() {
    return {
      tipoDeDato: this.tipoDeDato,
      valor: this.valor
    }
  }
}
