import EstacionSismologica from "../models/EstacionSismologica"
import Sismografo from "../models/Sismografo"
import { ESTADOS } from "./estados"

const ESTACIONES_SISMOLOGICAS = {
  estacionSismologica1: new EstacionSismologica("EST-001", -34.6037, -58.3816, "Estación 1"),
  estacionSismologica2: new EstacionSismologica("EST-002", -31.4201, -64.1888, "Estación 2"),
  estacionSismologica3: new EstacionSismologica("EST-003", -38.0055, -57.5426, "Estación 3")
}

export const SISMOGRAFOS = {
  // Para EST-001
  sismografo1: new Sismografo(
    new Date("2020-05-12"),
    "SIS-001",
    12345,
    ESTADOS.en_linea,
    ESTACIONES_SISMOLOGICAS.estacionSismologica1,
  ),
  sismografo2: new Sismografo(
    new Date("2021-03-08"),
    "SIS-002",
    54321,
    ESTADOS.en_linea,
    ESTACIONES_SISMOLOGICAS.estacionSismologica1,
  ),

  // Para EST-002
  sismografo3: new Sismografo(
    new Date("2019-11-20"),
    "SIS-003",
    67890,
    ESTADOS.en_linea,
    ESTACIONES_SISMOLOGICAS.estacionSismologica2,
  ),
  // new Sismografo(
  //   new Date("2022-02-01"),
  //   "SIS-004",
  //   98760,
  //   ESTADOS.en_linea,
  //   ESTACIONES_SISMOLOGICAS.estacionSismologica2,
  //   [
  //     SERIES_TEMPORALES.serieTemporal2,
  //   ]
  // ),
  //
  // // Para EST-003
  // new Sismografo(
  //   new Date("2023-06-15"),
  //   "SIS-005",
  //   11223,
  //   ESTADOS.en_linea,
  //   ESTACIONES_SISMOLOGICAS.estacionSismologica3,
  //   [
  //     SERIES_TEMPORALES.serieTemporal1
  //   ]
  // ),
  // new Sismografo(
  //   new Date("2024-01-10"),
  //   "SIS-006",
  //   33211,
  //   ESTADOS.en_linea,
  //   ESTACIONES_SISMOLOGICAS.estacionSismologica3,
  //   [
  //     SERIES_TEMPORALES.serieTemporal1,
  //     SERIES_TEMPORALES.serieTemporal2
  //   ]
  // )
}
