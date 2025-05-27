export default class AlcanceSismo {
  private descripcion: string
  private nombre: string

  constructor(
    descripcion: string,
    nombre: string
  ) {
    this.descripcion = descripcion
    this.nombre = nombre
  }

  getDescripcion() {
    return this.descripcion
  }

  getNombre() {
    return this.nombre
  }
}
