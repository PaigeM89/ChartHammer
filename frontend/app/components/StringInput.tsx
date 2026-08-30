import { useId } from "react";

interface StringInputProps {
    label : string;
    value: string;
    onUpdate: (updatedValue : string) => void;
    disabled?: boolean;
}

export function StringInput( {label, value, onUpdate, disabled = false } : StringInputProps) {
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
                disabled={disabled}
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-colors duration-200
           bg-white text-gray-900 border-gray-300 placeholder-gray-400
           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
           dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder-gray-500
           dark:focus:border-blue-500 dark:focus:ring-blue-500/30
           disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
            />
        </div>
    )
}