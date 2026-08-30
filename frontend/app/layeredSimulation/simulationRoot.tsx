import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import type {
    SimRequest,
    SimResult
} from '../sharedSimulation/types'

const queryClient = new QueryClient();

async function getSimulationData(simRequest : SimRequest) {
    const response = await fetch(
        'http://localhost:5000/simulate',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(simRequest)
        }
    )
    const data = await response.json()

    return data as SimResult;
}

// const simRequestQueryAtom = atomWithQuery((get) => ({
//         queryKey: [ "simulation" ],
//         queryFn: () => getSimulationData(get(simRequestAtom))
//     }))

// function SimulationResults() {
//     const isDebouncing = useAtomValue(isAnyDebouncing)
//     const { data, isPending, isError } = useAtomValue(simRequestQueryAtom)
//     if (isPending) return 'Loading...'
//     if (isError) return 'An error has occurred'
//     if (!data) return 'Failed to parse response'
//     return (
//         <div className="pl-4">
//             <SimResultsBarChart simResults={data} isLoading={isDebouncing || isPending} />
//             <DataTableHorizontal simResults={data} />
//         </div>
//     );
// }

export function LayeredSimulationRoot() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex justify-center items-center">
                Coming soon!
            </div>
        </QueryClientProvider>
    );
}

