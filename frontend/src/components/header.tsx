import { Link } from "react-router";
import logo from "@/assets/utn-logo.png"

export default function Header() {
  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="px-3 flex flex-row items-center justify-between w-full">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="UTN"
              className="h-20"
            />
          </Link>
        </div>
        <div className="text-right pr-2">
          <h1 className="text-lg font-bold tracking-tight text-slate-800">
            Proyecto Práctico de Aplicación Integrador:
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-red-600">RED SÍSMICA</h2>
        </div>
      </div>
    </header>
  )
}
