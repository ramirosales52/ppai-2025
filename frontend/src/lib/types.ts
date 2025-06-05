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
  muestrasSismicas: MuestraSismica[]
}

interface HistorialEstados {
  empleado: Empleado,
  estado: Estado,
  fechaHoraInicio: Date,
  fechaHoraFin: Date
}

interface Datos {
  clasificacion: Clasificacion,
  origenDeGeneracion: Origen,
  profundidad: number,
  seriesTemporales: SerieTemporal[]
}

interface Evento {
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
  datosEvento: Datos
}

