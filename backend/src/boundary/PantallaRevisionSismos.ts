import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import GestorRevisionSismos from '../controllers/GestorRevisionSismos'

// -- Configuracion express --
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
// ---------------------------------------- //

// Creacion del gestor
const gestor = new GestorRevisionSismos()

// Iniciar sesion
gestor.iniciarSesion("juan1.p", "123abc")

// Ruta para obtener todos los eventos sismicos auto detectados no revisados
app.get('/eventos-sismicos', (req: express.Request, res: express.Response) => {
  gestor.actualizarAPendienteRevision() // Metodo que actualiza los eventos a pendiente_de_revision automaticamente

  const eventosSismicos = gestor.mostrarEventosSismicosParaSeleccion()

  if (eventosSismicos.length === 0) { // Flujo Alternativo A1
    res.status(404).json({ message: "No hay eventos sísmicos" })
  }

  res.json(eventosSismicos)
})

// Ruta para obtener un evento sismico por id
app.get('/eventos-sismicos/:id', (req: express.Request, res: express.Response) => {
  const id = req.params.id
  const evento = gestor.tomarSeleccionEventoSismico(id)

  if (!evento) {
    res.status(404).json({ message: "Evento no encontrado" })
    return
  }

  try {
    if (
      evento.getEstadoActual().esBloqueadoEnRevision() ||
      evento.getEstadoActual().esConfirmado() ||
      evento.getEstadoActual().esRechazado() ||
      evento.getEstadoActual().esPendienteDeRevision()
    ) { // Esto evita volver a bloquear el evento en caso que sea uno de esos estados
      res.json(evento)
    } else {
      gestor.bloquearEventoSismico(id)
    }
  } catch (error) {
    console.log(error)
  }

  const eventoBloqueado = gestor.tomarSeleccionEventoSismico(id)
  const datosPrincipales = eventoBloqueado?.getDatosPrincipales()
  const datosSismicos = gestor.mostrarDatosEventoSismicoSeleccionado(id)
  const seriesTemporales = gestor.mostrarSeriesTemporalesPorEstacion(id)

  res.json({
    datosPrincipales: datosPrincipales,
    datosSismicos: datosSismicos,
    seriesTemporales: seriesTemporales
  })
})

// Ruta para actualizar el estado del evento
app.post('/eventos-sismicos/:id', (req: express.Request, res: express.Response) => {
  const id = req.params.id
  const { nuevoEstado } = req.body

  try {
    if (nuevoEstado === "rechazado") {
      gestor.rechazarEventoSismico(id)
    } else if (nuevoEstado === "confirmado") {
      gestor.confirmarEventoSismico(id)
    } else {
      gestor.derivarEventoSismico(id)
    }
    res.status(200).json({ message: "Estado actualizado correctamente" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al actualizar el estado" })
  }
})

app.listen(PORT, () => {
  console.log(`${PORT}`)
})

