import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth'; // Para obtener datos del usuario
import { ArrowTrendingUpIcon, BanknotesIcon, DocumentTextIcon, Cog6ToothIcon, EyeIcon, DocumentArrowDownIcon, CubeIcon } from '@heroicons/react/24/outline';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- COMPONENTES DE UI (con el nuevo ProductCountCard) ---
const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl p-6 shadow-sm transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ item }) => {
    const { darkMode } = useThemeContext();
    const isPositive = item.change?.startsWith('+');
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                <item.Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            {item.change && <p className={`mt-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{item.change}</p>}
        </Card>
    );
};

const MainChart = React.forwardRef(({ data, options }, ref) => {
  const { darkMode } = useThemeContext(); // <-- AÑADE ESTA LÍNEA
  
  return (
    <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ventas de la Última Semana</h3>
        <div className="mt-4 h-72">
            <Line data={data} options={options} ref={ref} />
        </div>
    </Card>
  );
});

// --- NUEVO COMPONENTE PARA MOSTRAR DATOS DE PRODUCTOS ---
const ProductCountCard = ({ products }) => {
    const { darkMode } = useThemeContext();
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Catálogo de Productos</h3>
            <div className="flex items-center gap-4">
                <CubeIcon className="w-10 h-10 text-blue-500" />
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Productos Registrados</p>
                </div>
            </div>
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                <p>Últimos productos: {products.slice(0, 2).map(p => p.Name).join(', ')}...</p>
            </div>
        </Card>
    );
};

const LatestInvoicesTable = ({ invoices }) => {
    const { darkMode } = useThemeContext();
    const statusColor = {
        Pagada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        Pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        Cancelada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
        <Card className={`md:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Últimos Cheques (POS)</h3>
             <div className="mt-4 flow-root">
                 <div className="-mx-6 -my-6 overflow-x-auto">
                     <div className="inline-block min-w-full align-middle">
                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                             <thead >
                                 <tr>
                                     {['Ticket ID', 'Restaurante', 'Monto', 'Estado', 'Fecha', 'Acciones'].map(header => (
                                         <th key={header} scope="col" className="py-3.5 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">{header}</th>
                                     ))}
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                 {invoices.map(invoice => (
                                     <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                         <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">{invoice.id}</td>
                                         <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 dark:text-gray-300">{invoice.restaurant}</td>
                                         <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 dark:text-gray-300">{`$${invoice.amount.toFixed(2)}`}</td>
                                         <td className="whitespace-nowrap py-4 px-6 text-sm">
                                             <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[invoice.status]}`}>{invoice.status}</span>
                                         </td>
                                         <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-500 dark:text-gray-300">{invoice.date}</td>
                                         <td className="whitespace-nowrap py-4 px-6 text-sm font-medium">
                                             <div className="flex items-center gap-4">
                                                 <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"><EyeIcon className="w-5 h-5" /></button>
                                                 <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"><DocumentArrowDownIcon className="w-5 h-5" /></button>
                                             </div>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>
        </Card>
    );
};


const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
    </div>
);

function Dashboard() {
    const { darkMode } = useThemeContext();
    const { user } = useAuth();
    
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const lineChartRef = useRef(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.restaurants || user.restaurants.length === 0) {
                setError("No se ha encontrado un restaurante asociado a esta cuenta.");
                setIsLoading(false);
                return;
            }
            const restaurantId = user.restaurants[0].id;

            try {
                setIsLoading(true);
                
                const token = localStorage.getItem('authToken');
                const headers = { 'Authorization': token };

                // Hacemos las llamadas a la API en paralelo
                const [chequesRes, productsRes] = await Promise.all([
                    fetch(`/api/pos/query/${restaurantId}/cheques`, { headers }),
                    fetch(`/api/pos/query/${restaurantId}/products`, { headers })
                ]);

                if (!chequesRes.ok) throw new Error('Error al obtener los datos de ventas.');
                if (!productsRes.ok) throw new Error('Error al obtener los datos de productos.');

                const chequesJson = await chequesRes.json();
                const productsJson = await productsRes.json();
                const chequesData = chequesJson.data || [];
                const productsData = productsJson.data || [];
                
                // --- PROCESAMOS LOS DATOS PARA MOSTRARLOS ---
                const totalFacturado = chequesData.reduce((acc, cheque) => acc + (cheque.total || 0), 0);
                const facturasEmitidas = chequesData.length;
                const ticketPromedio = facturasEmitidas > 0 ? totalFacturado / facturasEmitidas : 0;
                
                const salesByDay = chequesData.reduce((acc, cheque) => {
                    const date = new Date(cheque.fecha).toLocaleDateString('es-MX', { weekday: 'short' });
                    acc[date] = (acc[date] || 0) + cheque.total;
                    return acc;
                }, {});

                const processedData = {
                    kpis: [
                        { title: 'Total Vendido (POS)', value: `$${totalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, Icon: BanknotesIcon },
                        { title: 'Cheques (POS)', value: facturasEmitidas, Icon: DocumentTextIcon },
                        { title: 'Ticket Promedio (POS)', value: `$${ticketPromedio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, Icon: ArrowTrendingUpIcon },
                    ],
                    salesOverTime: {
                        labels: Object.keys(salesByDay).reverse(), // Mostrar los días más recientes primero
                        data: Object.values(salesByDay).reverse(),
                    },
                    products: productsData, // Guardamos los datos de productos
                    latestInvoices: chequesData.slice(0, 5).map(c => ({
                        id: c.numcheque,
                        restaurant: user.restaurants[0].name,
                        amount: c.total,
                        status: c.pagado ? 'Pagada' : 'Pendiente',
                        date: new Date(c.fecha).toISOString().split('T')[0]
                    }))
                };

                setDashboardData(processedData);
                setError(null);
            } catch (err) {
                console.error("Error cargando datos del dashboard:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]); // El useEffect depende del objeto 'user'

    // --- LÓGICA DE GRÁFICOS (Ahora separada) ---
    const chartData = (canvas) => {
        if (!canvas || !dashboardData) return { labels: [], datasets: [] };
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, darkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        return {
            labels: dashboardData.salesOverTime.labels,
            datasets: [{
                label: 'Ventas',
                data: dashboardData.salesOverTime.data,
                fill: true,
                backgroundColor: gradient,
                borderColor: '#3B82F6',
                tension: 0.4,
            }]
        };
    };

    if (error) return <div className="text-center p-8 text-red-500">Error al cargar el dashboard: {error}</div>;

    return (
        <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Principal</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Resumen en tiempo real de tu punto de venta.</p>
                </div>
                
                {isLoading ? <DashboardSkeleton /> : (
                    dashboardData && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {dashboardData.kpis.map(item => <StatCard key={item.title} item={item} />)}
                                <ProductCountCard products={dashboardData.products} />
                            </div>
                            
                            <MainChart data={chartData(lineChartRef.current?.canvas)} options={{/* ... tus opciones ... */}} ref={lineChartRef} />

                            <div className="grid grid-cols-1">
                                <LatestInvoicesTable invoices={dashboardData.latestInvoices} />
                            </div>
                        </div>
                    )
                )}
            </div>
        </main>
    );
}

export default Dashboard;