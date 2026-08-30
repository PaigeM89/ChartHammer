import { useAtom } from "jotai"
import { CurrentTab, currentTabAtom } from "~/globalAtoms"


export function Header() {
    const [currentTabValue, setCurrentTab ] = useAtom(currentTabAtom)
    return (
        <header>
            <div className="flex items-center justify-center pt-4 pb-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                    ChartHammer
                </h1>
            </div>
            <div className="flex items-center justify-center pb-2">
                <p className="mt-2 text-sm text-gray-200">
                    A lightweight Warhammer 40k attack simulator
                </p>
            </div>
            <nav className="hidden">
                <ul className="flex space-x-4">
                    <li>
                        <button 
                            className="hover:text-primary transition-colors duration-300"
                            onClick={() => setCurrentTab(CurrentTab.Simple)}
                        >
                                Simple Sim
                        </button>
                    </li>
                    <li>
                        <button 
                            className="hover:text-primary transition-colors duration-300"
                            onClick={() => setCurrentTab(CurrentTab.Layered)}
                        >
                            Layered Sim
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}