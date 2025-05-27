import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 pt-0">
      <div className="w-full max-w-4xl p-8 mt-10 space-y-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-slate-800">Centro de Control de Red Sísmica</h1>
        <p className="text-slate-600">
          Esta plataforma permite al personal autorizado revisar los eventos sísmicos auto detectados.
        </p>
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-md p-6 transition-all border rounded-lg shadow-sm bg-slate-50 border-slate-200 hover:shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-slate-800">Resultado de revisión manual</h2>
            <p className="mb-4 text-slate-600">
              Registrar la aprobación, rechazo o derivación de un sismo registrado automáticamente.
            </p>
            <Link to="/eventos-sismicos">
              <Button className="w-full cursor-pointer">Registrar resultado de revisión manual</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
