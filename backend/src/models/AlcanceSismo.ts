// Alcance: la distancia epicentral (km) entre el epicentro de un sismo y el punto de observación (ES). Ej.
// sismos locales (hasta 100 km), sismos regionales (hasta 1000 km), o tele sismos (más de 1000 km).
import EstacionSismologica from "./EstacionSismologica"

type Alcance = "local" | "regional" | "tele_sismo"
type Coordenadas = { latitud: number, longitud: number }

export default class AlcanceSismo {
  // private descripcion: string
  private nombre: Alcance
  private distancia: number

  constructor(
    // descripcion: string,
    nombre: Alcance,
    distancia: number
  ) {
    // this.descripcion = descripcion
    this.nombre = nombre,
      this.distancia = distancia
  }

  getNombre() {
    return this.nombre
  }

  static setAlcance(estacionSismologica: EstacionSismologica | null, epicentro: Coordenadas): AlcanceSismo | undefined {
    if (!estacionSismologica) return

    // Si la tierra fuese plana
    const kmPorGrado = 111 // 1 grado ≈ 111 km en lat/long
    const dLat = epicentro.latitud - estacionSismologica.getUbicacion().latitud
    const dLong = epicentro.longitud - estacionSismologica.getUbicacion().longitud

    const distancia = Math.round(Math.sqrt(dLat * dLat + dLong * dLong) * kmPorGrado * 100) / 100

    if (distancia <= 100) return new AlcanceSismo("local", distancia)
    if (distancia <= 1000) return new AlcanceSismo("regional", distancia)
    return new AlcanceSismo("tele_sismo", distancia)
  }
}
