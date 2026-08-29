import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { testData } from './chartTypes'
import type {
    HitsResponse,
    ChartResponse
} from './chartTypes'
import { DataTable } from './resultsTable'
import { SimResultsBarChart } from './chart';

const queryClient = new QueryClient();

async function getSimulationData() {
    const response = await fetch(
        'http://localhost:5000/simulate',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        }
    )
    const data = await response.json()

    return data as ChartResponse;
}

function SimulationResults() {
    const { isPending, error, data, isFetching } = useQuery( 
        {   queryKey: ['simulation'], 
            queryFn: getSimulationData 
        });

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(!data) return 'Error fetching data'

    return (
        <div>
            <SimResultsBarChart simResults={data} />
            <DataTable simResults={data} />
        </div>
    );
}

export function SimulationRoot() {
    return (
        <QueryClientProvider client={queryClient}>
            <SimulationResults />
        </QueryClientProvider>
    );
} 