import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { useThemeContext } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowTrendingUpIcon, BanknotesIcon, DocumentTextIcon, CubeIcon, ShoppingCartIcon, ExclamationTriangleIcon, // <-- AÑADIR
    ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth'; // O la ruta correcta a tu AuthContext
import api from '../services/api'; // Asegúrate de que esta línea esté



// Registramos los componentes de ChartJS, incluyendo ArcElement para el gráfico de dona.
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

// --- COMPONENTES DE UI REUTILIZABLES ---
const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl p-6 shadow-sm transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ item }) => {
    const { darkMode } = useThemeContext();
    // Determinamos si el cambio es positivo, negativo o neutro para el color
    const isPositive = item.change?.startsWith('+');
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                <item.Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                {/* Mostramos el indicador de cambio si existe */}
                {item.change && (
                    <span className={`text-sm font-semibold ${changeColor}`}>
                        {item.change}
                    </span>
                )}
            </div>
            {/* Mostramos el periodo de la comparativa */}
            {item.changePeriod && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{item.changePeriod}</p>}
        </Card>
    );
};

// --- NUEVOS COMPONENTES VISUALES ---

const TopProductsCard = ({ topProducts }) => {
    const { darkMode } = useThemeContext();
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productos Más Vendidos</h3>
            <ul className="mt-4 space-y-3">
                {topProducts.map((product) => (
                    <li key={product.idproducto} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-slate-300">{product.descripcion}</span>
                        <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">{product.cantidad}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const ServiceTypeChart = ({ salesByType }) => {
    const { darkMode } = useThemeContext();
    const data = {
        labels: salesByType.labels,
        datasets: [{
            data: salesByType.data,
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
            borderColor: darkMode ? '#1f2937' : '#ffffff',
            borderWidth: 2,
        }]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: darkMode ? '#D1D5DB' : '#374151' } } }
    };
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ventas por Tipo de Servicio</h3>
            <div className="mt-4 h-60 w-full flex justify-center items-center">
                <Doughnut data={data} options={options} />
            </div>
        </Card>
    );
};

// --- NUEVO COMPONENTE: Selector de Rango de Fechas ---
const DateRangePicker = ({ activeRange, setActiveRange }) => {
    const ranges = ['Hoy', 'Ayer', 'Últimos 7 días', 'Este Mes'];
    const { darkMode } = useThemeContext();
    return (
        <div className={`p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            {ranges.map(range => (
                <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        activeRange === range 
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );
};

// --- COMPONENTE DE ERROR DE CONEXIÓN ---
const PosConnectionError = ({ onRetry }) => {
    const { darkMode } = useThemeContext();
    return (
        <Card className={darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}>
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Error de Conexión
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-red-200">
                    No pudimos conectarnos a tu punto de venta (Soft Restaurant).
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-red-300">
                    Verifica que el Agente NextFactura esté corriendo en tu computadora local y tenga conexión a internet.
                </p>
                <button
                    onClick={onRetry}
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Reintentar Conexión
                </button>
            </div>
        </Card>
    );
};

const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
    </div>
);
// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
function Dashboard() {
    const { darkMode } = useThemeContext();
    const { user } = useAuth();
    
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDateRange, setActiveDateRange] = useState('Últimos 7 días');

   const fetchDashboardData = useCallback(async () => {
    const restaurantId = user?.restaurants?.[0]?.id;
    if (!restaurantId) {
        setError("No hay un restaurante configurado para obtener datos.");
        setIsLoading(false);
        return;
    }
    
    try {
        setIsLoading(true);
        setError(null);
        const dateRangeParam = encodeURIComponent(activeDateRange);
        
        // Hacemos las llamadas a la API en paralelo
        const [chequesRes, productsRes, cheqdetRes] = await Promise.all([
            api.get(`/pos/query/${restaurantId}/cheques?range=${dateRangeParam}`),
            api.get(`/pos/query/${restaurantId}/products`),
            api.get(`/pos/query/${restaurantId}/cheqdet?range=${dateRangeParam}`)
        ]);

        if (!chequesRes.data.success || !productsRes.data.success || !cheqdetRes.data.success) {
            throw new Error('Error al obtener los datos completos del punto de venta.');
        }

        const cheques = chequesRes.data.data || [];
        const products = productsRes.data.data || [];
        const details = cheqdetRes.data.data || [];

        // --- INICIO DE LA LÓGICA DE PROCESAMIENTO DE DATOS ---

        // CORRECCIÓN: Limpiamos los espacios en blanco de los IDs al crear el "directorio"
        const uniqueProducts = new Map(products.map(p => [p.idproducto.trim(), p]));
        
        const totalRevenue = cheques.reduce((acc, c) => acc + (c.total || 0), 0);
        const totalTickets = cheques.length;
        const averageTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0;
        
        const productSales = details.reduce((acc, item) => {
            const cleanId = item.idproducto.trim(); // Limpiamos el ID aquí también
            acc[cleanId] = (acc[cleanId] || 0) + item.cantidad;
            return acc;
        }, {});

        const topProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([idproducto, cantidad]) => ({
                idproducto,
                // Usamos el ID limpio para la búsqueda y mostramos un fallback mejorado
                descripcion: uniqueProducts.get(idproducto)?.descripcion || `ID: ${idproducto} (Eliminado)`,
                cantidad,
            }));
        
        const serviceTypeMap = { 1: 'Comedor', 2: 'Domicilio', 3: 'Rápido', 4: 'CEDIS' };
        const salesByTypeData = cheques.reduce((acc, c) => {
            const typeName = serviceTypeMap[c.tipodeservicio] || 'Otro';
            acc[typeName] = (acc[typeName] || 0) + c.total;
            return acc;
        }, {});

        setDashboardData({
            kpis: [
                { title: 'Ingresos Totales', value: `$${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, Icon: BanknotesIcon },
                { title: 'Total de Tickets', value: totalTickets.toLocaleString('es-MX'), Icon: DocumentTextIcon },
                { title: 'Ticket Promedio', value: `$${averageTicket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, Icon: ArrowTrendingUpIcon },
                { title: 'Productos en Catálogo', value: uniqueProducts.size.toLocaleString('es-MX'), Icon: CubeIcon },
            ],
            topProducts: topProducts,
            salesByType: {
                labels: Object.keys(salesByTypeData),
                data: Object.values(salesByTypeData),
            }
        });
        // --- FIN DE LA LÓGICA DE PROCESAMIENTO ---
        
    } catch (err) {
       console.error("Error cargando datos del dashboard:", err);
    
    // --- CORRECCIÓN CLAVE ---
    // Extraemos el mensaje de error específico que viene del backend
    const errorMessage = err.response?.data?.message || err.message;
    setError(errorMessage); 
    // --- FIN DE LA CORRECCIÓN ---
    } finally {
        setIsLoading(false);
    }
}, [user, activeDateRange]); // La función se recrea solo si 'user' o 'activeDateRange' cambian

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user, fetchDashboardData]); // El efecto se dispara cuando 'fetchDashboardData' (y por ende sus dependencias) cambia

    // --- NUEVA FUNCIÓN DE REINTENTO ---
    const handleRetry = () => {
        setError(null); // Borra el error
        fetchDashboardData(); // Vuelve a llamar a la función de carga
    };
    

return (
        <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* --- Encabezado y Selector de Fecha --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Principal</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Resumen en tiempo real de tu punto de venta.</p>
                    </div>
                    <DateRangePicker activeRange={activeDateRange} setActiveRange={setActiveDateRange} />
                </div>
                
                {/* --- Contenedor Principal con Lógica de Estados --- */}
                <AnimatePresence mode="wait">
                    {/* ESTADO 1: Cargando */}
                    {isLoading ? (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <DashboardSkeleton />
                        </motion.div>
                    
                    /* ESTADO 2: Error (Manejo Profesional) */
                    ) : error ? (
                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <PosConnectionError onRetry={handleRetry} />
                        </motion.div>

                    /* ESTADO 3: Éxito (Datos Cargados) */
                    ) : (
                        dashboardData && (
                            <motion.div 
                                key="data"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Sección de KPIs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {dashboardData.kpis.map(item => <StatCard key={item.title} item={item} />)}
                                </div>
                                
                                {/* Sección de Gráficos */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <TopProductsCard topProducts={dashboardData.topProducts} />
                                    </div>
                                    <div>
                                        <ServiceTypeChart salesByType={dashboardData.salesByType} />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
} // <-- Fin de la función Dashboard

export default Dashboard;