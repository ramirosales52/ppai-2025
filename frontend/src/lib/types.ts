export interface Ubicacion {
  latitudEpicentro: number,
  latitudHipocentro: number,
  longitudEpicentro: number,
  longitudHipocentro: number
}

export interface Estado {
  nombreEstado: string
}

export interface EventoSismico {
  id: string
  fechaHora: Date
  ubicacion: Ubicacion
  magnitud: number
  estado: Estado
}

