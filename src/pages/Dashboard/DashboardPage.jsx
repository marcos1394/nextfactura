import React, { useState, useEffect, useCallback } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
    PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement 
} from 'chart.js';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import api from '../../config/axios'; // Importamos la instancia configurada
import { AnimatePresence, motion } from 'framer-motion';

// --- ICONOS MODERNOS (Lucide React) ---
import { 
    TrendingUp, 
    DollarSign, 
    FileText, 
    Package, 
    AlertTriangle, 
    RefreshCw, 
    Calendar,
    ShoppingBag
} from 'lucide-react';

// Registramos ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

// --- COMPONENTES UI ---

const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ item }) => {
    const { darkMode } = useThemeContext();
    const isPositive = item.change?.startsWith('+');
    
    return (
        <Card className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.title}</p>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-600'}`}>
                    <item.Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
            {item.change && (
                <div className="mt-2 flex items-center text-sm">
                    <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change}
                    </span>
                    <span className="text-gray-400 ml-2">vs. periodo anterior</span>
                </div>
            )}
        </Card>
    );
};

const TopProductsCard = ({ topProducts }) => {
    return (
        <Card className="bg-white dark:bg-gray-800 h-full">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Productos Estrella</h3>
            </div>
            <div className="space-y-4">
                {topProducts.map((product, index) => (
                    <div key={product.idproducto || index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                index === 1 ? 'bg-gray-100 text-gray-700' : 
                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {index + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-500 transition-colors">
                                {product.descripcion}
                            </span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            {product.cantidad} vtas
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const ServiceTypeChart = ({ salesByType }) => {
    const { darkMode } = useThemeContext();
    
    const data = {
        labels: salesByType.labels,
        datasets: [{
            data: salesByType.data,
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
            borderColor: darkMode ? '#1f2937' : '#ffffff',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { 
                    color: darkMode ? '#9CA3AF' : '#4B5563',
                    font: { family: 'Inter', size: 12 },
                    usePointStyle: true,
                }
            }
        },
        layout: { padding: 10 }
    };

    return (
        <Card className="bg-white dark:bg-gray-800 h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ventas por Servicio</h3>
            <div className="h-64 w-full flex justify-center items-center relative">
                <Doughnut data={data} options={options} />
            </div>
        </Card>
    );
};

const DateRangePicker = ({ activeRange, setActiveRange }) => {
    const ranges = ['Hoy', 'Ayer', 'Últimos 7 días', 'Este Mes'];
    return (
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 inline-flex">
            {ranges.map(range => (
                <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                        activeRange === range 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );
};

const PosConnectionError = ({ onRetry }) => (
    <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900">
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Sin conexión al Punto de Venta
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-md">
                No pudimos sincronizar con tu servidor local. Verifica que el <strong>Agente NextManager</strong> esté ejecutándose en tu caja principal.
            </p>
            <button
                onClick={onRetry}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all hover:scale-105"
            >
                <RefreshCw className="w-4 h-4" />
                Reintentar Conexión
            </button>
        </div>
    </Card>
);

const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function DashboardPage() {
    const { darkMode } = useThemeContext();
    const { user } = useAuth();
    
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDateRange, setActiveDateRange] = useState('Últimos 7 días');

    const fetchDashboardData = useCallback(async () => {
        const restaurantId = user?.restaurants?.[0]?.id;
        
        if (!restaurantId) {
            setError("No se encontró un restaurante asociado.");
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Simulación de parámetros para la API
            const dateRangeParam = encodeURIComponent(activeDateRange);
            
            // Llamadas paralelas a la API usando la instancia configurada
            const [chequesRes, productsRes, cheqdetRes] = await Promise.all([
                api.get(`/pos/query/${restaurantId}/cheques?range=${dateRangeParam}`),
                api.get(`/pos/query/${restaurantId}/products`),
                api.get(`/pos/query/${restaurantId}/cheqdet?range=${dateRangeParam}`)
            ]);

            // Validación de éxito
            if (!chequesRes.data.success || !productsRes.data.success || !cheqdetRes.data.success) {
                throw new Error('Respuesta incompleta del servidor.');
            }

            const cheques = chequesRes.data.data || [];
            const products = productsRes.data.data || [];
            const details = cheqdetRes.data.data || [];

            // --- PROCESAMIENTO DE DATOS ---
            
            // 1. Diccionario de productos para acceso rápido
            const uniqueProducts = new Map(products.map(p => [p.idproducto.trim(), p]));
            
            // 2. KPIs
            const totalRevenue = cheques.reduce((acc, c) => acc + (c.total || 0), 0);
            const totalTickets = cheques.length;
            const averageTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0;

            // 3. Productos Top (Agrupación)
            const productSales = details.reduce((acc, item) => {
                const cleanId = item.idproducto.trim();
                acc[cleanId] = (acc[cleanId] || 0) + item.cantidad;
                return acc;
            }, {});

            const topProducts = Object.entries(productSales)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([id, cant]) => ({
                    idproducto: id,
                    descripcion: uniqueProducts.get(id)?.descripcion || `Producto ${id}`,
                    cantidad: cant,
                }));
            
            // 4. Ventas por Tipo (Gráfico)
            const serviceTypeMap = { 1: 'Comedor', 2: 'Domicilio', 3: 'Rápido', 4: 'Plataformas' };
            const salesByTypeData = cheques.reduce((acc, c) => {
                const typeName = serviceTypeMap[c.tipodeservicio] || 'Otros';
                acc[typeName] = (acc[typeName] || 0) + c.total;
                return acc;
            }, {});

            setDashboardData({
                kpis: [
                    { title: 'Ventas Totales', value: `$${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, Icon: DollarSign, change: '+12%' },
                    { title: 'Tickets', value: totalTickets.toLocaleString('es-MX'), Icon: FileText, change: '-5%' },
                    { title: 'Ticket Promedio', value: `$${averageTicket.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, Icon: TrendingUp },
                    { title: 'Inventario Activo', value: uniqueProducts.size.toLocaleString('es-MX'), Icon: Package },
                ],
                topProducts,
                salesByType: {
                    labels: Object.keys(salesByTypeData),
                    data: Object.values(salesByTypeData),
                }
            });

        } catch (err) {
            console.error("Dashboard Error:", err);
            setError(err.response?.data?.message || err.message || "Error de conexión");
        } finally {
            setIsLoading(false);
        }
    }, [user, activeDateRange]);

    useEffect(() => {
        if (user) fetchDashboardData();
    }, [user, fetchDashboardData]);

    const handleRetry = () => {
        setError(null);
        fetchDashboardData();
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header del Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Dashboard <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">En Vivo</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Bienvenido de nuevo, {user?.name?.split(' ')[0] || 'Administrador'}.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <DateRangePicker activeRange={activeDateRange} setActiveRange={setActiveDateRange} />
                </div>
            </div>

            {/* Contenido Dinámico */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DashboardSkeleton />
                    </motion.div>
                ) : error ? (
                    <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <PosConnectionError onRetry={handleRetry} />
                    </motion.div>
                ) : (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dashboardData?.kpis.map((item, idx) => (
                                <StatCard key={idx} item={item} />
                            ))}
                        </div>

                        {/* Gráficos y Tablas */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-96">
                            {/* Gráfica de Pastel */}
                            <div className="lg:col-span-1 h-full">
                                <ServiceTypeChart salesByType={dashboardData.salesByType} />
                            </div>
                            
                            {/* Productos Top */}
                            <div className="lg:col-span-2 h-full">
                                <TopProductsCard topProducts={dashboardData.topProducts} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}