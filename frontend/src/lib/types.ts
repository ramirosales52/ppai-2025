interface Estado {
  nombreEstado: string
}

interface EstacionSismologica {
  codigoEstacion: string,
  latitud: number,
  longitud: number,
  nombre: string
}

interface TipoDato {
  denominacion: string,
  nombreUnidadMedida: string
}

interface DetalleMuestraSismica {
  valor: number,
  tipoDeDato: TipoDato
}

interface MuestraSismica {
  fechaHoraMuestra: Date,
  detalleMuestraSismica: DetalleMuestraSismica[]
}

interface SerieTemporal {
  condicionAlarma: boolean,
  fechaHoraInicioRegistroMuestras: Date,
  fechaHoraRegistro: Date,
  frecuenciaMuestreo: number,
  muestraSismica: MuestraSismica[]
}

interface SeriesTemporales {
  estacionSismologica: EstacionSismologica,
  serieTemporal: SerieTemporal[]
}

interface DatosSismicos {
  clasificacion: string,
  origenDeGeneracion: string,
  alcanceSismo: string,
}

export interface DatosPrincipales {
  id: string,
  estadoActual: Estado,
  fechaHoraOcurrencia: Date,
  latitudEpicentro: number,
  latitudHipocentro: number,
  longitudEpicentro: number,
  longitudHipocentro: number
  valorMagnitud: number,
}

export interface Evento {
  datosPrincipales: DatosPrincipales,
  datosSismicos: DatosSismicos,
  seriesTemporales: SeriesTemporales
}

