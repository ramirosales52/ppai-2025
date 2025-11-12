import { ESTADOS } from "../data/estados"
import AlcanceSismo from "./AlcanceSismo"
import CambioEstado from "./CambioEstado"
import ClasificacionSismo from "./ClasificacionSismo"
import Empleado from "./Empleado"
import EstacionSismologica from "./EstacionSismologica"
import Estado from "./Estado"
import OrigenDeGeneracion from "./OrigenDeGeneracion"
import SerieTemporal from "./SerieTemporal"

export type SeriesPorEstacion = {
  estacion: EstacionSismologica;
  seriesTemporales: SerieTemporal[];
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

    this.clasificacionSismo = ClasificacionSismo.setClasificacionSismo(profundidad)
    this.alcance = serieTemporal.length > 0 ? AlcanceSismo.calcularAlcance(this) : null as any
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
    // Paso 32 - se crea el cambio de estado
    const nuevoCambio = this.crearCambioEstado(fechaActual, empleado, estadoBloqueado);

    // Se añade el nuevo cambio al historial
    this.cambioEstado.push(nuevoCambio);
    // Se actualiza el puntero al estado actual del evento
    this.estadoActual = nuevoCambio.getEstado();
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

  // Paso 36 - buscar datos sismicos
  buscarDatosSismicos() {
    return {
      alcance: this.getAlcance(),
      clasificacion: this.getClasificacionSismo(),
      origenDeGeneracion: this.getOrigenDeGeneracion(),
    }
  }

  // Métodos de acceso individuales (pasos 37–42)
  getAlcance() {
    return this.alcance.getNombre()
  }
  getClasificacionSismo() {
    return this.clasificacionSismo.getNombre()
  }
  getOrigenDeGeneracion() {
    return this.origenDeGeneracion.getNombre()
  }

  // Paso 45 - buscar series en evento
  buscarSeriesTemporales() {
    const seriesTemporales = this.getSerieTemporal() // Paso 46

    const seriesPorEstacion = this.clasificarPorEstacion(seriesTemporales) // Paso 52

    return seriesPorEstacion;
  }

  getSerieTemporal() {
    return this.serieTemporal
  }

  clasificarPorEstacion(seriesTemporales: SerieTemporal[]) { // Metodo para clasificar las series por estacion sismologica
    const seriesPorEstacion: SeriesPorEstacion[] = [] // Array para guardar los grupos con sus respectivas series

    for (const serie of seriesTemporales) {
      // Ordenar muestras sismicas por fechaHoraMuestra
      serie.getDatos().muestrasSismicas.sort((a, b) =>
        a.getDatos().fechaHoraMuestra.getTime() - b.getDatos().fechaHoraMuestra.getTime()
      )

      const estacion = serie.getSismografo().getEstacionSismologica() // Obtiene la estacion de esa SerieTemporal
      const existente = seriesPorEstacion.find(e => e.estacion.getCodigoEstacion() === estacion.getCodigoEstacion()) // Revisa si ya existe la estacion en el array

      if (existente) { // Si existe, le pushea la serie a esa estacion
        existente.seriesTemporales.push(serie)
      } else { // Si la estacion no existe en el array, crea un nuevo grupo
        seriesPorEstacion.push({
          estacion,
          seriesTemporales: [serie]
        })
      }
    }

    return seriesPorEstacion
  }

  // Paso 65 - rechazar este evento
  rechazar(fechaActual: Date, empleado: Empleado, estadoRechazado: Estado) {
    // Paso 66 - busca el ultimo cambio de estado
    const ultimoCambio = this.buscarUltimoCambioEstado();

    if (ultimoCambio) {
      // Paso 67 - verificar si es actual
      if (ultimoCambio.esEstadoActual()) {
        // Paso 68 - si es actual, lo finaliza
        ultimoCambio.setFechaHoraFin(fechaActual);
      }
    }
    // Paso 69 - se crea el cambio de estado
    const nuevoCambio = this.crearCambioEstado(fechaActual, empleado, estadoRechazado);

    // Se añade el nuevo cambio al historial
    this.cambioEstado.push(nuevoCambio);
    // Se actualiza el puntero al estado actual del evento
    this.estadoActual = nuevoCambio.getEstado();
  }

  confirmar(fechaActual: Date, empleado: Empleado, estadoConfirmado: Estado) {
    const ultimoCambio = this.buscarUltimoCambioEstado();

    if (ultimoCambio) {
      if (ultimoCambio.esEstadoActual()) {
        ultimoCambio.setFechaHoraFin(fechaActual);
      }
    }
    const nuevoCambio = this.crearCambioEstado(fechaActual, empleado, estadoConfirmado);

    // Se añade el nuevo cambio al historial
    this.cambioEstado.push(nuevoCambio);
    // Se actualiza el puntero al estado actual del evento
    this.estadoActual = nuevoCambio.getEstado();
  }

  derivar(fechaActual: Date, empleado: Empleado, estadoDerivado: Estado) {
    const ultimoCambio = this.buscarUltimoCambioEstado();

    if (ultimoCambio) {
      if (ultimoCambio.esEstadoActual()) {
        ultimoCambio.setFechaHoraFin(fechaActual);
      }
    }
    const nuevoCambio = this.crearCambioEstado(fechaActual, empleado, estadoDerivado);

    // Se añade el nuevo cambio al historial
    this.cambioEstado.push(nuevoCambio);
    // Se actualiza el puntero al estado actual del evento
    this.estadoActual = nuevoCambio.getEstado();
  }

  // Flujo Alternativo A8
  cancelar(fechaActual: Date, estadoAutoDetectado: Estado, estadoPendiente: Estado) {
    const haceCuanto = fechaActual.getTime() - this.fechaHoraOcurrencia.getTime()
    const cincoMinutos = 5 * 60 * 1000

    const estado = haceCuanto >= cincoMinutos // Verifica si pasaron 5min desde que se creo el evento
      ? estadoPendiente // Si pasaron, cambia el estado a pendiente_de_revision
      : estadoAutoDetectado; // Si no, cambia el estado a auto_detectado

    const ultimoCambio = this.buscarUltimoCambioEstado();

    if (ultimoCambio) {
      if (ultimoCambio.esEstadoActual()) {
        ultimoCambio.setFechaHoraFin(fechaActual);
      }
    }

    const nuevoCambio = this.crearCambioEstado(fechaActual, null, estado);

    // Se añade el nuevo cambio al historial
    this.cambioEstado.push(nuevoCambio);
    // Se actualiza el puntero al estado actual del evento
    this.estadoActual = nuevoCambio.getEstado();
  }

  // --- Metodos auxiliares ---
  actualizarAPendienteRevision(fechaActual: Date, estadoPendiente: Estado) { // Metodo para actualizar a pendiente_de_revision automaticamente
    const haceCuanto = fechaActual.getTime() - this.fechaHoraOcurrencia.getTime()
    const cincoMinutos = 5 * 60 * 1000

    // Si pasan 5min cambia el estado a "pendiente_de_revision"
    if (this.estadoActual.esAutoDetectado() && haceCuanto >= cincoMinutos) {

      const ultimoCambio = this.buscarUltimoCambioEstado();

      // Finaliza el estado actual
      if (ultimoCambio) {
        if (ultimoCambio.esEstadoActual()) {
          ultimoCambio.setFechaHoraFin(fechaActual);
        }
      }

      // Al empleado le pasamos null porque lo hace el sistema automaticamente
      const nuevoCambio = this.crearCambioEstado(fechaActual, null, estadoPendiente);

      // Se añade el nuevo cambio al historial
      this.cambioEstado.push(nuevoCambio);
      // Se actualiza el puntero al estado actual del evento
      this.estadoActual = nuevoCambio.getEstado();
    }

  }
}
