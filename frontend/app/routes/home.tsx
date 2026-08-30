import type { Route } from "./+types/home";
import { SimulationRoot } from '../simpleSimulation/simulation';
import { LayeredSimulationRoot } from '../layeredSimulation/simulationRoot';
import { useAtomValue } from "jotai";
import { CurrentTab, currentTabAtom } from "~/globalAtoms";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ChartHammer" },
    { name: "description", content: "Warhammer 40k Attack Calculator" },
  ];
}

function SimpleSimulation() {
  return (
    <main>
      <SimulationRoot />
    </main>
  )
}

function LayeredSimulation() {
   return (
    <main>
      <LayeredSimulationRoot />
    </main>
  )
}

export default function Home() {
  return SimpleSimulation()
  //const currentTab = useAtomValue(currentTabAtom)
  // if (currentTab === CurrentTab.Simple)
  // {
  //   return SimpleSimulation()
  // }
  // else
  // {
  //   return LayeredSimulation();
  // }
}
