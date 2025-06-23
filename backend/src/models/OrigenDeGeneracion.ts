export default class OrigenDeGeneracion {
  private descripcion: string
  private nombre: string

  constructor(
    descripcion: string,
    nombre: string
  ) {
    this.descripcion = "Origen de generación: ej. sismo interplaca, sismo volcánico, sismo provocado por explosiones de minas, etc."
    this.nombre = nombre
  }

  getNombre() {
    return this.nombre
  }
}
