import Empleado from "./Empleado"
import Estado from "./Estado"

export default class CambioEstado {
  private fechaHoraInicio: Date
  private fechaHoraFin: Date | null
  private empleadoResponsable: Empleado | null
  private estado: Estado

  constructor(
    estado: Estado,
    fechaHoraInicio: Date,
    fechaHoraFin: Date | null,
    empleadoResponsable: Empleado | null = null
  ) {
    this.estado = estado
    this.fechaHoraInicio = fechaHoraInicio
    this.fechaHoraFin = null
    this.empleadoResponsable = empleadoResponsable
  }

  getFechaHoraInicio() {
    return this.fechaHoraInicio
  }

  getFechaHoraFin() {
    return this.fechaHoraFin
  }

  getEmpleadoResponsable() {
    return this.empleadoResponsable
  }

  getEstado(): Estado {
    return this.estado
  }

  esEstadoActual(): boolean {
    return this.fechaHoraFin === null
  }

  setFechaHoraFin(horaFin: Date) {
    return this.fechaHoraFin = horaFin
  }
}

