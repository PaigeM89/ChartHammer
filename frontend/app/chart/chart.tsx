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

interface TableRowProps {
    text: string
}

function RowHeader( { text } : TableRowProps) {
    return (
        <th scope="row" className="w-24 h-16 border border-grey-300">
            {text}
        </th>
    )
}

interface TableNumberCell {
    value : number
}

function NumberCell( { value } : TableNumberCell) {
    return (
        <td className="w-20 h-16 border border-grey-300 text-center align-middle">
            {value}
        </td>
    )
}

function HitsCell( { NaturalHits, SustainedHits, AutoWounds, HitNaturalOnes }: HitsResponse) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Natural Hits" />
                        <NumberCell value={NaturalHits} />
                    </tr>
                    <tr>
                        <RowHeader text="Sustained Hits" />
                        <NumberCell value={SustainedHits} />
                    </tr>
                    <tr>
                        <RowHeader text="Auto Wounds" />
                        <NumberCell value={AutoWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Natural Ones" />
                        <NumberCell value={HitNaturalOnes} />
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function DataTable() {
    const queryClient = useQueryClient()

    const { isPending, error, data, isFetching } = useQuery( {  queryKey: ['simulation'], queryFn: getSimulationData })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if(!data) return 'Error fetching data'

    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Attacks" />
                        <NumberCell value={data.AttackCount} />
                    </tr>
                    <tr>
                        <RowHeader text="Hits" />
                        <HitsCell 
                            NaturalHits={data.Hits.NaturalHits}
                            SustainedHits={data.Hits.SustainedHits}
                            AutoWounds={data.Hits.AutoWounds}
                            HitNaturalOnes={data.Hits.HitNaturalOnes}
                        />
                    </tr>
                    <tr>
                        <RowHeader text="Devastating Wounds" />
                        <NumberCell value={data.DevastatingWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Regular Wounds" />
                        <NumberCell value={data.RegularWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Unsaved Wounds" />
                        <NumberCell value={data.UnsavedWoundCount} />
                    </tr>
                    <tr>
                        <RowHeader text="Mortal Wounds" />
                        <NumberCell value={data.MortalWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Damage Total" />
                        <NumberCell value={data.DamageTotal} />
                    </tr>
                    <tr>
                        <RowHeader text="Models Destroyed" />
                        <NumberCell value={data.ModelsDestroyed} />
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export function ChartRoot() {
    return (
        <QueryClientProvider client={queryClient}>
            <DataTable />
        </QueryClientProvider>
    );
} 