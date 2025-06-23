import Empleado from "./Empleado"

export default class Usuario {
  private nombreUsuario: string
  private contraseña: string
  private empleado: Empleado

  constructor(
    nombreUsuario: string,
    contraseña: string,
    empleado: Empleado
  ) {
    this.nombreUsuario = nombreUsuario
    this.contraseña = contraseña
    this.empleado = empleado
  }

  getNombreUsuario() {
    return this.nombreUsuario
  }

  getContraseña() {
    return this.contraseña
  }

  getEmpleado(): Empleado {
    return this.empleado
  }
}
