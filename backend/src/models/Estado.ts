type NombreEstado = "auto_detectado" | "auto_confirmado" | "pendiente_de_revision" | "bloqueado_en_revision" | "rechazado" | "confirmado" | "derivado_experto" | "evento_sin_revision" | "pendiente_de_cierre" | "cerrado" | "en_linea"
type Ambito = "EventoSismico" | "Sismografo"

export default class Estado {
  private ambito: Ambito
  private nombreEstado: NombreEstado

  constructor(
    ambito: Ambito,
    nombreEstado: NombreEstado
  ) {
    this.ambito = ambito
    this.nombreEstado = nombreEstado
  }

  getAmbito() {
    return this.ambito
  }

  getNombreEstado() {
    return this.nombreEstado
  }

  esAutoDetectado() {
    return this.nombreEstado === "auto_detectado"
  }

  esPendienteDeRevision() {
    return this.nombreEstado === "pendiente_de_revision"
  }

  esBloqueadoEnRevision() {
    return this.nombreEstado === "bloqueado_en_revision"
  }

  esAmbito(ambito: Ambito): boolean {
    return this.ambito === ambito
  }

}
