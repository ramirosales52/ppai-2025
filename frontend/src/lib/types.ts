interface Ubicacion {
}

interface Estado {
  nombreEstado: string
}

interface Richter {
  descripcionMagnitud: string
}

interface Clasificacion {
  nombre: string
}
interface Origen {
  nombre: string
}

interface Empleado {
  nombre: string,
  apellido: string,
  mail: string,
  telefono: number
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

interface Alcance {
  nombre: string,
  distancia: number
}

interface AlcanceSismo {
  alcance: Alcance,
  estacion: EstacionSismologica
}

interface Sismografo {
  estacionSismologica: EstacionSismologica,
  estadoActual: Estado,
  fechaAdquisicion: Date,
  identificadorSismografo: string,
  nroSerie: number,
}

interface EstacionesSismologicas {
  estacionSismologica: EstacionSismologica,
  sismografos: Sismografo[]
}

interface CambioEstado {
  empleado: Empleado,
  estado: Estado,
  fechaHoraInicio: Date,
  fechaHoraFin: Date
}

interface SeriesTemporales {
  estacionSismologica: EstacionSismologica,
  serieTemporal: SerieTemporal[]
}

interface DatosEvento {
  clasificacion: Clasificacion,
  origenDeGeneracion: Origen,
  profundidad: number,
  alcanceSismo: AlcanceSismo[],
  estacionesSismologicas: EstacionesSismologicas[]
}

export interface Evento {
  cambioEstado: CambioEstado[]
  estadoActual: Estado,
  fechaHoraOcurriencia: Date,
  id: string,
  latitudEpicentro: number,
  latitudHipocentro: number,
  longitudEpicentro: number,
  longitudHipocentro: number
  valorMagnitud: number,
}

export interface EventoSismico {
  evento: Evento,
  datosEvento: DatosEvento
}

