import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import GestorRevisionSismos from '../controllers/GestorRevisionSismos'
import { inicializarDatos } from '../data/data'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const gestor = new GestorRevisionSismos()

async function iniciar() {
  await inicializarDatos()
  gestor.iniciarSesion("juan1.p", "123abc")

  app.listen(PORT, () => {
    console.log(`${PORT}`)
  })
}

iniciar().catch(console.error)

// Ruta para obtener todos los eventos sismicos auto detectados no revisados
app.get('/eventos-sismicos', (_req: express.Request, res: express.Response): void => {
  gestor.actualizarAPendienteRevision()

  const eventosSismicos = gestor.mostrarEventosSismicosParaSeleccion()

  if (eventosSismicos.length === 0) {
    res.status(404).json({ message: "No hay eventos sísmicos" })
    return
  }

  res.json(eventosSismicos)
})

// Ruta para obtener un evento sismico por id
app.get('/eventos-sismicos/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  const id = req.params.id
  const evento = gestor.tomarSeleccionEventoSismico(id)

  if (!evento) {
    res.status(404).json({ message: "Evento no encontrado" })
    return
  }

  try {
    await gestor.cargarDatosCompletosEvento(id)

    if (
      !evento.getEstadoActual().esBloqueadoEnRevision() &&
      !evento.getEstadoActual().esConfirmado() &&
      !evento.getEstadoActual().esRechazado() &&
      !evento.getEstadoActual().esDerivadoExperto()
    ) {
      gestor.bloquearEventoSismico(id)
    }

    const eventoActualizado = gestor.tomarSeleccionEventoSismico(id)
    const datosPrincipales = eventoActualizado?.getDatosPrincipales()
    const datosSismicos = gestor.mostrarDatosEventoSismicoSeleccionado(id)
    const seriesTemporales = gestor.mostrarSeriesTemporalesPorEstacion(id)

    res.status(200).json({
      datosPrincipales,
      datosSismicos,
      seriesTemporales
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error })
  }
})

// Ruta para actualizar el estado del evento
app.post('/eventos-sismicos/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  const id = req.params.id
  const { nuevoEstado } = req.body
  const evento = gestor.tomarSeleccionEventoSismico(id)

  if (!evento) {
    res.status(404).json({ message: "Evento no encontrado" })
    return
  }

  try {
    if (nuevoEstado === "rechazado") {
      gestor.rechazarEventoSismico(id)
    } else if (nuevoEstado === "confirmado") {
      gestor.confirmarEventoSismico(id)
    } else if (nuevoEstado === "derivado_experto") {
      gestor.derivarEventoSismico(id)
    } else {
      if (
        !evento.getEstadoActual().esConfirmado() &&
        !evento.getEstadoActual().esRechazado() &&
        !evento.getEstadoActual().esDerivadoExperto()
      ) {
        gestor.cancelar(id)
      }
    }
    res.status(200).json({ message: "Estado actualizado correctamente" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al actualizar el estado" })
  }
})



