import { useId } from "react";
import { attacksAtom, toHitAtom } from "./simulationAtoms";
import { useAtom, useAtomValue } from "jotai";
import { useSetAtom } from "jotai";

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

interface StringInputProps {
    label : string;
    value: string;
    onUpdate: (updatedValue : string) => void;
}

function StringInput( {label, value, onUpdate } : StringInputProps) {
    const inputId = useId();

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        onUpdate(newValue);
    }

    return (
        <div className="flex">
            <label htmlFor={inputId}>{label}</label>
            <input id={inputId} type="text" value={value} onChange={handleChange} />
        </div>
    )
}

export function SimInput() {
    const attacksValue = useAtomValue(attacksAtom.currentValueAtom)
    const setAttacks = useSetAtom(attacksAtom.debouncedValueAtom)
    const [ toHit, setToHit ] = useAtom(toHitAtom)

    return (
        <div>
            <StringInput label="Attacks" value={attacksValue} onUpdate={(v) => setAttacks(v)} />
            <NumericInput label="To Hit" value={toHit} onUpdate={(v) => setToHit(v)} />
        </div>
    )
}

