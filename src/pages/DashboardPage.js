import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { useThemeContext } from '../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowTrendingUpIcon, BanknotesIcon, DocumentTextIcon, CubeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
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

  useEffect(() => {
    const fetchDashboardData = async () => {
        // 1. Verificamos que el objeto 'user' del AuthContext exista.
        //    Si no existe, no estamos autenticados.
        if (!user?.restaurants?.length) {
            // Usamos un mensaje más claro que 'No hay restaurante'
            setError("Usuario no autenticado o sin restaurantes configurados.");
            setIsLoading(false);
            return;
        }
        const restaurantId = user.restaurants[0].id;
        
        try {
            setIsLoading(true);

            // --- CORRECCIÓN CLAVE ---
            // Eliminamos la gestión manual del token. 'api.get' se encargará de todo.
            // La cookie se enviará automáticamente.
            const dateRangeParam = encodeURIComponent(activeDateRange);
            
            const [chequesRes, productsRes, cheqdetRes] = await Promise.all([
                api.get(`/pos/query/${restaurantId}/cheques?range=${dateRangeParam}`),
                api.get(`/pos/query/${restaurantId}/products`),
                api.get(`/pos/query/${restaurantId}/cheqdet?range=${dateRangeParam}`)
            ]);
            // --- FIN DE LA CORRECCIÓN ---

            // ... (El resto de tu lógica para procesar los datos no cambia)

        } catch (err) {
            console.error("Error cargando datos del dashboard:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (user) { // Solo intentamos cargar los datos si ya tenemos un usuario del AuthContext
        fetchDashboardData();
    } else if (!isLoading) { // Si no estamos cargando y no hay usuario, mostramos el error
         setError("Usuario no autenticado.");
    }
}, [user, activeDateRange, isLoading]); // 'isLoading' añadido para evitar bucles si !user
    
    if (error) return <div className="p-8 text-center text-red-500">Error al cargar dashboard: {error}</div>;

    return (
        <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Principal</h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Resumen en tiempo real de tu punto de venta.</p>
                    </div>
                    <DateRangePicker activeRange={activeDateRange} setActiveRange={setActiveDateRange} />
                </div>
                
                <AnimatePresence>
                    {isLoading ? (
                        <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <DashboardSkeleton />
                        </motion.div>
                    ) : (
                        dashboardData && (
                            <motion.div 
                                key="data"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {dashboardData.kpis.map(item => <StatCard key={item.title} item={item} />)}
                                </div>
                                
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
}

export default Dashboard;