import EventCard from "@/components/events-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EventoSismico } from "@/lib/types"
import axios from "axios"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"

export default function osSismicos() {
  const [eventos, setEventos] = useState<EventoSismico[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEventos = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/eventos-sismicos")
      setEventos(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventos()
  }, [])

  return (
    <div className="container py-4 mx-auto max-w-7xl">
      <div className="flex items-center mb-6 space-x-2">
        <Link to="/">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Eventos Sísmicos</h1>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : eventos.length === 0 ? (
        <div className="p-8 text-center">
          <h2 className="text-xl font-medium text-slate-700">No hay eventos encontrados</h2>
          <p className="mt-2 text-slate-500">No hay eventos sísmicos en el sistema.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {eventos.map((evento) => (
            <EventCard key={evento.magnitud} evento={evento} />
          ))}
        </div>
      )}
    </div>
  )
}

