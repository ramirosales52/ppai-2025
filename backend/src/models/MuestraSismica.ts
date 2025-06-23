import DetalleMuestraSismica from "./DetalleMuestraSismica"

export default class MuestraSismica {
  private fechaHoraMuestra: Date
  private detalleMuestraSismica: DetalleMuestraSismica[]

  constructor(
    fechaHoraMuestra: Date,
    detalleMuestraSismica: DetalleMuestraSismica[]
  ) {
    this.fechaHoraMuestra = fechaHoraMuestra
    this.detalleMuestraSismica = detalleMuestraSismica
  }

  getDetalleMuestraSismica() {
    return this.detalleMuestraSismica
  }

  getDatos() {
    return {
      fechaHoraMuestra: this.fechaHoraMuestra,
      detalleMuestraSismica: this.detalleMuestraSismica
    }
  }
}
