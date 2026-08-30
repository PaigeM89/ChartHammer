import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { SimulationRoot } from '../simulation/simulation';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ChartHammer" },
    { name: "description", content: "Warhammer 40k Attack Calculator" },
  ];
}

export default function Home() {
  return (
    <>
      <SimulationRoot />
    </>
  );
}
