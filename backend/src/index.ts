import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import GestorRevisionSismos from './controllers/GestorRevisionSismos'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

const gestor = new GestorRevisionSismos()

app.get('/eventos-sismicos', (req: express.Request, res: express.Response) => {
  gestor.actualizarEstado()
  const eventosSismicos = gestor.obtenerEventosSismicosNoRevisados()

  if (eventosSismicos.length === 0) {
    res.status(404).json({ message: "No hay eventos sísmicos" })
  }

  res.json(eventosSismicos)
})

app.get('/eventos-sismicos/:id', (req: express.Request, res: express.Response) => {
  const id = req.params.id
  const evento = gestor.obtenerEventoPorId(id)

  if (!evento) {
    res.status(404).json({ message: "Evento no encontrado" })
  }

  res.json(evento)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

