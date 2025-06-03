import Estado from "../models/Estado";

export const ESTADOS = {
  auto_confirmado: new Estado("EventoSismico", "auto_confirmado"),
  auto_detectado: new Estado("EventoSismico", "auto_detectado"),
  pendiente_de_revision: new Estado("EventoSismico", "pendiente_de_revision"),
  bloqueado_en_revision: new Estado("EventoSismico", "bloqueado_en_revision"),
}
