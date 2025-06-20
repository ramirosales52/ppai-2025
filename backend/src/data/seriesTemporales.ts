import DetalleMuestraSismica from "../models/DetalleMuestraSismica"
import MuestraSismica from "../models/MuestraSismica"
import SerieTemporal from "../models/SerieTemporal"
import TipoDeDato from "../models/TipoDeDato"
import { SISMOGRAFOS } from "./sismografos"

const tipoVelocidad = new TipoDeDato("Velocidad de onda", "Km/seg", 8.0)
const tipoFrecuencia = new TipoDeDato("Frecuencia de onda", "Hz", 12.0)
const tipoLongitud = new TipoDeDato("Longitud de onda", "km/ciclo", 0.75)

const muestrasSerie1: MuestraSismica[] = [
  new MuestraSismica(new Date("2025-02-21T19:05:41"), [
    new DetalleMuestraSismica(7.0, tipoVelocidad),
    new DetalleMuestraSismica(10.0, tipoFrecuencia),
    new DetalleMuestraSismica(0.7, tipoLongitud),
  ]),
  new MuestraSismica(new Date("2025-02-21T19:15:41"), [
    new DetalleMuestraSismica(6.99, tipoVelocidad),
    new DetalleMuestraSismica(10.01, tipoFrecuencia),
    new DetalleMuestraSismica(0.7, tipoLongitud),
  ]),
  new MuestraSismica(new Date("2025-02-21T19:10:41"), [
    new DetalleMuestraSismica(7.02, tipoVelocidad),
    new DetalleMuestraSismica(10.0, tipoFrecuencia),
    new DetalleMuestraSismica(0.69, tipoLongitud),
  ]),
]

const muestrasSerie2: MuestraSismica[] = [ // ← Supera umbral
  new MuestraSismica(new Date("2025-03-03T14:30:00"), [
    new DetalleMuestraSismica(8.5, tipoVelocidad),
    new DetalleMuestraSismica(12.5, tipoFrecuencia),
    new DetalleMuestraSismica(0.8, tipoLongitud),
  ]),
  new MuestraSismica(new Date("2025-03-03T14:35:00"), [
    new DetalleMuestraSismica(8.1, tipoVelocidad),
    new DetalleMuestraSismica(12.6, tipoFrecuencia),
    new DetalleMuestraSismica(0.78, tipoLongitud),
  ]),
  new MuestraSismica(new Date("2025-03-03T14:40:00"), [
    new DetalleMuestraSismica(7.9, tipoVelocidad),
    new DetalleMuestraSismica(12.4, tipoFrecuencia),
    new DetalleMuestraSismica(0.79, tipoLongitud),
  ]),
]

export const SERIES_TEMPORALES = {
  serieTemporal1: new SerieTemporal(
    new Date("2025-02-21T19:05:41"),
    new Date("2025-02-21T19:15:41"),
    50,
    muestrasSerie1,
    SISMOGRAFOS.sismografo1
  ),
  serieTemporal2: new SerieTemporal(
    new Date("2025-03-03T14:30:00"),
    new Date("2025-03-03T14:40:00"),
    50,
    muestrasSerie2,
    SISMOGRAFOS.sismografo3
  ),
  serieTemporal3: new SerieTemporal(
    new Date("2025-03-03T14:30:00"),
    new Date("2025-03-03T14:40:00"),
    50,
    muestrasSerie2,
    SISMOGRAFOS.sismografo3
  )
}
