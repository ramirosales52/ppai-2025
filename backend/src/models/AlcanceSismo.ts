type Alcance = "local" | "regional" | "tele_sismo"
type Coordenadas = {
  latitud: number,
  longitud: number
}

export default class AlcanceSismo {
  // private descripcion: string
  private nombre: Alcance

  constructor(
    // descripcion: string,
    nombre: Alcance
  ) {
    // this.descripcion = descripcion
    this.nombre = nombre
  }

  getNombre() {
    return this.nombre
  }

  static setAlcance(ubicacionES: Coordenadas, epicentro: Coordenadas): AlcanceSismo {
    // Si la tierra fuese plana
    const kmPorGrado = 111 // 1 grado ≈ 111 km en lat/long
    const dLat = epicentro.latitud - ubicacionES.latitud
    const dLong = epicentro.longitud - ubicacionES.longitud

    const distancia = Math.round(Math.sqrt(dLat * dLat + dLong * dLong) * kmPorGrado * 100) / 100

    if (distancia <= 100) return new AlcanceSismo("local")
    if (distancia <= 1000) return new AlcanceSismo("regional")
    return new AlcanceSismo("tele_sismo")
  }
}
