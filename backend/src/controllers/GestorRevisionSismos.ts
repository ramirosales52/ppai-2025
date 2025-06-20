import { eventosSismicos, usuarios } from "../data/data";
import { ESTADOS } from "../data/estados";
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

  // TODO: separar el map en getDatosPrincipales()
  // NOTE: listo
  obtenerEventosSismicosAutodetectados() {
    const eventosAutodetectados = eventosSismicos
      .filter(evento =>
        evento.getEstadoActual().esAutoDetectado() ||
        evento.getEstadoActual().esPendienteDeRevision()
      ) // Filtra por estado autodetectado o pendiente_de_revision
      .sort((a, b) =>
        a.getFechaHoraOcurriencia().getTime() - b.getFechaHoraOcurriencia().getTime()
      ) // Ordena por fechaHoraOcurriencia
      .map(evento => evento.getDatosPrincipales()); // Obtiene los datosPrincipales

    return eventosAutodetectados;
  }


  obtenerEventoPorId(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) return

    return evento.getDatosPrincipales()
  }

  buscarDatosSismicos(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) throw new Error("Evento no encontrado")

    return {
      clasificacion: evento.getClasificacionSismo(),
      origenDeGeneracion: evento.getOrigenDeGeneracion(),
      seriesTemporales: evento.clasificarPorEstacion()

      // TODO: alcanceSismo: evento.getAlcances(),
    }
  }

  // TODO: AGREGAR METODO buscarSeriesTemporales()

  actualizarAPendienteRevision() {
    const fechaActual = new Date()
    eventosSismicos.forEach((evento) => {
      evento.actualizarAPendienteRevision(fechaActual)
    })
  }

  obtenerTodosLosUsuarios() {
    return usuarios.map((usuario) => ({
      nombreUsuario: usuario.getNombreUsuario(),
      empleado: usuario.getRILogueado()
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
    const empleado = usuario.getRILogueado()

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
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.rechazado, empleado)
  }

  confirmarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.confirmado, empleado)
  }

  derivarEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.derivado_experto, empleado)
  }

  // TODO: FIJARSE EL NOMBRE DEL METODO
  // NOTE: hay que hacer un metodo separado por cada estado ej(rechazarEvento(), confirmarEvento(), etc)
  // actualizarEstadoA(id: string, nuevoEstado: string) {
  //   console.log(nuevoEstado)
  //   const evento = eventosSismicos.find((evento) => evento.getId() === id)
  //   if (!evento) throw new Error("Evento no encontrado")
  //
  //   const estadoActual = evento.getEstadoActual()
  //
  //   if (!estadoActual.esAmbito("EventoSismico")) return
  //
  //   const usuario = Sesion.getSesionActual().getUsuarioLogueado()
  //   const empleado = usuario.getRILogueado()
  //
  //   switch (nuevoEstado) {
  //     case "confirmado":
  //       evento.cambiarEstadoA(ESTADOS.confirmado, empleado)
  //       break
  //     case "derivado_experto":
  //       evento.cambiarEstadoA(ESTADOS.derivado_experto, empleado)
  //       break
  //     default:
  //       evento.cambiarEstadoA(ESTADOS.rechazado, empleado)
  //       break
  //   }
  // }
}
