import type {
    HitsResult,
    SimResult
} from './simulationTypes'

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

function HitsCell( { NaturalHits, SustainedHits, AutoWounds, HitNaturalOnes }: HitsResult) {
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


interface DataTableProps {
    simResults : SimResult
}

function WoundsCell( { simResults } : DataTableProps) {
    return (
        <div className="grid place-content-center">
            <table className="table-fixed">
                <tbody>
                    <tr>
                        <RowHeader text="Regular Wounds" />
                        <NumberCell value={simResults.RegularWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Devastating Wounds" />
                        <NumberCell value={simResults.DevastatingWounds} />
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
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <NumberCell value={simResults.AttackCount} />
                        </td>
                        <td>
                            <HitsCell 
                                NaturalHits={simResults.Hits.NaturalHits}
                                SustainedHits={simResults.Hits.SustainedHits}
                                AutoWounds={simResults.Hits.AutoWounds}
                                HitNaturalOnes={simResults.Hits.HitNaturalOnes}
                            />
                        </td>
                        <td>
                            <WoundsCell simResults={simResults}></WoundsCell>
                        </td>
                        <td>
                            <NumberCell value={simResults.UnsavedWoundCount} />
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
                        <NumberCell value={simResults.AttackCount} />
                    </tr>
                    <tr>
                        <RowHeader text="Hits" />
                        <td>
                            <HitsCell 
                                NaturalHits={simResults.Hits.NaturalHits}
                                SustainedHits={simResults.Hits.SustainedHits}
                                AutoWounds={simResults.Hits.AutoWounds}
                                HitNaturalOnes={simResults.Hits.HitNaturalOnes}
                            />
                        </td>
                    </tr>
                    <tr>
                        <RowHeader text="Devastating Wounds" />
                        <NumberCell value={simResults.DevastatingWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Regular Wounds" />
                        <NumberCell value={simResults.RegularWounds} />
                    </tr>
                    <tr>
                        <RowHeader text="Unsaved Wounds" />
                        <NumberCell value={simResults.UnsavedWoundCount} />
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