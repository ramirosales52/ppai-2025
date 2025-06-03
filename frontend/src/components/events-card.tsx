import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Brain, CheckCircle2, XCircle } from "lucide-react"
import type { EventoSismico } from "@/lib/types"
import { Link } from "react-router"

interface EventCardProps {
  evento: EventoSismico
}

export default function EventCard({ evento }: EventCardProps) {

  const getEstado = () => {
    switch (evento.estadoActual.nombreEstado) {
      case "confirmado":
        return (
          <Badge className="w-full flex justify-start gap-1 bg-green-500">
            <CheckCircle2 className="w-3 h-3" />
            Confirmado
          </Badge>
        )
      case "rechazado":
        return (
          <Badge className="w-full flex justify-start gap-1 bg-red-500">
            <XCircle className="w-3 h-3" />
            Rechazado
          </Badge>
        )
      case "revision_experto":
        return (
          <Badge className="w-full flex justify-start gap-1 bg-amber-500">
            <Brain className="w-3 h-3" />
            Revisión de Experto
          </Badge>
        )
      case "pendiente_de_revision":
        return (
          <Badge className=" w-full flex justify-start gap-1 bg-blue-500">
            <Activity className="w-3 h-3" />
            Pendiente de Revisión
          </Badge>
        )
      default:
        return (
          <Badge className="w-full flex gap-1 justify-start bg-blue-500">
            <Activity className="w-3 h-3" />
            Auto Detectado
          </Badge>
        )
    }
  }

  return (
    <Card className="overflow-hidden p-0 transition-all hover:shadow-md" >
      <CardContent className="p-6">
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{evento.fechaHora.toString()}</h3>
                <p className="text-sm text-slate-500">ID: {evento.id}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full" >
                <Activity className="w-5 h-5 text-red-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <p className="text-sm text-slate-950">Epicentro</p>
                <p className="font-medium flex gap-4 text-sm">
                  <span className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs">lat:</span>
                    {evento.ubicacion.latitudEpicentro.toFixed(4)}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs">long:</span>
                    {evento.ubicacion.longitudEpicentro.toFixed(4)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-950">Hipocentro</p>
                <p className="font-medium flex gap-4 text-sm">
                  <span className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs">lat:</span>
                    {evento.ubicacion.latitudHipocentro.toFixed(4)}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-slate-500 text-xs">long:</span>
                    {evento.ubicacion.longitudHipocentro.toFixed(4)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-950">Magnitud</p>
                <p className="font-medium">
                  {evento.valorMagnitud}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>{getEstado()}</div>

      </CardContent>
      <CardFooter className="px-6 py-4 bg-slate-50">
        <Link to={`/eventos-sismicos/${evento.id}`} className="w-full">
          <Button className="w-full cursor-pointer">Revisar evento</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
