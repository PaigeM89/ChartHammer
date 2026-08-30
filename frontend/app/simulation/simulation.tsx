import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import type {
    SimRequest,
    SimResult
} from './simulationTypes'
import { DataTable, DataTableHorizontal } from './resultsTable'
import { SimResultsBarChart } from './chart';
import { SimInput } from './simInput';
import { isAnyDebouncing, simRequestAtom } from "./simulationAtoms";
import { useAtomValue } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';

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

const simRequestQueryAtom = atomWithQuery((get) => ({
        queryKey: [ "simulation" ],
        queryFn: () => getSimulationData(get(simRequestAtom))
    }))

function SimulationResults() {
    const isDebouncing = useAtomValue(isAnyDebouncing)
    const { data, isPending, isError } = useAtomValue(simRequestQueryAtom)
    if (isPending) return 'Loading...'
    if (isError) return 'An error has occurred'
    if (!data) return 'Failed to parse response'
    return (
        <div>
            <SimResultsBarChart simResults={data} isLoading={isDebouncing || isPending} />
            <DataTableHorizontal simResults={data} />
        </div>
    );
}

export function SimulationRoot() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex justify-center items-center">
                <SimInput />
                <SimulationResults />
            </div>
        </QueryClientProvider>
    );
}

