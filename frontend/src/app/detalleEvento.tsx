import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { EventoSismico } from "@/lib/types"
import axios from "axios"
import { Check, X, BrainIcon, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"

export default function DetalleEvento() {
  const { id } = useParams()
  const [evento, setEvento] = useState<EventoSismico | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchEvento = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:3000/eventos-sismicos/${id}`)
      setEvento(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvento()
  }, [id])

  if (!evento) return

  return (
    <>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="container py-4 mx-auto max-w-7xl">
          <div className="flex items-center mb-6 space-x-2">
            <Link to="/eventos-sismicos">
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Revisión evento sísmico</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revisión</CardTitle>
              <CardDescription>
                {evento.estadoActual.nombreEstado === "auto_detectado" || evento.estadoActual.nombreEstado === "pendiente_de_revision"
                  ? "Seleccionar una acción para completar la revisión."
                  : "Este evento ya fue revisado."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evento.estadoActual.nombreEstado === "auto_detectado" || evento.estadoActual.nombreEstado === "pendiente_de_revision" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Button
                    className="flex items-center justify-center gap-2 h-14 cursor-pointer"
                    onClick={() => { }}
                  >
                    <Check />
                    Confirmar evento
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center justify-center gap-2 h-14 cursor-pointer"
                    onClick={() => { }}
                  >
                    <X />
                    Rechazar evento
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-14 cursor-pointer"
                    onClick={() => { }}
                  >
                    <BrainIcon />
                    Solicitar revisión a experto
                  </Button>
                </div>
              ) : (
                <div className="p-4 text-center border rounded-md bg-slate-50">
                  <p className="text-slate-600">
                    This evento has been marked as{" "}
                    <span className="font-semibold">
                      {evento.estadoActual.nombreEstado === "confirmado"
                        ? "confirmado"
                        : evento.estadoActual.nombreEstado === "rechazado"
                          ? "rechazado"
                          : "requiring expert review"}
                    </span>
                    .
                  </p>
                  <Link to="/eventos-sismicos">
                    <Button variant="outline" className="mt-4 cursor-pointer">
                      Volver
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      )}
    </>
  )
}

