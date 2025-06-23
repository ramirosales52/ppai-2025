// Alcance: la distancia epicentral (km) entre el epicentro de un sismo y el punto de observación (ES). Ej.
// sismos locales (hasta 100 km), sismos regionales (hasta 1000 km), o tele sismos (más de 1000 km).
import EventoSismico from "./EventoSismico"

type Alcance = "local" | "regional" | "tele_sismo"

export default class AlcanceSismo {
  private descripcion: string
  private nombre: Alcance

  constructor(
    nombre: Alcance,
  ) {
    this.descripcion = "la distancia epicentral (km) entre el epicentro de un sismo y el punto de observación (ES)"
    this.nombre = nombre
  }

  getNombre() {
    return this.nombre
  }

  static calcularAlcance(evento: EventoSismico): AlcanceSismo {
    const epicentroLat = evento.getLatitudEpicentro()
    const epicentroLon = evento.getLongitudEpicentro()

    const primeraSerie = evento.getSerieTemporal()[0]
    const estacion = primeraSerie.getSismografo().getEstacionSismologica()

    const estacionLat = estacion.getUbicacion().latitud;
    const estacionLon = estacion.getUbicacion().longitud;

    const kmPorGrado = 111 // 1 grado ≈ 111 km en lat/long
    const dLat = epicentroLat - estacionLat
    const dLong = epicentroLon - estacionLon

    const distancia = Math.round(Math.sqrt(dLat * dLat + dLong * dLong) * kmPorGrado * 100) / 100

    if (distancia <= 100) return new AlcanceSismo("local")
    if (distancia <= 1000) return new AlcanceSismo("regional")
    return new AlcanceSismo("tele_sismo")
  }
}
