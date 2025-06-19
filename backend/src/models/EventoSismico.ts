import { eventosSismicos } from "../data/data"
import { ESTADOS } from "../data/estados"
import { SERIES_TEMPORALES } from "../data/seriesTemporales"
import CambioEstado from "./CambioEstado"
import ClasificacionSismo from "./ClasificacionSismo"
import Empleado from "./Empleado"
import EstacionSismologica from "./EstacionSismologica"
import Estado from "./Estado"
import MagnitudRichter from "./MagnitudRichter"
import OrigenDeGeneracion from "./OrigenDeGeneracion"
import SerieTemporal from "./SerieTemporal"

type SeriesPorEstacion = {
  estacion: EstacionSismologica;
  series: SerieTemporal[];
};

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
  // private alcances: { estacion: EstacionSismologica, alcance: AlcanceSismo }[]


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

  // getAlcances() {
  //   return this.alcances
  // }

  getEstadoActual(): Estado {
    const actual = this.cambioEstado.find(evento => evento.esEstadoActual())
    if (!actual) throw new Error("No hay estado")
    return actual?.getEstado() // Devuelve la instancia de Estado activa
  }

  getHistorialEstados(): CambioEstado[] {
    return this.cambioEstado
  }

  getSerieTemporal(): SerieTemporal[] {
    return this.serieTemporal
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

  getSeriesPorEstacion() {
    const seriesPorEstacion: SeriesPorEstacion[] = []

    for (const evento of eventosSismicos) {
      for (const serie of evento.serieTemporal) {
        // Ordenar muestras sismicas por fechaHoraMuestra
        serie.getDatos().muestrasSismicas.sort((a, b) =>
          a.getDatos().fechaHoraMuestra.getTime() - b.getDatos().fechaHoraMuestra.getTime()
        )

        const estacion = serie.getSismografo().getEstacionSismologica()
        const existente = seriesPorEstacion.find(e => e.estacion.getCodigoEstacion() === estacion.getCodigoEstacion())

        if (existente) {
          existente.series.push(serie)
        } else {
          seriesPorEstacion.push({
            estacion,
            series: [serie]
          })
        }
      }
    }

    // Ordenar las series temporales por fechaHoraInicioRegistroMuestras
    for (const grupo of seriesPorEstacion) {
      grupo.series.sort((a, b) =>
        a.getFechaHoraInicioRegistroMuestras().getTime() -
        b.getFechaHoraInicioRegistroMuestras().getTime()
      )
    }

    return seriesPorEstacion
  }
}
