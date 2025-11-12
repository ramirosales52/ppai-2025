import EventoSismico from "../models/EventoSismico"
import Usuario from "../models/Usuario"
import { cargarEventosSismicos, cargarUsuarios } from "./repositories"

export let eventosSismicos: EventoSismico[] = []
export let usuarios: Usuario[] = []

export async function inicializarDatos() {
  const eventosDB = await cargarEventosSismicos()
  const usuariosDB = await cargarUsuarios()
  
  eventosSismicos.push(...eventosDB)
  usuarios.push(...usuariosDB)
}

