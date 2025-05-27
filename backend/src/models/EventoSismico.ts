import Estado from "./Estado"

export default class EventoSismico {
  private static contador = 1

  private id: string
  private fechaHoraOcurriencia: Date
  private latitudEpicentro: number
  private latitudHipocentro: number
  private longitudEpicentro: number
  private longitudHipocentro: number
  private valorMagnitud: number
  private estado: Estado

  constructor(
    fechaHoraOcurriencia: Date,
    latitudEpicentro: number,
    latitudHipocentro: number,
    longitudEpicentro: number,
    longitudHipocentro: number,
    valorMagnitud: number,
    estado: Estado
  ) {
    // Generar id (formato: ES-001-{añoActual})
    const añoActual = new Date().getFullYear()
    this.id = `ES-${EventoSismico.contador.toString().padStart(3, '0')}-${añoActual}`
    EventoSismico.contador++

    this.fechaHoraOcurriencia = fechaHoraOcurriencia
    this.latitudEpicentro = latitudEpicentro
    this.latitudHipocentro = latitudHipocentro
    this.longitudEpicentro = longitudEpicentro
    this.longitudHipocentro = longitudHipocentro
    this.valorMagnitud = valorMagnitud
    this.estado = estado
  }

  getId() {
    return this.id
  }

  getFechaHoraOcurriencia() {
    return this.fechaHoraOcurriencia
  }

  getUbicacion() {
    return {
      latitudEpicentro: this.getLatitudEpicentro(),
      latitudHipocentro: this.getLatitudHipocentro(),
      longitudEpicentro: this.getLongitudEpicentro(),
      longitudHipocentro: this.getLongitudHipocentro()
    }
  }

  getLatitudEpicentro() {
    return this.latitudEpicentro
  }

  getLatitudHipocentro() {
    return this.latitudHipocentro
  }

  getLongitudEpicentro() {
    return this.longitudEpicentro
  }

  getLongitudHipocentro() {
    return this.longitudHipocentro
  }

  getMagnitud() {
    return this.valorMagnitud
  }

  getEstado(): Estado {
    return this.estado
  }

  setEstado(estado: Estado) {
    this.estado = estado
  }
}
