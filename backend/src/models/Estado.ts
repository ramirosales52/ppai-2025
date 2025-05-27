// TODO: Magnitud < 4 Estado auto_detectado
// TODO: Magnitud >= 4 Estado auto_confirmado

export default class Estado {
  // private ambito: string
  private nombreEstado: "auto_detectado" | "auto_confirmado"

  constructor(
    // ambito: string,
    nombreEstado: "auto_detectado" | "auto_confirmado"
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
}
