import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import type { EventoSismico } from "@/lib/types"

interface EventCardProps {
  evento: EventoSismico
}

export default function EventCard({ evento }: EventCardProps) {
  const formattedDate = new Date(evento.fechaHora).toLocaleString()

  return (
    <Card className="overflow-hidden p-0 transition-all hover:shadow-md" >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{formattedDate}</h3>
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
              {evento.magnitud}
            </p>
          </div>
        </div>

      </CardContent>
      <CardFooter className="px-6 py-4 bg-slate-50">
        <Button onClick={() => console.log(evento.fechaHora)} className="w-full cursor-pointer" >
          Ver detalle
        </Button>
      </CardFooter>
    </Card>
  )
}
