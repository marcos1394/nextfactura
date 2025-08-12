// src/hooks/useOnScreen.js

import { useState, useEffect, useRef } from 'react';

/**
 * Hook personalizado para detectar si un componente está visible en la pantalla (viewport).
 * @param {object} options - Opciones para el IntersectionObserver (ej. { threshold: 0.5, rootMargin: '0px' }).
 * @returns {[React.RefObject<Element>, boolean]} - Devuelve una referencia para asignar al elemento y un booleano que es `true` si el elemento está en pantalla.
 */
function useOnScreen(options) {
  // `ref` para el elemento que queremos observar.
  const ref = useRef(null);
  
  // `isIntersecting` guardará el estado de si el elemento está visible o no.
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Actualiza nuestro estado cuando el callback del observador se dispara.
      setIntersecting(entry.isIntersecting);
    }, options);

    // Guardamos una referencia al elemento actual para poder limpiarlo después.
    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Función de limpieza que se ejecuta cuando el componente se desmonta.
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, options]); // El efecto se vuelve a ejecutar solo si la referencia o las opciones cambian.

  return [ref, isIntersecting];
}

export default useOnScreen;
