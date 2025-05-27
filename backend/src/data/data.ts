import Estado from "../models/Estado"
import EventoSismico from "../models/EventoSismico"

// Estados reutilizables
const AUTO_DETECTADO = new Estado("auto_detectado")
const AUTO_CONFIRMADO = new Estado("auto_confirmado")

export const eventosSismicos: EventoSismico[] = [
  new EventoSismico(
    new Date("2025-05-01T14:30:00Z"),
    -31.4201,
    -31.4300,
    -64.1888,
    -64.1900,
    4.8,
    AUTO_DETECTADO
  ),
  new EventoSismico(
    new Date("2025-05-02T08:15:00Z"),
    -34.6037,
    -34.6100,
    -58.3816,
    -58.3900,
    5.2,
    AUTO_CONFIRMADO
  ),
  new EventoSismico(
    new Date("2025-05-03T22:50:00Z"),
    -24.7821,
    -24.7900,
    -65.4232,
    -65.4300,
    3.9,
    AUTO_DETECTADO
  ),
  new EventoSismico(
    new Date("2025-05-04T11:05:00Z"),
    -26.8303,
    -26.8400,
    -65.2038,
    -65.2100,
    4.3,
    AUTO_CONFIRMADO
  ),
  new EventoSismico(
    new Date("2025-05-05T17:40:00Z"),
    -38.0055,
    -38.0100,
    -57.5426,
    -57.5500,
    4.6,
    AUTO_DETECTADO
  )
]
