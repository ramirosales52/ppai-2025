import { Route, Routes } from "react-router";
import Layout from "./app/layout";
import Home from "./app/home";
import EventosSismicos from "./app/eventosSismicos";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/eventos-sismicos" element={<EventosSismicos />} />
      </Route>
    </Routes>
  );
}
