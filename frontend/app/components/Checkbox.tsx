import { useId } from "react";

interface CheckboxProps {
    label : string;
    value : boolean;
    onUpdate: (updatedValue : boolean) => void;
    disabled?: boolean
}

export function Checkbox( {label, value, onUpdate, disabled = false } : CheckboxProps) {
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
        <div className="flex w-full max-w-sm ">
            <input id={inputId} type="checkbox" checked={value} onChange={handleChange} disabled={disabled}
                className="disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                />
            
            <label htmlFor={inputId}
                className="pl-2 pt-2 block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            
        </div>
    )
}