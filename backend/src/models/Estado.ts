export default class Estado {
  // private ambito: string
  private nombreEstado: "auto_detectado" | "auto_confirmado" | "pendiente_en_revision" | "bloqueado_en_revision"

  constructor(
    // ambito: string,
    nombreEstado: "auto_detectado" | "auto_confirmado" | "pendiente_en_revision" | "bloqueado_en_revision"
  ) {
    // this.ambito = ambito
    this.nombreEstado = nombreEstado
  }

  // getAmbito() {
  //   return this.ambito
  // }

  getNombreEstado() {
    return this.nombreEstado
  }

  esAutoDetectado() {
    return this.nombreEstado === "auto_detectado"
  }

  esPendienteDeRevision() {
    return this.nombreEstado === "pendiente_en_revision"
  }

  cambiarAPendienteDeRevision() {
    return this.nombreEstado = "pendiente_en_revision"
  }
}
