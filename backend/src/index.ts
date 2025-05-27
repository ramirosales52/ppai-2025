import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import GestorRevisionSismos from './controllers/GestorRevisionSismos'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())

const gestor = new GestorRevisionSismos()

app.get('/eventos-sismicos', (req, res) => {
  const eventosSismicos = gestor.obtenerEventosSismicosNoRevisados()
  res.json(eventosSismicos)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})


