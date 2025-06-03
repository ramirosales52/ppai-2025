import { formatoFecha } from "../utils/formatoFecha"
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

  getDatos() {
    return {
      fechaHoraMuestra: this.fechaHoraMuestra.toLocaleString("es-AR", formatoFecha).replace(',', ' -'),
      detalleMuestraSismica: this.detalleMuestraSismica
    }
  }
}
