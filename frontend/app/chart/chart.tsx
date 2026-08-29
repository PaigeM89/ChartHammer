import {
    useQuery,
    QueryClient,
    useQueryClient,
    QueryClientProvider
} from '@tanstack/react-query'
import { testData } from './chartTypes'
import type {
    HitsResponse,
    ChartResponse
} from './chartTypes'

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

function DataTable() {
    const queryClient = useQueryClient()

    const { isPending, error, data, isFetching } = useQuery( {  queryKey: ['simulation'], queryFn: getSimulationData })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(!data) return 'Error fetching data'

    return (
        <table>
            <tbody>
                <tr>
                    <th scope="row">Attacks</th>
                    <td>{data.AttackCount}</td>
                </tr>
            </tbody>
        </table>
    )
}

export function ChartRoot() {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable />
        </QueryClientProvider>
    );
}