import { ESTADOS } from "../data/estados"
import { formatoFecha } from "../utils/formatoFecha"
import AlcanceSismo from "./AlcanceSismo"
import CambioEstado from "./CambioEstado"
import ClasificacionSismo from "./ClasificacionSismo"
import Empleado from "./Empleado"
import Estado from "./Estado"
import MagnitudRichter from "./MagnitudRichter"
import OrigenDeGeneracion from "./OrigenDeGeneracion"
import SerieTemporal from "./SerieTemporal"

export default class EventoSismico {
  private static contador = 1

  private id: string
  private fechaHoraOcurriencia: Date
  private latitudEpicentro: number
  private latitudHipocentro: number
  private longitudEpicentro: number
  private longitudHipocentro: number
  private profundidad: number
  private valorMagnitud: number
  private magnitud: MagnitudRichter
  private cambioEstado: CambioEstado[] = []
  private clasificacionSismo: ClasificacionSismo
  private origenDeGeneracion: OrigenDeGeneracion
  private serieTemporal: SerieTemporal[]
  // private alcance: AlcanceSismo

  constructor(
    fechaHoraOcurriencia: Date,
    latitudEpicentro: number,
    latitudHipocentro: number,
    longitudEpicentro: number,
    longitudHipocentro: number,
    valorMagnitud: number,
    profundidad: number,
    origenDeGeneracion: OrigenDeGeneracion,
    serieTemporal: SerieTemporal[]
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
    this.profundidad = profundidad
    this.origenDeGeneracion = origenDeGeneracion
    this.serieTemporal = serieTemporal

    // RN: Si luego del procesamiento con machine learning de los datos sísmicos se estima una
    // magnitud mayor o igual a 4.0 en la escala Richter, el sistema debe registrar
    // automáticamente el evento sísmico como auto confirmado, de lo contrario debe
    // registrarlo como auto detectado.
    const estado = valorMagnitud >= 4.0 ? ESTADOS.auto_confirmado : ESTADOS.auto_detectado

    const estadoInicial = new CambioEstado(
      estado,
      new Date(),
      null,
      null
    )

    this.cambioEstado = [estadoInicial]

    this.magnitud = MagnitudRichter.setMagnitudRichter(valorMagnitud)
    this.clasificacionSismo = ClasificacionSismo.setClasificacionSismo(profundidad)
    // this.alcance = AlcanceSismo.setAlcance(ubicacionES, this.getEpicentro())
  }

  getId() {
    return this.id
  }

  getFechaHoraOcurriencia() {
    return this.fechaHoraOcurriencia
  }

  getUbicacion() {
    return {
      latitudEpicentro: this.latitudEpicentro,
      latitudHipocentro: this.latitudHipocentro,
      longitudEpicentro: this.longitudEpicentro,
      longitudHipocentro: this.longitudHipocentro
    }
  }

  getEpicentro() {
    return {
      latitud: this.latitudEpicentro,
      longitud: this.longitudEpicentro
    }
  }

  // TODO: Alcance
  getUbicacionES() {

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

  getValorMagnitud() {
    return this.valorMagnitud
  }

  getMagnitud() {
    return this.magnitud
  }

  getProfundidad() {
    return this.profundidad
  }

  getClasificacionSismo(): ClasificacionSismo {
    return this.clasificacionSismo
  }

  getOrigenDeGeneracion(): OrigenDeGeneracion {
    return this.origenDeGeneracion
  }

  getEstadoActual(): Estado {
    const actual = this.cambioEstado.find(evento => evento.esEstadoActual())
    if (!actual) throw new Error("No hay estado")
    return actual?.getEstado() // Devuelve la instancia de Estado activa
  }

  getHistorialEstados(): CambioEstado[] {
    return this.cambioEstado
  }

  getHistorialEstadosFormateado() {
    return this.cambioEstado.map((estado) => ({
      estado: estado.getEstado(),
      fechaHoraInicio: estado.getFechaHoraInicio().toLocaleString("es-AR", formatoFecha).replace(',', ' -'),
      fechaHoraFin: estado.getFechaHoraFin()?.toLocaleString("es-AR", formatoFecha).replace(',', ' -') ?? null,
      empleado: estado.getEmpleadoResponsable() ?? null
    }))
  }

  getSerieTempora(): SerieTemporal[] {
    return this.serieTemporal
  }

  getSeriesTemporalesFormateado(): any[] {
    return this.serieTemporal.map((serie) => serie.getDatos())
  }

  cambiarEstadoA(nuevoEstado: Estado, empleado: Empleado | null = null) {
    const fechaHoraActual = new Date()

    // Si es estado actual lo finaliza (setea la fecha hora actual como fecha hora fin)
    const estadoActual = this.cambioEstado.find((evento) => evento.esEstadoActual())
    if (estadoActual) {
      estadoActual.setFechaHoraFin(fechaHoraActual)
    }

    // Genera una nueva instancia de CambioEstado y agrega el nuevo estado a la lista
    const cambioEstado = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado)
    this.cambioEstado.push(cambioEstado)

  }

  actualizarAPendienteRevision(fechaActual: Date) {
    const haceCuanto = fechaActual.getTime() - this.getFechaHoraOcurriencia().getTime()
    const cincoMinutos = 5 * 60 * 1000

    // Si pasan 5min cambia el estado a "pendiente_de_revision"
    if (this.getEstadoActual().esAutoDetectado() && haceCuanto >= cincoMinutos) {
      // Al empleado le pasamos null porque lo hace el sistema automaticamente 
      this.cambiarEstadoA(ESTADOS.pendiente_de_revision, null)
    }
  }
}
