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
        <div className="w-full max-w-sm">
            <label htmlFor={inputId}
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <input id={inputId} type="number" value={value} onChange={handleChange} 
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-colors duration-200
           bg-white text-gray-900 border-gray-300 placeholder-gray-400
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500
           dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
            />
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
        <div className="w-full max-w-sm">
            <label htmlFor={inputId}
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <input id={inputId} type="text" value={value} onChange={handleChange} 
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-colors duration-200
           bg-white text-gray-900 border-gray-300 placeholder-gray-400
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500
           dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
            />
        </div>
    )
}

export function SimInput() {
    const attacksValue = useAtomValue(attacksAtom.currentValueAtom)
    const setAttacks = useSetAtom(attacksAtom.debouncedValueAtom)
    //const [ toHit, setToHit ] = useAtom(toHitAtom)
    const toHit = useAtomValue(toHitAtom.currentValueAtom)
    const setToHit = useSetAtom(toHitAtom.debouncedValueAtom)

    return (
        <div>
            <StringInput label="Attacks" value={attacksValue} onUpdate={(v) => setAttacks(v)} />
            <NumericInput label="To Hit" value={toHit} onUpdate={(v) => setToHit(v)} />
        </div>
    )
}

