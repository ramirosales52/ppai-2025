import { eventosSismicos, usuarios } from "../data/data";
import { ESTADOS } from "../data/estados";
import Empleado from "../models/Empleado";
import Estado from "../models/Estado";
import EventoSismico, { SeriesPorEstacion } from "../models/EventoSismico";
import Sesion from "../models/Sesion";

export default class GestorRevisionSismos {
  // Utiliza la fuente de datos real de eventos sismicos
  private readonly eventos: EventoSismico[] = eventosSismicos;

  // Paso 4 – filtrar
  buscarEventosSismicosAutoDetectados() {
    return this.eventos.filter(
      (evento) => evento.esAutodetectado() || evento.esPendienteDeRevision(),
    )
  }

  // Paso 16 – ordenar
  private ordenarEventosSismicos(eventos: EventoSismico[]): EventoSismico[] {
    return [...eventos].sort(
      (a, b) => a.getFechaHoraOcurrencia().getTime() - b.getFechaHoraOcurrencia().getTime(),
    )
  }

  // Paso 17 – obtener datos principales para la UI
  public mostrarEventosSismicosParaSeleccion(): any[] {
    const candidatos = this.buscarEventosSismicosAutoDetectados() // Eventos con estado autodetectado o pendiente_de_revision
    const ordenados = this.ordenarEventosSismicos(candidatos) // Eventos candidatos ordenados por fechaHoraOcurrencia
    return ordenados.map((e) => e.getDatosPrincipales()) // Devuelve los datos principales
  }

  // Paso 19 - tomar seleccion del usuario
  tomarSeleccionEventoSismico(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) return

    return evento
  }

  // Paso 20 - buscar estado bloqueado
  buscarEstadoBloqueado(): Estado | undefined {
    const estados = Object.values(ESTADOS)
    return estados.find(
      (estado) => estado.esAmbitoEventoSismico() && estado.esBloqueadoEnRevision() // Paso 21 y 22
    )
  }

  // Paso 23/64 - fecha actual
  tomarFechaHoraActual() {
    return new Date
  }

  // Paso 24 - buscar empleado logueado
  public buscarEmpleadoLogueado(): Empleado {
    const sesion = Sesion.getSesionActual() // Obtener la sesion actual
    const usuario = sesion.getUsuarioLogueado() // Paso 25
    const empleado = usuario.getEmpleado() // Paso 26
    return empleado
  }

  private buscarEventoSismico(id: string): EventoSismico | undefined {
    return this.eventosDisponibles.find(e => e['id'] === id);
  }
  private get eventosDisponibles(): EventoSismico[] {
    return this.eventos.filter(evento => evento.getEstadoActual().esAmbitoEventoSismico());
  }

  // Paso 27 - bloquear evento
  bloquearEventoSismico(id: string) {
    const estadoBloqueado = this.buscarEstadoBloqueado()
    const eventoSeleccionado = this.buscarEventoSismico(id)
    const empleadoLogueado = this.buscarEmpleadoLogueado()
    const fechaActual = this.tomarFechaHoraActual()

    if (!eventoSeleccionado) return
    if (!estadoBloqueado) return

    eventoSeleccionado.bloquear(fechaActual, empleadoLogueado, estadoBloqueado);
  }

  // Paso 35 - buscar datos sismiscos (alcance, clasificacion, origen)
  buscarDatosSismicos(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) throw new Error("Evento no encontrado")

    const datosSismicos = evento.buscarDatosSismicos()
    return datosSismicos
  }

  // Paso 43 - mostrar datos sismicos
  mostrarDatosEventoSismicoSeleccionado(id: string) {
    return this.buscarDatosSismicos(id)
  }

  // Paso 44 - buscar las series temporales
  buscarSeriesTemporales(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id);
    if (!evento) throw new Error("Evento no encontrado")

    const seriesTemporales = evento.buscarSeriesTemporales()
    const seriesOrdenadas = this.ordenarSeriesTemporales(seriesTemporales)

    return seriesOrdenadas
  }

  // Paso 54 - Ordenar las series por fechaHoraInicioRegistroMuestras
  ordenarSeriesTemporales(seriesPorEstacion: SeriesPorEstacion[]) {
    for (const grupo of seriesPorEstacion) {
      grupo.seriesTemporales.sort((a, b) =>
        a.getFechaHoraInicioRegistroMuestras().getTime() -
        b.getFechaHoraInicioRegistroMuestras().getTime()
      );
    }

    return seriesPorEstacion;
  }

  mostrarSeriesTemporalesPorEstacion(id: string) {
    return this.buscarSeriesTemporales(id)
  }

  // Paso 61 -  buscar estado rechazado
  buscarEstadoRechazado(): Estado | undefined {
    const estados = Object.values(ESTADOS)
    return estados.find(
      (estado) => estado.esAmbitoEventoSismico() && estado.esRechazado() // Paso 62 y 63
    )
  }

  rechazarEventoSismico(id: string) {
    const estadoRechazado = this.buscarEstadoRechazado()
    const eventoSeleccionado = this.buscarEventoSismico(id)
    const empleadoLogueado = this.buscarEmpleadoLogueado()
    const fechaActual = this.tomarFechaHoraActual()

    if (!eventoSeleccionado) return
    if (!estadoRechazado) return

    eventoSeleccionado.rechazar(fechaActual, empleadoLogueado, estadoRechazado)
  }

  // Flujo Alternativo A6
  buscarEstadoConfirmado(): Estado | undefined {
    const estados = Object.values(ESTADOS)
    return estados.find(
      (estado) => estado.esAmbitoEventoSismico() && estado.esConfirmado()
    )
  }

  confirmarEventoSismico(id: string) {
    const estadoConfirmado = this.buscarEstadoConfirmado()
    const eventoSeleccionado = this.buscarEventoSismico(id)
    const empleadoLogueado = this.buscarEmpleadoLogueado()
    const fechaActual = this.tomarFechaHoraActual()

    if (!eventoSeleccionado) return
    if (!estadoConfirmado) return

    eventoSeleccionado.confirmar(fechaActual, empleadoLogueado, estadoConfirmado)
  }

  // Flujo Alternativo A7
  buscarEstadoDerivado(): Estado | undefined {
    const estados = Object.values(ESTADOS)
    return estados.find(
      (estado) => estado.esAmbitoEventoSismico() && estado.esDerivadoExperto()
    )
  }
  derivarEventoSismico(id: string) {
    const estadoDerivado = this.buscarEstadoDerivado()
    const eventoSeleccionado = this.buscarEventoSismico(id)
    const empleadoLogueado = this.buscarEmpleadoLogueado()
    const fechaActual = this.tomarFechaHoraActual()

    if (!eventoSeleccionado) return
    if (!estadoDerivado) return

    eventoSeleccionado.derivar(fechaActual, empleadoLogueado, estadoDerivado)
  }

  // --------- Metodos auxiliares ---------
  iniciarSesion(nombreUsuario: string, contraseña: string) { // Metodo que inicia la sesion
    const usuario = usuarios.find((usuario) => usuario.getNombreUsuario() === nombreUsuario && usuario.getContraseña() === contraseña)

    if (!usuario) {
      throw new Error("Credenciales incorrectas")
    }

    Sesion.iniciarSesion(usuario)
  }

  actualizarAPendienteRevision() { // Metodo para actualizar el evento dsp de 5min
    const fechaActual = new Date()
    eventosSismicos.forEach((evento) => {
      evento.actualizarAPendienteRevision(fechaActual)
    })
  }
}
