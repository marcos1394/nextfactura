// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useThemeContext } from '../context/ThemeContext';
// Importamos iconos para una UI más rica y clara
import { ArrowTrendingUpIcon, BanknotesIcon, DocumentTextIcon, Cog6ToothIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Registramos los componentes necesarios de ChartJS, incluyendo 'Filler' para los gradientes.
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);


// --- MOCK DATA (DATOS DE MUESTRA) ---
// En una aplicación real, esto vendría de tu API.
const mockDashboardData = {
    kpis: [
        { title: 'Total Facturado (Mes)', value: '$125,430.50', change: '+12.5%', Icon: BanknotesIcon },
        { title: 'Facturas Emitidas (Mes)', value: '342', change: '+5.2%', Icon: DocumentTextIcon },
        { title: 'Ticket Promedio', value: '$366.75', change: '-1.8%', Icon: ArrowTrendingUpIcon },
    ],
    salesOverTime: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        data: [12000, 19000, 15000, 21000, 18000, 25000, 23000],
    },
    planStatus: {
        name: 'Plan Pro',
        usagePercentage: 68,
        daysRemaining: 15,
    },
    latestInvoices: [
        { id: 'T-84321', restaurant: 'SaborMX Central', amount: 450.00, status: 'Pagada', date: '2025-06-19' },
        { id: 'T-84320', restaurant: 'El Fogón Norte', amount: 1250.50, status: 'Pagada', date: '2025-06-19' },
        { id: 'T-84319', restaurant: 'SaborMX Central', amount: 875.00, status: 'Pendiente', date: '2025-06-18' },
        { id: 'T-84318', restaurant: 'Mariscos Bahía', amount: 2100.00, status: 'Pagada', date: '2025-06-18' },
        { id: 'T-84317', restaurant: 'Pizza Nostra', amount: 650.75, status: 'Cancelada', date: '2025-06-17' },
    ],
};

// --- COMPONENTES DE UI ---

const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl p-6 shadow-sm transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const StatCard = ({ item }) => {
    const { darkMode } = useThemeContext();
    const isPositive = item.change.startsWith('+');
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                <item.Icon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p className={`mt-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{item.change}</p>
        </Card>
    );
};

const MainChart = ({ data, options }) => {
    const { darkMode } = useThemeContext();
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ventas de la Última Semana</h3>
            <div className="mt-4 h-72">
                <Line data={data} options={options} />
            </div>
        </Card>
    );
};

const PlanStatusCard = ({ plan }) => {
    const { darkMode } = useThemeContext();
    return (
        <Card className={darkMode ? 'bg-gray-800' : 'bg-white'}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estado del Plan</h3>
            <div className="flex flex-col items-center justify-center gap-4 mt-4">
                <div style={{ width: 120, height: 120 }}>
                    <CircularProgressbar
                        value={plan.usagePercentage}
                        text={`${plan.usagePercentage}%`}
                        styles={buildStyles({
                            pathColor: `rgba(59, 130, 246, ${plan.usagePercentage / 100})`,
                            textColor: darkMode ? '#FFF' : '#0F172A',
                            trailColor: darkMode ? '#374151' : '#E5E7EB',
                        })}
                    />
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.daysRemaining} días restantes</p>
                </div>
                <button className="w-full mt-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Cog6ToothIcon className="w-5 h-5" /> Administrar Plan
                </button>
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
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Últimas Facturas</h3>
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


// --- COMPONENTE DE ESQUELETO (SKELETON) ---

const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl md:col-span-2"></div>
        </div>
    </div>
);


/**
 * Dashboard - El centro de comando del negocio, rediseñado para ser intuitivo y accionable.
 * * Estrategia de UX/UI:
 * 1.  Jerarquía Visual: Se organiza la información con KPIs (indicadores clave) en la parte superior
 * para una visión rápida, seguido de un gráfico principal de tendencias y widgets de detalle.
 * 2.  Skeleton Loading: En lugar de un spinner que bloquea la vista, se muestra una estructura de
 * "esqueleto" de la página. Esto mejora drásticamente la percepción de velocidad y la experiencia de carga.
 * 3.  Diseño Accionable: Los widgets no solo muestran datos, sino que incluyen botones y acciones
 * claras ("Administrar Plan", "Ver Detalle"), convirtiendo el dashboard de una vista pasiva a una herramienta activa.
 * 4.  Visualización de Datos Moderna: Los gráficos y medidores están estilizados para ser más limpios,
 * atractivos y fáciles de interpretar, usando colores y gradientes para mejorar la claridad.
 */
function Dashboard() {
    const { darkMode } = useThemeContext();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulación de carga de datos
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setData(mockDashboardData);
            setIsLoading(false);
        }, 2000); // Simula 2 segundos de carga
        return () => clearTimeout(timer);
    }, []);

    // Configuración de los gráficos
    const getChartOptions = (ctx) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                titleColor: darkMode ? '#F9FAFB' : '#111827',
                bodyColor: darkMode ? '#D1D5DB' : '#374151',
                borderColor: darkMode ? '#374151' : '#E5E7EB',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: { color: darkMode ? '#9CA3AF' : '#6B7280' },
                grid: { display: false },
            },
            y: {
                ticks: { color: darkMode ? '#9CA3AF' : '#6B7280' },
                grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
    });

    const getChartData = (canvas) => {
        if (!canvas) return { labels: [], datasets: [] };
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, darkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, darkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0)');
        
        return {
            labels: data?.salesOverTime.labels || [],
            datasets: [{
                label: 'Ventas',
                data: data?.salesOverTime.data || [],
                fill: true,
                backgroundColor: gradient,
                borderColor: '#3B82F6',
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: darkMode ? '#111827' : '#FFF',
                pointHoverBackgroundColor: darkMode ? '#FFF' : '#3B82F6',
                pointHoverBorderColor: '#3B82F6',
                tension: 0.4,
            }]
        };
    };

    const lineChartRef = React.useRef(null);
    const [lineChartData, setLineChartData] = React.useState({ datasets: [] });

    useEffect(() => {
        if (lineChartRef.current && data) {
            setLineChartData(getChartData(lineChartRef.current.canvas));
        }
    }, [lineChartRef, data, darkMode]);


    return (
        <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Principal</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Bienvenido de nuevo, aquí tienes el resumen de tu negocio.</p>
                </div>
                
                {isLoading ? <DashboardSkeleton /> : (
                    data && (
                        <div className="space-y-8">
                           {/* Fila de KPIs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {data.kpis.map(item => <StatCard key={item.title} item={item} />)}
                            </div>
                            
                            {/* Fila de Gráfico Principal */}
                            <div className="grid grid-cols-1">
                                <MainChart data={lineChartData} options={getChartOptions()} ref={lineChartRef} />
                            </div>

                            {/* Fila de Widgets de Soporte */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <PlanStatusCard plan={data.planStatus} />
                                <LatestInvoicesTable invoices={data.latestInvoices} />
                            </div>
                        </div>
                    )
                )}
            </div>
        </main>
    );
}

export default Dashboard;
