import { eventosSismicos, usuarios } from "../data/data";
import { ESTADOS } from "../data/estados";
import { SISMOGRAFOS } from "../data/sismografos";
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

  obtenerEventosSismicosNoRevisados() {
    return eventosSismicos.filter((evento) => evento.getEstadoActual().esAutoDetectado() || evento.getEstadoActual().esPendienteDeRevision())
      .sort((a, b) => a.getFechaHoraOcurriencia().getTime() - b.getFechaHoraOcurriencia().getTime())
      .map((evento) => ({
        id: evento.getId(),
        fechaHora: evento.getFechaHoraOcurriencia(),
        ubicacion: evento.getUbicacion(),
        valorMagnitud: evento.getValorMagnitud(),
        estadoActual: evento.getEstadoActual(),
        magnitudRichter: evento.getMagnitud(),
        historialEstados: evento.getHistorialEstados()
      }))
  }

  obtenerEventoPorId(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) return

    return {
      id: evento.getId(),
      fechaHora: evento.getFechaHoraOcurriencia(),
      ubicacion: evento.getUbicacion(),
      valorMagnitud: evento.getValorMagnitud(),
      estadoActual: evento.getEstadoActual(),
      magnitudRichter: evento.getMagnitud(),
      historialEstados: evento.getHistorialEstados(),
    }
  }

  obtenerDatos(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) throw new Error("Evento no encontrado")

    return {
      profundidad: evento.getProfundidad(),
      clasificacion: evento.getClasificacionSismo(),
      origenDeGeneracion: evento.getOrigenDeGeneracion(),
      alcanceSismo: evento.getAlcances(),
      estacionesSismologicas: evento.getEstacionSismologica(SISMOGRAFOS),
      sismografosSerie: evento.getSismografoSerie(SISMOGRAFOS),
      seriesTemporales: evento.getSerieTemporal().sort((a, b) => a.getFechaHoraInicioRegistroMuestras().getTime() - b.getFechaHoraInicioRegistroMuestras().getTime())
    }
  }

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

  bloquearEvento(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)
    if (!evento) throw new Error("Evento no encontrado")

    const estadoActual = evento.getEstadoActual()

    if (!estadoActual.esAmbito("EventoSismico")) return
    if (estadoActual.esBloqueadoEnRevision()) return

    const usuario = Sesion.getSesionActual().getUsuarioLogueado()
    const empleado = usuario.getRILogueado()

    evento.cambiarEstadoA(ESTADOS.bloqueado_en_revision, empleado)
  }


}
