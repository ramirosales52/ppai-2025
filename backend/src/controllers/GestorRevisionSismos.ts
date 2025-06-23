import { eventosSismicos, usuarios } from "../data/data";
import { ESTADOS } from "../data/estados";
import Empleado from "../models/Empleado";
import Estado from "../models/Estado";
import EventoSismico from "../models/EventoSismico";
import Sesion from "../models/Sesion";

export default class GestorRevisionSismos {
  iniciarSesion(nombreUsuario: string, contraseña: string) {
    const usuario = usuarios.find((usuario) => usuario.getNombreUsuario() === nombreUsuario && usuario.getContraseña() === contraseña)

    if (!usuario) {
      throw new Error("Credenciales incorrectas")
    }

    Sesion.iniciarSesion(usuario)
  }

  obtenerSesionActual() {
    return Sesion.getSesionActual()
  }

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

  // Paso 23 - fecha actual
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
  bloquearEventoSismico(eventoId: string) {
    const estadoBloqueado = this.buscarEstadoBloqueado()
    const eventoSeleccionado = this.buscarEventoSismico(eventoId)
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

    return {
      alcanceSismo: evento.getAlcance(),
      clasificacion: evento.getClasificacionSismo(),
      origenDeGeneracion: evento.getOrigenDeGeneracion(),
      seriesTemporales: this.buscarSeriesTemporales(id)

    }
  }

  // TODO: AGREGAR METODO buscarSeriesTemporales()
  buscarSeriesTemporales(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id);
    if (!evento) throw new Error("Evento no encontrado")

    const seriesTemporales = evento.getSerieTemporal()

    const seriesPorEstacion = evento.clasificarPorEstacion()

    return seriesPorEstacion;
  }

  actualizarAPendienteRevision() { // Metodo para actualizar el evento dsp de 5min
    const fechaActual = new Date()
    eventosSismicos.forEach((evento) => {
      evento.actualizarAPendienteRevision(fechaActual)
    })
  }

  obtenerTodosLosUsuarios() {
    return usuarios.map((usuario) => ({
      nombreUsuario: usuario.getNombreUsuario(),
      empleado: usuario.getEmpleado()
    }))
  }

  // NOTE: el diagrama dice revisar()
  bloquearEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return
    if (
      estadoActual.esBloqueadoEnRevision() ||
      estadoActual.esConfirmado() ||
      estadoActual.esRechazado() ||
      estadoActual.esDerivadoExperto()
    ) return // Se verifica que estadoActual no sea ninguno de esos

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getEmpleado()

    // WARN: REVISAR
    // NOTE: esta bien creo
    evento.cambiarEstadoA(ESTADOS.bloqueado_en_revision, empleado)
  }

  rechazarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getEmpleado()

    evento.cambiarEstadoA(ESTADOS.rechazado, empleado)
  }

  confirmarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getEmpleado()

    evento.cambiarEstadoA(ESTADOS.confirmado, empleado)
  }

  derivarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getEmpleado()

    evento.cambiarEstadoA(ESTADOS.derivado_experto, empleado)
  }

}
