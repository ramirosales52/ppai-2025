interface Ubicacion {
  latitudEpicentro: number,
  latitudHipocentro: number,
  longitudEpicentro: number,
  longitudHipocentro: number
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
  serieTemporal: SerieTemporal[]
}

interface EstacionesSismologicas {
  estacionSismologica: EstacionSismologica,
  sismografos: Sismografo[]
}

interface HistorialEstados {
  empleado: Empleado,
  estado: Estado,
  fechaHoraInicio: Date,
  fechaHoraFin: Date
}

interface DatosEvento {
  clasificacion: Clasificacion,
  origenDeGeneracion: Origen,
  profundidad: number,
  alcanceSismo: AlcanceSismo[],
  estacionesSismologicas: EstacionesSismologicas[]
}

export interface Evento {
  id: string,
  fechaHora: Date,
  ubicacion: Ubicacion,
  valorMagnitud: number,
  estadoActual: Estado,
  magnitudRichter: Richter,
  historialEstados: HistorialEstados[]
}

export interface EventoSismico {
  evento: Evento,
  datosEvento: DatosEvento
}

