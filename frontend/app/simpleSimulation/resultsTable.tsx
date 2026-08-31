import type {
    HitsResult,
    SimResult,
    WoundsResult
} from '../sharedSimulation/types'

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

interface NumberWithVarianceCellProps {
    value : number
    variance : number
}

function NumberWithVarianceCell ( {value, variance } : NumberWithVarianceCellProps) {
    return (
        <td className="border border-grey-300 w-20 h-16 flex flex-col items-center w-20 h-16 text-center align-middle justify-center">
            <span>
                {value.toFixed(4)}
            </span>
            
            <span className="text-xs">
                ±{variance.toFixed(4)}
            </span>
        </td>
    )
}

interface TableNumberCell {
    value : number
}

function NumberCell( { value } : TableNumberCell) {
    return (
        <td className="w-20 h-16 border border-grey-300 text-center align-middle">
            {value.toFixed(4)}
        </td>
    )
}

interface HitsCellProps {
    HitsResult : HitsResult
    HitsVariance : number
}

function HitsCell( { HitsResult, HitsVariance }: HitsCellProps) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Natural Hits" />
                        <NumberCell value={HitsResult.NaturalHits} />
                    </tr>
                    <tr>
                        <RowHeader text="Sustained Hits" />
                        <NumberCell value={HitsResult.SustainedHits} />
                    </tr>
                    <tr>
                        <RowHeader text="Auto Wounds" />
                        <NumberCell value={HitsResult.AutoWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Total Hits" />
                        <NumberWithVarianceCell value={HitsResult.NaturalHits + HitsResult.SustainedHits} variance={HitsVariance} />
                    </tr>
                    <tr>
                        <RowHeader text="Rerolls" />
                        <NumberCell value={HitsResult.Rerolls} />
                    </tr>
                    <tr>
                        <RowHeader text="Natural Ones" />
                        <NumberCell value={HitsResult.NaturalOnes} />
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

interface WoundsCellProps {
    woundsResult : WoundsResult,
    woundsVariance : number
}

function WoundsCell( { woundsResult, woundsVariance } : WoundsCellProps) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Regular Wounds" />
                        <NumberCell value={woundsResult.RegularWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Devastating Wounds" />
                        <NumberCell value={woundsResult.DevastatingWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Total Wounds" />
                        <NumberWithVarianceCell 
                            value={woundsResult.DevastatingWounds + woundsResult.RegularWounds}
                            variance={woundsVariance}
                        />
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

interface DataTableProps {
    simResults : SimResult
}

function DamageCell( { simResults } : DataTableProps) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Normal Damage" />
                        <NumberCell value={simResults.DamageTotal} />
                    </tr>
                    <tr>
                        <RowHeader text="Mortal Wounds" />
                        <NumberCell value={simResults.MortalWounds} />
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export function DataTableHorizontal ( { simResults } : DataTableProps) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <thead>
                    <tr>
                        <th scope='col'>Attacks</th>
                        <th scope='col'>Hits</th>
                        <th scope='col'>Wounds</th>
                        <th scope='col'>Unsaved Wounds</th>
                        <th scope='col'>Damage</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <NumberWithVarianceCell value={simResults.AttackCount} variance={simResults.Variance?.AttacksVariance ?? 0.0} />
                        <td>
                            <HitsCell 
                                HitsResult={simResults.Hits}
                                HitsVariance={simResults.Variance?.HitsVariance ?? 0.0}
                            />
                        </td>
                        <td>
                            <WoundsCell woundsResult={simResults.Wounds} woundsVariance={simResults.Variance?.WoundsVariance ?? 0.0} />
                        </td>
                        <NumberCell value={simResults.UnsavedWounds} />
                        <td>
                            <DamageCell simResults={simResults} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export function DataTable( { simResults } : DataTableProps ) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Attacks" />
                        <NumberWithVarianceCell value={simResults.AttackCount} variance={simResults.Variance?.AttacksVariance ?? 0.0} />
                    </tr>
                    <tr>
                        <RowHeader text="Hits" />
                        <td>
                            <HitsCell 
                                HitsResult={simResults.Hits}
                                HitsVariance={simResults.Variance?.HitsVariance ?? 0.0}
                            />
                        </td>
                    </tr>
                    <tr>
                        <RowHeader text="Mortal Wounds" />
                        <NumberCell value={simResults.MortalWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Damage Total" />
                        <NumberCell value={simResults.DamageTotal} />
                    </tr>
                    <tr>
                        <RowHeader text="Models Destroyed" />
                        <NumberCell value={simResults.ModelsDestroyed} />
                    </tr>
                </tbody>
            </table>
        </div>
    )
}