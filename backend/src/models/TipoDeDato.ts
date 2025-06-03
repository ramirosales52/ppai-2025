export default class TipoDeDato {
  private denominacion: string
  private nombreUnidadMedida: string
  private valorUmbral: number

  constructor(
    denominacion: string,
    nombreUnidadMedida: string,
    valorUmbral: number
  ) {
    this.denominacion = denominacion
    this.nombreUnidadMedida = nombreUnidadMedida
    this.valorUmbral = valorUmbral
  }

  getDenominacion() {
    return this.denominacion
  }

  getNombreUnidadMedida() {
    return this.nombreUnidadMedida
  }

  getValorUmbral() {
    return this.valorUmbral
  }
}
