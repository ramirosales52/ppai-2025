export default class EstacionSismologica {
  private codigoEstacion: string
  private latitud: number
  private longitud: number
  private nombre: string
  // private documentoCertificacionAdquisicion: string
  // private fechaSolicitudCertificacion: Date
  // private nroCertificacionAdquisicion: number

  constructor(
    codigoEstacion: string,
    latitud: number,
    longitud: number,
    nombre: string
    // documentoCertificacionAdquisicion: string,
    // fechaSolicitudCertificacion: Date,
    // nroCertificacionAdquisicion: number
  ) {
    this.codigoEstacion = codigoEstacion
    this.latitud = latitud
    this.longitud = longitud
    this.nombre = nombre
    // this.documentoCertificacionAdquisicion = documentoCertificacionAdquisicion
    // this.fechaSolicitudCertificacion = fechaSolicitudCertificacion
    // this.nroCertificacionAdquisicion = nroCertificacionAdquisicion
  }

  getCodigoEstacion() {
    return this.codigoEstacion
  }

  getNombre() {
    return this.nombre
  }

  getUbicacion() {
    return {
      latitud: this.latitud,
      longitud: this.longitud
    }
  }
}
