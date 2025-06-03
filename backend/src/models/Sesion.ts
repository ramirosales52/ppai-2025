import Usuario from "./Usuario"

export default class Sesion {
  private static sesionActual: Sesion
  private usuarioLogueado: Usuario

  private constructor(
    usuario: Usuario
  ) {
    this.usuarioLogueado = usuario
  }

  static iniciarSesion(usuario: Usuario) {
    this.sesionActual = new Sesion(usuario)
  }

  static getSesionActual(): Sesion {
    if (!this.sesionActual) throw new Error("No hay una sesion iniciada")
    return this.sesionActual
  }

  getUsuarioLogueado(): Usuario {
    return this.usuarioLogueado
  }
}
