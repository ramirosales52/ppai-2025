import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventoSismico } from "@/lib/types"
import axios from "axios"
import { Check, X, BrainIcon, ArrowLeft, CheckCircle2, XCircle, Lock, MapPin, Map, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"

export default function DetalleEvento() {
  const { id } = useParams()
  const [eventoSismico, setEvento] = useState<EventoSismico | null>(null)
  const [loading, setLoading] = useState(true)
  const [mostrarMapa, setMostrarMapa] = useState(false)

  const fetchEvento = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:3000/eventos-sismicos/${id}`)
      setEvento(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvento()
  }, [id])

  if (!eventoSismico) return

  const getStatusBadge = () => {
    if (!eventoSismico) return null

    switch (eventoSismico.evento.estadoActual.nombreEstado) {
      case "confirmado":
        return (
          <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Confirmado
          </Badge>
        )
      case "rechazado":
        return (
          <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500">
            <XCircle className="w-4 h-4 mr-1" />
            Rechazado
          </Badge>
        )
      case "derivado_experto":
        return (
          <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-amber-500">
            <BrainIcon className="w-4 h-4 mr-1" />
            Derivado a experto
          </Badge>
        )
      default:
        return (
          <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500">
            <Lock className="w-4 h-4 mr-1" />
            Bloqueado en Revisión
          </Badge>
        )
    }
  }

  return (
    <>
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-64" />
        </div>
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
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="mb-1">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Detalles del Evento Sísmico
                    </span>
                  </CardTitle>
                  <CardDescription>{eventoSismico.evento.id}</CardDescription>
                </div>
                {getStatusBadge()}
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Date/Time</p>
                        <p className="font-medium">{eventoSismico.evento.fechaHora.toString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Magnitude</p>
                        <p className="font-medium">{eventoSismico.evento.valorMagnitud.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Epicenter</p>
                        <p className="font-medium">
                          {eventoSismico.evento.ubicacion.latitudEpicentro.toFixed(4)}, {eventoSismico.evento.ubicacion.longitudEpicentro.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Depth</p>
                        <p className="font-medium">{eventoSismico.datosEvento.profundidad} km</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500">Classification</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* <div> */}
                      {/*   <p className="text-sm text-slate-500">Scope</p> */}
                      {/*   <p className="font-medium">{eventoSismico..scope}</p> */}
                      {/* </div> */}
                      <div>
                        <p className="text-sm text-slate-500">Classification</p>
                        <p className="font-medium">{eventoSismico.datosEvento.clasificacion.nombre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Origin</p>
                        <p className="font-medium">{eventoSismico.datosEvento.origenDeGeneracion.nombre}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setMostrarMapa(!mostrarMapa)} className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {mostrarMapa ? "Ocultar mapa" : "Mostrar mapa"}
                  </Button>
                </div>

                {mostrarMapa && (
                  <div className="bg-gray-100 mt-4 border rounded-md h-80 flex flex-col items-center justify-center">
                    <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Mapa del evento sísmico</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revisión</CardTitle>
                <CardDescription>
                  {eventoSismico.evento.estadoActual.nombreEstado === "bloqueado_en_revision"
                    ? "Seleccionar una acción para completar la revisión."
                    : "Este evento ya fue revisado."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventoSismico.evento.estadoActual.nombreEstado === "bloqueado_en_revision" ? (
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
                      Este evento ya fue marcado como{" "}
                      <span className="font-semibold">
                        {eventoSismico.evento.estadoActual.nombreEstado === "confirmado"
                          ? "CONFIRMADO"
                          : eventoSismico.evento.estadoActual.nombreEstado === "rechazado"
                            ? "RECHAZADO"
                            : "DERIVADO A EXPERTO"}
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
        </div>
      )}
    </>
  )
}

