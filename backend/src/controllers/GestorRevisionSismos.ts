import { eventosSismicos } from "../data/data";

export default class GestorRevisionSismos {
  obtenerEventosSismicosNoRevisados() {
    return eventosSismicos.filter((evento) => evento.getEstado().esAutoDetectado())
      .sort((a, b) => a.getFechaHoraOcurriencia().getTime() - b.getFechaHoraOcurriencia().getTime())
      .map((evento) => ({
        id: evento.getId(),
        fechaHora: evento.getFechaHoraOcurriencia(),
        ubicacion: evento.getUbicacion(),
        magnitud: evento.getMagnitud()
      }))
  }
}
