// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

// Este hook toma un valor (ej. el texto del input) y un retraso (ej. 500ms)
export const useDebounce = (value, delay) => {
    // Estado para guardar el valor "retrasado"
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Inicia un temporizador para actualizar el valor...
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // ... pero si el 'value' cambia (el usuario sigue escribiendo),
        // limpia el temporizador anterior y crea uno nuevo.
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Solo se re-ejecuta si el valor o el retraso cambian

    return debouncedValue;
};