// src/pages/PortalFacturacionTemplate.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Usaremos iconos consistentes y de alta calidad
import { TicketIcon, QrCodeIcon } from '@heroicons/react/24/outline';

// --- COMPONENTE PRINCIPAL ---
/**
 * PortalFacturacionTemplate - Rediseñado para máxima claridad, confianza y facilidad de uso para el cliente final.
 * * Estrategia de UX/UI:
 * 1.  Enfoque en la Tarea Única: Se abandona el layout de página web y se adopta un diseño de "kiosco"
 * con una tarjeta de acción central. Esto elimina toda distracción y enfoca al usuario en su único objetivo: ingresar el ticket.
 * 2.  Guía Visual Proactiva: El principal problema del usuario ("¿qué número pongo?") se resuelve con
 * una ilustración de un ticket que muestra dónde encontrar el dato. Esto reduce la fricción y las solicitudes de soporte.
 * 3.  Branding Moderno y Sutil: El color primario del restaurante se usa como acento en botones e
 * iconos, no como un fondo completo. Esto da un resultado más elegante y profesional.
 * 4.  Señales de Confianza Múltiples: La información de contacto del restaurante y un distintivo
 * "Powered by NextManager" aseguran al usuario que está en un portal legítimo y seguro.
 */
const PortalFacturacionTemplate = ({
    // Proporcionamos valores por defecto para poder visualizar el componente de forma aislada
    logo = 'https://tailwindui.com/img/logos/mark.svg?color=white',
    nombreRestaurante = 'El Sazón Porteño',
    colorPrimario = '#005DAB', // Un azul corporativo como default
    textoHero = 'Genera tu factura en segundos',
    datosRestaurante = {
        direccion: 'Av. Siempre Viva 742, Springfield',
        telefono: '555-123-4567',
        correo: 'contacto@elsazon.com'
    }
}) => {
    const [ticket, setTicket] = useState('');

    // La lógica de búsqueda permanece igual, pero podría ser más compleja en el futuro
    const handleBuscarTicket = (e) => {
        e.preventDefault();
        if (!ticket) {
            alert('Por favor, ingresa un número de ticket.');
            return;
        }
        alert(`Buscando ticket: ${ticket}`);
        // Aquí llamarías a la API para verificar el ticket y mostrar el siguiente paso.
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900">
            {/* Header simple con el logo del restaurante */}
            <header className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto flex justify-center lg:justify-start">
                    {logo && <img src={logo} alt={`Logo de ${nombreRestaurante}`} className="h-10 w-auto" />}
                </div>
            </header>

            {/* Contenido Principal Centrado */}
            <main className="flex-grow flex items-center justify-center p-4">
                <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Tarjeta de Acción Principal */}
                    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 sm:p-10">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{nombreRestaurante}</h1>
                            <p className="mt-3 text-lg text-gray-600 dark:text-slate-300">{textoHero}</p>
                        </div>

                        {/* Formulario de Búsqueda */}
                        <form onSubmit={handleBuscarTicket} className="mt-8 space-y-6">
                            <div className="relative">
                                <label htmlFor="ticket" className="sr-only">Número de Ticket</label>
                                <TicketIcon className="pointer-events-none w-6 h-6 absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400" />
                                <input
                                    type="text"
                                    id="ticket"
                                    value={ticket}
                                    onChange={(e) => setTicket(e.target.value)}
                                    placeholder="Ingresa el número de tu ticket"
                                    className="w-full text-lg pl-14 pr-4 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all"
                                    style={{ '--tw-ring-color': colorPrimario }}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-lg font-semibold text-white py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                                style={{ backgroundColor: colorPrimario }}
                            >
                                Buscar Ticket
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
                            o
                        </div>

                        <button
                            type="button"
                            className="w-full mt-6 text-lg font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                            <QrCodeIcon className="w-6 h-6"/>
                            Escanear Código QR
                        </button>
                    </div>

                    {/* Guía Visual del Ticket */}
                    <div className="mt-8 text-center p-4 bg-gray-100 dark:bg-slate-800/30 rounded-2xl">
                         <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">¿Dónde encuentro el número?</h3>
                         <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Busca en tu ticket de compra un número similar a este:</p>
                         <div className="mt-3 p-3 bg-white dark:bg-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg inline-block">
                             <p className="font-mono text-base text-gray-900 dark:text-white">TICKET: <span className="p-1 rounded" style={{ backgroundColor: `${colorPrimario}20`, color: colorPrimario }}>A25-B7C91</span></p>
                         </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-8 mt-auto text-center text-sm text-gray-500 dark:text-slate-500">
                <div className="container mx-auto px-4">
                    <p className="font-semibold text-base text-gray-700 dark:text-slate-300">{nombreRestaurante}</p>
                    {datosRestaurante && (
                        <div className="mt-2 space-y-1">
                            <p>{`Dirección: ${datosRestaurante.direccion}`}</p>
                            <p>{`Tel: ${datosRestaurante.telefono} | Correo: ${datosRestaurante.correo}`}</p>
                        </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
                        <p>
                            Portal de facturación <span className="font-semibold" style={{ color: colorPrimario }}>Powered by NextManager</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PortalFacturacionTemplate;
