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

    // RN: Si luego del procesamiento con machine learning de los datos sísmicos se estima una
    // magnitud mayor o igual a 4.0 en la escala Richter, el sistema debe registrar
    // automáticamente el evento sísmico como auto confirmado, de lo contrario debe
    // registrarlo como auto detectado.
    const estado = valorMagnitud >= 4.0 ? "auto_confirmado" : "auto_detectado"
    this.estado = new Estado(estado)
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

  actualizarEstado(fechaActual: Date) {
    const haceCuanto = fechaActual.getTime() - this.getFechaHoraOcurriencia().getTime()
    const cincoMinutos = 5 * 60 * 1000

    if (this.estado.esAutoDetectado() && haceCuanto >= cincoMinutos) {
      this.estado.cambiarAPendienteDeRevision()
    }
  }
}
