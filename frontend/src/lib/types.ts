export interface Ubicacion {
  latitudEpicentro: number,
  latitudHipocentro: number,
  longitudEpicentro: number,
  longitudHipocentro: number
}

export interface EstadoActual {
  nombreEstado: string
}

export interface EventoSismico {
  id: string
  fechaHora: Date
  ubicacion: Ubicacion
  valorMagnitud: number
  estadoActual: EstadoActual
}

