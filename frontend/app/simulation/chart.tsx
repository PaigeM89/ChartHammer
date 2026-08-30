import { Loader } from 'lucide-react';
import type {
    HitsResult,
    SimResult
} from './simulationTypes'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  createHorizontalChart,
  type TooltipContentProps,
  type TooltipIndex
} from 'recharts';

interface ChartProps {
    simResults : SimResult;
    isLoading? : boolean
}

function totalHits(hitResults : HitsResult) {
    return hitResults.NaturalHits + hitResults.SustainedHits;
}

interface ChartData {
    name: string
    value: number
}

function transformSimResults(simResults : SimResult) {
    const data : ReadonlyArray<ChartData> = 
        [
            { name: "Attacks", value: simResults.AttackCount },
            { name: "Hits", value: totalHits(simResults.Hits) },
            { name: "Wounds", value: simResults.RegularWounds + simResults.MortalWounds },
            { name: "Unsaved Wounds", value: simResults.UnsavedWoundCount }
        ];
    return data;
}

function Chart( { simResults } : ChartProps) {
    const data = transformSimResults(simResults);
    return (
        <div className="flex justify-center items-center w-full">
            <BarChart
                style={{ width: '100%', height: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618}}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid />
                <XAxis height="auto" dataKey="name" />
                <YAxis width="auto" dataKey="value" />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#8884d8" />
            </BarChart>
        </div>
    );
}

export function SimResultsBarChart( { simResults, isLoading=false } : ChartProps) 
{
    return (
        //<div style={{ position: 'relative', width: '100%', height: 300 }}>
        <div>
            {/* Absolute overlay containing the icon */}
            {isLoading && (
                <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                //backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 10
                }}>
                <svg className="animate-spin" width="38" height="38" viewBox="0 0 38 38">
                    <Loader />
                </svg>
                </div>
            )}

            <Chart simResults={simResults} />
        </div>
    )
}