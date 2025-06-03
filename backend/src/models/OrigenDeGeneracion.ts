export default class OrigenDeGeneracion {
  // private descripcion: string
  private nombre: string

  constructor(
    // descripcion: string,
    nombre: string
  ) {
    // this.descripcion = descripcion
    this.nombre = nombre
  }

  getNombre() {
    return this.nombre
  }
}
