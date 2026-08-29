import { useId } from "react";
import { toHitAtom } from "./simulationAtoms";
import { useAtom } from "jotai";

interface NumericInputProps {
    value : number;
    label : string;
    onUpdate: (updatedValue : number) => void;
}

function NumericInput( { label, value, onUpdate } : NumericInputProps) {
    const inputId = useId();

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.valueAsNumber;
        if (newValue)
        {
            console.log('new numeric input value', newValue)
            onUpdate(newValue);
        }
    }

    return (
        <div className="flex">
            <label htmlFor={inputId}>{label}</label>
            <input id={inputId} type="number" value={value} onChange={handleChange} />
        </div>
    )
}

export function SimInput() {
    const [ toHit, setToHit ] = useAtom(toHitAtom)

    return (
        <div>
            <NumericInput label="To Hit" value={toHit} onUpdate={(v) => setToHit(v)} />
        </div>
    )
}

