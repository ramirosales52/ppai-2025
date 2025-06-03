export default class Empleado {
  private nombre: string
  private apellido: string
  private mail: string
  private telefono: number

  constructor(
    nombre: string,
    apellido: string,
    mail: string,
    telefono: number
  ) {
    this.nombre = nombre
    this.apellido = apellido
    this.mail = mail
    this.telefono = telefono
  }

  getNombre() {
    return this.nombre
  }

  getApellido() {
    return this.apellido
  }
}
