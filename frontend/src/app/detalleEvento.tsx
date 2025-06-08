import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventoSismico } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import axios from "axios"
import { Check, X, BrainIcon, ArrowLeft, CheckCircle2, XCircle, Lock, MapPin, Map, Activity, Calendar, Radio } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { formatoFecha } from "@/lib/formatoFecha"

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

  const getEstadoActual = () => {
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
                  <CardDescription>ID: {eventoSismico.evento.id}</CardDescription>
                </div>
                {getEstadoActual()}
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500">Datos del Evento Sismico</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Fecha y Hora de Ocurriencia</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{new Date(eventoSismico.evento.fechaHora).toLocaleString("es-AR", formatoFecha).replace(',', ' -')}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Magnitud</p>
                        <p className="font-medium">{eventoSismico.evento.valorMagnitud.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Epicentro</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">
                            {eventoSismico.evento.ubicacion.latitudEpicentro.toFixed(4)}, {eventoSismico.evento.ubicacion.longitudEpicentro.toFixed(4)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Profundidad</p>
                        <p className="font-medium">{eventoSismico.datosEvento.profundidad} km</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500">Clasificación</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* <div> */}
                      {/*   <p className="text-sm text-slate-500">Alcance</p> */}
                      {/*   <p className="font-medium">{eventoSismico..scope}</p> */}
                      {/* </div> */}
                      <div>
                        <p className="text-sm text-slate-500">Clasificación</p>
                        <p className="font-medium">{eventoSismico.datosEvento.clasificacion.nombre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Origen de Generación</p>
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
                <CardTitle>Series Temporales</CardTitle>
                <CardDescription>Conjunto de muestras sísmicas tomadas en determinados instantes de tiempo y ordenadas cronológicamente.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={eventoSismico.datosEvento.estacionesSismologicas[0]?.codigoEstacion}>
                  <TabsList className="mb-4">
                    {eventoSismico.datosEvento.estacionesSismologicas.map((estacion) => (
                      <TabsTrigger key={estacion.codigoEstacion} value={estacion.codigoEstacion}>
                        {estacion.nombre}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {eventoSismico.datosEvento.estacionesSismologicas.map((estacion) => (
                    <TabsContent key={estacion.codigoEstacion} value={estacion.codigoEstacion} className="flex flex-col gap-2">
                      {eventoSismico.datosEvento.seriesTemporales.map((serie) => (
                        <Card key={serie.fechaHoraInicioRegistroMuestras.toString()} className={`border-l-4 ${serie.condicionAlarma ? "border-l-red-500" : "border-l-green-500"} `}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Radio className={`h-5 w-5 ${serie.condicionAlarma ? "text-red-600" : "text-green-600"}`} />
                                <h3 className="font-semibold">{serie.fechaHoraInicioRegistroMuestras.toString()}</h3>
                                <Badge variant="outline">{serie.frecuenciaMuestreo} Hz</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
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

