import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Evento } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import axios from "axios"
import { Check, X, BrainIcon, ArrowLeft, CheckCircle2, XCircle, Lock, MapPin, Map, Activity, Calendar, RadioTower, Clock, Pen } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { formatear, formatoFecha } from "@/lib/formato"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast, Toaster } from "sonner"

export default function DetalleEvento() {
  const { id } = useParams()
  const [eventoSismico, setEventoSismico] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [mostrarMapa, setMostrarMapa] = useState(false)
  const navigate = useNavigate()

  const fetchEvento = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:3000/eventos-sismicos/${id}`)
      setEventoSismico(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvento()
  }, [])

  const tomarSeleccionRechazo = async () => {
    try {
      await axios.post(`http://localhost:3000/eventos-sismicos/${id}`, {
        nuevoEstado: "rechazado"
      })
      await fetchEvento()
      toast.success("Estado actualizado a 'rechazado'")
    } catch (error) {
      console.log(error)
    }
  }

  const tomarSeleccionConfirmado = async () => {
    try {
      await axios.post(`http://localhost:3000/eventos-sismicos/${id}`, {
        nuevoEstado: "confirmado"
      })
      await fetchEvento()
      toast.success("Estado actualizado a 'confirmado'")
    } catch (error) {
      console.log(error)
    }
  }

  const tomarSeleccionDerivado = async () => {
    try {
      await axios.post(`http://localhost:3000/eventos-sismicos/${id}`, {
        nuevoEstado: "derivado_experto"
      })
      await fetchEvento()
      toast.success("Estado actualizado a 'derivado a experto'")
    } catch (error) {
      console.log(error)
    }
  }

  const tomarCancelacion = async () => {
    try {
      await axios.post(`http://localhost:3000/eventos-sismicos/${id}`, {
        nuevoEstado: "cancelado"
      })
      await navigate("/eventos-sismicos")
    } catch (error) {
      console.log(error)
    }
  }

  if (!eventoSismico) return null

  const getEstadoActual = () => {
    if (!eventoSismico) return null

    switch (eventoSismico.datosPrincipales.estadoActual.nombreEstado) {
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
      <Toaster position="top-center" richColors />
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-64" />
        </div>
      ) : (
        <div className="container py-4 mx-auto max-w-7xl">
          {/* --- Boton atras --- */}
          <div className="flex items-center mb-6 space-x-2">
            <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => tomarCancelacion()}>
              <ArrowLeft />
            </Button>
            <h1 className="text-xl font-bold">Revisión evento sísmico</h1>
          </div>
          {/* --- --- */}

          <div className="space-y-6">
            {/* --- Detalles evento --- */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="mb-1">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Detalles del Evento Sísmico
                    </span>
                  </CardTitle>
                  <CardDescription>ID: {eventoSismico.datosPrincipales.id}</CardDescription>
                </div>
                {getEstadoActual()}
              </CardHeader>
              <CardContent>
                <div className="gap-6">
                  <div>
                    <h3 className="mb-2 text-md font-bold text-slate-500">Datos del Evento Sísmico</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Fecha y Hora de Ocurrencia</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {new Date(eventoSismico.datosPrincipales.fechaHoraOcurrencia).toLocaleString("es-AR", formatoFecha).replace(',', ' -')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Epicentro</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">
                            {eventoSismico.datosPrincipales.latitudEpicentro.toFixed(4)}°, {eventoSismico.datosPrincipales.longitudEpicentro.toFixed(4)}°
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Hipocentro</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">
                            {eventoSismico.datosPrincipales.latitudHipocentro.toFixed(4)}°, {eventoSismico.datosPrincipales.longitudHipocentro.toFixed(4)}°
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Alcance</p>
                        <p className="font-medium">{formatear(eventoSismico.datosSismicos.alcance)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Clasificación</p>
                        <p className="font-medium">{formatear(eventoSismico.datosSismicos.clasificacion)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Origen de Generación</p>
                        <p className="font-medium">{formatear(eventoSismico.datosSismicos.origenDeGeneracion)}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
            {/* --- --- */}

            {/* --- Series Temporales --- */}
            <Card>
              <CardHeader>
                <CardTitle>Series Temporales</CardTitle>
                <CardDescription>Conjunto de muestras sísmicas tomadas en determinados instantes de tiempo y ordenadas cronológicamente.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={eventoSismico.seriesTemporales[0].estacion.codigoEstacion}>
                  <TabsList className="mb-1 flex gap-1">
                    {eventoSismico.seriesTemporales.map((estacion, i) => (
                      <TabsTrigger key={i} value={estacion.estacion.codigoEstacion} className="cursor-pointer">
                        <RadioTower /> {estacion.estacion.nombre}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {eventoSismico.seriesTemporales.map((serie, i) => (
                    <TabsContent key={i} value={serie.estacion.codigoEstacion} className="flex flex-col gap-2">
                      <p className="ml-1 text-sm text-slate-500">
                        Ubicación estación: {serie.estacion.latitud}°, {serie.estacion.longitud}°
                      </p>
                      <div className="flex flex-col gap-2">
                        {serie.seriesTemporales.map((serie, i) => (
                          <Card key={i} className={`p-0 py-2 border-l-4 ${serie.condicionAlarma ? "border-red-500" : "border-green-500"}`}>
                            <CardContent className="px-3">
                              <div className="flex gap-20 px-2 pb-1">
                                <div>
                                  <p className="font-medium text-lg flex gap-2 items-center">
                                    <Clock className="w-4 h-4" />
                                    <span>Serie Temporal N° {i + 1}</span>
                                  </p>
                                  <p>
                                    <span className="font-medium">Fecha/Hora inicio: </span>
                                    {new Date(serie.fechaHoraInicioRegistroMuestras).toLocaleString("es-AR", formatoFecha).replace(',', ' -')}
                                  </p>
                                </div>
                                <div>
                                  <p><span className="font-medium">Frecuencia de muestreo:</span> {serie.frecuenciaMuestreo} Hz</p>
                                  <p><span className="font-medium">Alerta de alarma:</span> {serie.condicionAlarma ? "True" : "False"}</p>
                                </div>
                              </div>
                              <Table className="w-full text-sm">
                                <TableHeader>
                                  <TableRow className="border-b">
                                    <TableHead className="text-left p-2 flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Fecha/Hora</span></TableHead>
                                    <TableHead className="text-left p-2">Velocidad</TableHead>
                                    <TableHead className="text-left p-2">Frecuencia</TableHead>
                                    <TableHead className="text-left p-2">Longitud</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {serie.muestraSismica.map((muestra, i) => {
                                    const velocidad = muestra.detalleMuestraSismica.find(
                                      (d) => d.tipoDeDato.denominacion === "Velocidad de onda"
                                    )?.valor ?? "";
                                    const frecuencia = muestra.detalleMuestraSismica.find(
                                      (d) => d.tipoDeDato.denominacion === "Frecuencia de onda"
                                    )?.valor ?? "";
                                    const longitud = muestra.detalleMuestraSismica.find(
                                      (d) => d.tipoDeDato.denominacion === "Longitud de onda"
                                    )?.valor ?? "";

                                    return (
                                      <TableRow key={i} className="border-b">
                                        <TableCell className="font-semibold">
                                          {new Date(muestra.fechaHoraMuestra).toLocaleString("es-AR", formatoFecha).replace(',', ' -')}
                                        </TableCell>
                                        <TableCell className="">{velocidad} Km/seg</TableCell>
                                        <TableCell className="">{frecuencia} Hz</TableCell>
                                        <TableCell className="">{longitud} Km/ciclo</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            {/* --- --- */}

            <Card>
              <CardHeader>
                <CardTitle>Mapa del evento sísmico</CardTitle>
                <CardDescription>Opción para visualizar en un mapa el evento sísmico y las estaciones sismológicas involucradas.</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Button variant="outline" onClick={() => setMostrarMapa(!mostrarMapa)} className="flex items-center gap-2 cursor-pointer">
                    <Map className="w-4 h-4" />
                    {mostrarMapa ? "Ocultar mapa" : "Mostrar mapa"}
                  </Button>
                </div>

                {mostrarMapa && (
                  <div className="bg-gray-100 mt-4 border rounded-md h-72 flex flex-col items-center justify-center">
                    <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2 select-none">Mapa del evento sísmico</p>
                  </div>
                )}

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modificar datos del evento</CardTitle>
                <CardDescription>Permite la modificación de los siguientes datos del evento sísmico: magnitud, alcance y origen de generación.</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                    <Pen className="w-4 h-4" />
                    Modificar Datos
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* --- Botones revision --- */}
            <Card>
              <CardHeader>
                <CardTitle>Revisión</CardTitle>
                <CardDescription>
                  {eventoSismico.datosPrincipales.estadoActual.nombreEstado === "bloqueado_en_revision"
                    ? "Seleccionar una acción para completar la revisión."
                    : "Este evento ya fue revisado."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventoSismico.datosPrincipales.estadoActual.nombreEstado === "bloqueado_en_revision" ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button
                      className="flex items-center justify-center gap-2 h-14 cursor-pointer"
                      onClick={() => tomarSeleccionConfirmado()}
                    >
                      <Check />
                      Confirmar evento
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center justify-center gap-2 h-14 cursor-pointer"
                      onClick={() => tomarSeleccionRechazo()}
                    >
                      <X />
                      Rechazar evento
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2 h-14 cursor-pointer"
                      onClick={() => tomarSeleccionDerivado()}
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
                        {eventoSismico.datosPrincipales.estadoActual.nombreEstado === "confirmado"
                          ? "CONFIRMADO"
                          : eventoSismico.datosPrincipales.estadoActual.nombreEstado === "rechazado"
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
            {/* --- --- */}

          </div>
        </div>
      )}
    </>
  )
}

