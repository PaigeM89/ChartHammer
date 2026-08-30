import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { SimulationRoot } from '../simulation/simulation';
import { Header } from "~/header/header";
import { Footer } from "~/footer/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ChartHammer" },
    { name: "description", content: "Warhammer 40k Attack Calculator" },
  ];
}

export default function Home() {
  return (
    <main>
      <Header />
      <SimulationRoot />
      <Footer />
    </main>
  );
}
