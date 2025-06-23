import { eventosSismicos } from "../data/data"
import { ESTADOS } from "../data/estados"
import AlcanceSismo from "./AlcanceSismo"
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
  private fechaHoraOcurrencia: Date
  private latitudEpicentro: number
  private latitudHipocentro: number
  private longitudEpicentro: number
  private longitudHipocentro: number
  private profundidad: number
  private valorMagnitud: number
  private estadoActual: Estado
  private magnitud: MagnitudRichter
  private cambioEstado: CambioEstado[] = []
  private clasificacionSismo: ClasificacionSismo
  private origenDeGeneracion: OrigenDeGeneracion
  private serieTemporal: SerieTemporal[]
  private alcance: AlcanceSismo


  constructor(
    fechaHoraOcurrencia: Date,
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

    this.fechaHoraOcurrencia = fechaHoraOcurrencia
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
    this.estadoActual = estadoInicial.getEstado()

    this.magnitud = MagnitudRichter.setMagnitudRichter(valorMagnitud)
    this.clasificacionSismo = ClasificacionSismo.setClasificacionSismo(profundidad)

    this.alcance = AlcanceSismo.setAlcance()
  }


  /** Paso 5 – Consulta directa desde Gestor */
  public esAutodetectado(): boolean {
    // Paso 6 – Delegación a Estado
    return this.estadoActual.esAutoDetectado();
  }

  /** Paso 7 – Consulta directa desde Gestor */
  public esPendienteDeRevision(): boolean {
    // Paso 8 – Delegación a Estado
    return this.estadoActual.esPendienteDeRevision();
  }

  /** Paso 9 – DTO con los campos principales */
  getDatosPrincipales() {
    return {
      id: this.getId(),
      fechaHoraOcurrencia: this.getFechaHoraOcurrencia(),
      latitudEpicentro: this.getLatitudEpicentro(),
      latitudHipocentro: this.getLatitudHipocentro(),
      longitudEpicentro: this.getLongitudEpicentro(),
      longitudHipocentro: this.getLongitudHipocentro(),
      valorMagnitud: this.getValorMagnitud(),
      estadoActual: this.getEstadoActual(),
      cambioEstado: this.getCambioEstado()
    }
  }

  // Métodos de acceso individuales (pasos 10–15)
  getId() {
    return this.id
  }
  getFechaHoraOcurrencia() {
    return this.fechaHoraOcurrencia
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
  getEstadoActual(): Estado {
    return this.estadoActual
  }
  getCambioEstado(): CambioEstado[] {
    return this.cambioEstado
  }

  // Paso 28 - bloquear este evento
  bloquear(fechaActual: Date, empleado: Empleado, estadoBloqueado: Estado) {
    // Paso 29 - busca el ultimo cambio de estado
    const ultimoCambio = this.buscarUltimoCambioEstado();

    if (ultimoCambio) {
      // Paso 30 - verificar si es actual
      if (ultimoCambio.esEstadoActual()) {
        // Paso 31 - si es actual, lo finaliza
        ultimoCambio.setFechaHoraFin(fechaActual);
      }
    }
    const nuevoCambio = this.crearCambioEstado(fechaActual, empleado, estadoBloqueado);

    // Se añade el nuevo cambio al historial
    this.cambioEstado.push(nuevoCambio);
    // Se actualiza el puntero al estado actual del evento
    this.estadoActual = nuevoCambio.getEstado();
    console.log(this.estadoActual)
  }

  private buscarUltimoCambioEstado(): CambioEstado | undefined {
    if (this.cambioEstado.length === 0) {
      return undefined;
    }
    return this.cambioEstado[this.cambioEstado.length - 1];
  }

  // Paso 32/69 - crear el cambio de estado
  private crearCambioEstado(fechaInicio: Date, empleado: Empleado | null, estado: Estado): CambioEstado {

    // Paso 33/70 - new()
    const nuevoCambio = new CambioEstado(
      estado,
      fechaInicio,
      null, // La fecha de fin es null porque es el nuevo estado actual
      empleado
    );

    // El Paso 34 - setEstado() se interpreta como la acción de asignar este nuevo
    // estado como el actual, lo cual se hace en el método `bloquear`.
    return nuevoCambio;
  }

  getEpicentro() {
    return {
      latitud: this.latitudEpicentro,
      longitud: this.longitudEpicentro
    }
  }

  getAlcance() {
    return this.alcance
  }
  getMagnitud() {
    return this.magnitud
  }
  getClasificacionSismo(): ClasificacionSismo {
    return this.clasificacionSismo
  }
  getOrigenDeGeneracion(): OrigenDeGeneracion {
    return this.origenDeGeneracion
  }
  getSerieTemporal(): SerieTemporal[] {
    return this.serieTemporal
  }


  cambiarEstadoA(nuevoEstado: Estado, empleado: Empleado | null = null) {
    const fechaHoraActual = new Date()

    // Si es estado actual lo finaliza (setea la fecha hora actual como fecha hora fin)
    const estadoActual = this.cambioEstado.find((estado) => estado.esEstadoActual())
    if (estadoActual) {
      estadoActual.setFechaHoraFin(fechaHoraActual)
    }

    // Genera una nueva instancia de CambioEstado y agrega el nuevo estado a la lista
    const cambioEstado = new CambioEstado(nuevoEstado, fechaHoraActual, null, empleado)
    this.cambioEstado.push(cambioEstado)

  }

  actualizarAPendienteRevision(fechaActual: Date) {
    const haceCuanto = fechaActual.getTime() - this.fechaHoraOcurrencia.getTime()
    const cincoMinutos = 5 * 60 * 1000

    // Si pasan 5min cambia el estado a "pendiente_de_revision"
    if (this.getEstadoActual().esAutoDetectado() && haceCuanto >= cincoMinutos) {

      const ultimoCambio = this.buscarUltimoCambioEstado();

      // Finaliza el estado actual
      if (ultimoCambio) {
        if (ultimoCambio.esEstadoActual()) {
          ultimoCambio.setFechaHoraFin(fechaActual);
        }
      }

      // Al empleado le pasamos null porque lo hace el sistema automaticamente
      const nuevoCambio = this.crearCambioEstado(fechaActual, null, ESTADOS.pendiente_de_revision);

      // Se añade el nuevo cambio al historial
      this.cambioEstado.push(nuevoCambio);
      // Se actualiza el puntero al estado actual del evento
      this.estadoActual = nuevoCambio.getEstado();
    }

  }

  // FIX: REVISAR
  clasificarPorEstacion() {
    // WARN: esto trae el sismografo tambien y no hace falta
    const seriesPorEstacion: SeriesPorEstacion[] = []

    for (const evento of eventosSismicos) {
      for (const serie of evento.serieTemporal) {
        // Ordenar muestras sismicas por fechaHoraMuestra
        // TODO: tiene que haber un metodo aparte que ordene?
        serie.getDatos().muestrasSismicas.sort((a, b) =>
          a.getDatos().fechaHoraMuestra.getTime() - b.getDatos().fechaHoraMuestra.getTime()
        )

        const estacion = serie.getSismografo().getEstacionSismologica() // Obtiene la estacion de esa SerieTemporal
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
