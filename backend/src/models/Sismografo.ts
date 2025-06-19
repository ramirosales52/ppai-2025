import EstacionSismologica from "./EstacionSismologica"
import Estado from "./Estado"

export default class Sismografo {
  private fechaAdquisicion: Date
  private identificadorSismografo: string
  private nroSerie: number
  private estadoActual: Estado
  private estacionSismologica: EstacionSismologica

  constructor(
    fechaAdquisicion: Date,
    identificadorSismografo: string,
    nroSerie: number,
    estadoActual: Estado,
    estacionSismologica: EstacionSismologica,
  ) {
    this.fechaAdquisicion = fechaAdquisicion
    this.identificadorSismografo = identificadorSismografo
    this.nroSerie = nroSerie
    this.estadoActual = estadoActual
    this.estacionSismologica = estacionSismologica
  }

  getEstacionSismologica(): EstacionSismologica {
    return this.estacionSismologica
  }

  getDatos() {
    return {
      fechaAdquisicion: this.fechaAdquisicion,
      identificadorSismografo: this.identificadorSismografo,
      nroSerie: this.nroSerie,
      estadoActual: this.estadoActual,
      estacionSismologica: this.estacionSismologica
    }
  }
}
