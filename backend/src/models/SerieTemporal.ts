import { formatoFecha } from "../utils/formatoFecha"
import MuestraSismica from "./MuestraSismica"

export default class SerieTemporal {
  private condicionAlarma: boolean
  private fechaHoraInicioRegistroMuestras: Date
  private fechaHoraRegistro: Date
  private frecuenciaMuestreo: number
  private muestraSismica: MuestraSismica[]

  constructor(
    fechaHoraInicioRegistroMuestras: Date,
    fechaHoraRegistro: Date,
    frecuenciaMuestreo: number,
    muestraSismica: MuestraSismica[]
  ) {
    this.fechaHoraInicioRegistroMuestras = fechaHoraInicioRegistroMuestras
    this.fechaHoraRegistro = fechaHoraRegistro
    this.frecuenciaMuestreo = frecuenciaMuestreo
    this.muestraSismica = muestraSismica

    // Si el valor de la muestra es mayor o igual al valor umbral de al menos un tipo de dato
    // se activa la condicion de alarma
    this.condicionAlarma = this.muestraSismica.some(muestra =>
      muestra.getDatos().detalleMuestraSismica.some(detalle =>
        detalle.getDatos().valor >= detalle.getDatos().tipoDeDato.getValorUmbral()
      )
    )
  }

  getCondicionAlarma() {
    return this.condicionAlarma
  }

  getFechaHoraInicioRegistroMuestras() {
    return this.fechaHoraInicioRegistroMuestras
  }

  getFechaHoraRegistro() {
    return this.fechaHoraRegistro
  }

  getFrecuenciaMuestreo() {
    return this.frecuenciaMuestreo
  }

  getDatos() {
    return {
      fechaHoraInicioRegistroMuestras: this.fechaHoraInicioRegistroMuestras.toLocaleString("es-AR", formatoFecha).replace(',', ' -'),
      fechaHoraRegistro: this.fechaHoraRegistro.toLocaleString("es-AR", formatoFecha).replace(',', ' -'),
      frecuenciaMuestreo: this.frecuenciaMuestreo,
      condicionAlarma: this.condicionAlarma,
      muestrasSismicas: this.muestraSismica.map(m => m.getDatos())
    }
  }
}
