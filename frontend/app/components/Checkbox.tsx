import { useId } from "react";

interface CheckboxProps {
    label : string;
    value : boolean;
    onUpdate: (updatedValue : boolean) => void;
}

export function Checkbox( {label, value, onUpdate } : CheckboxProps) {
    const inputId = useId();
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        if (newValue)
        {
            onUpdate(true);
        }
        else
        {
            onUpdate(false);
        }
    }

    return (
        <div className="flex w-full max-w-sm">
            <input id={inputId} type="checkbox" checked={value} onChange={handleChange} />
            
            <label htmlFor={inputId}
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            
        </div>
    )
}