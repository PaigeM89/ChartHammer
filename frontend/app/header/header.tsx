

export function Header() {
    return (
        <header>
            <div className="flex items-center justify-center pt-16 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                    ChartHammer
                </h1>
            </div>
            <div className="flex items-center justify-center pb-4">
                <p className="mt-2 text-sm text-gray-200">
                    A lightweight Warhammer 40k attack simulator
                </p>
            </div>
        </header>
    )
}