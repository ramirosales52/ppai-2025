import { eventosSismicos } from "../data/data";

export default class GestorRevisionSismos {

  obtenerEventosSismicosNoRevisados() {
    return eventosSismicos.filter((evento) => evento.getEstado().esAutoDetectado() || evento.getEstado().esPendienteDeRevision())
      .sort((a, b) => a.getFechaHoraOcurriencia().getTime() - b.getFechaHoraOcurriencia().getTime())
      .map((evento) => ({
        id: evento.getId(),
        fechaHora: evento.getFechaHoraOcurriencia(),
        ubicacion: evento.getUbicacion(),
        magnitud: evento.getMagnitud(),
        estado: evento.getEstado()
      }))
  }

  obtenerEventoPorId(id: string) {
    const evento = eventosSismicos.find((evento) => evento.getId() === id)

    if (!evento) return

    return {
      id: evento.getId(),
      fechaHora: evento.getFechaHoraOcurriencia(),
      ubicacion: evento.getUbicacion(),
      magnitud: evento.getMagnitud(),
      estado: evento.getEstado()
    }
  }

  actualizarEstado() {
    const fechaActual = new Date()
    eventosSismicos.forEach((evento) => {
      evento.actualizarEstado(fechaActual)
    })
  }
}
