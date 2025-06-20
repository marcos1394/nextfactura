// src/pages/SuperAdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useThemeContext } from '../context/ThemeContext';
import { BanknotesIcon, UsersIcon, DocumentTextIcon, BuildingStorefrontIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

// Registrar todos los elementos necesarios de ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// --- MOCK DATA (usamos la estructura que ya tenías) ---
const mockSuperAdminData = {
    kpis: {
        totalRevenue: 150000,
        activePlans: 45,
        totalInvoices: 5000,
        totalRestaurants: 60,
    },
    activityOverTime: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
        data: [500, 600, 700, 800, 1200, 1300, 1500, 1450, 1600],
    },
    planDistribution: {
        labels: ['Plan Pro', 'Plan Básico', 'Plan Empresa'],
        data: [30, 15, 5],
    },
    topRestaurants: [
        { rank: 1, name: 'SaborMX Central', invoices: 1200 },
        { rank: 2, name: 'El Fogón Norte', invoices: 800 },
        { rank: 3, name: 'Mariscos Bahía', invoices: 650 },
        { rank: 4, name: 'Pizza Nostra', invoices: 600 },
    ],
    recentPayments: [
        { id: 'pay_1', name: 'SaborMX Central', amount: 5000, date: '2025-06-19' },
        { id: 'pay_2', name: 'El Fogón Norte', amount: 3200, date: '2025-06-18' },
        { id: 'pay_3', name: 'Pizza Nostra', amount: 4000, date: '2025-06-18' },
        { id: 'pay_4', name: 'Consultores Gastronómicos', amount: 8500, date: '2025-06-17' },
    ]
};

// --- SUBCOMPONENTES DE UI ---

// Tarjeta genérica para los widgets
const Card = ({ children, className = '' }) => (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-lg p-6 ${className}`}>
        {children}
    </div>
);

// Tarjetas de KPIs principales
const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <Icon className="w-6 h-6 text-slate-500" />
        </div>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </Card>
);

// Gráfico principal de actividad
const ActivityChart = ({ data, options }) => (
    <Card className="col-span-1 lg:col-span-2 h-96">
        <h3 className="font-semibold text-white">Actividad de la Plataforma</h3>
        <p className="text-sm text-slate-400">Facturas emitidas por mes</p>
        <div className="mt-4 h-[280px]">
            <Line data={data} options={options} />
        </div>
    </Card>
);

// Gráfico de distribución de planes
const PlanDistributionChart = ({ data, options, totalPlans }) => (
    <Card className="col-span-1 h-96 flex flex-col">
        <h3 className="font-semibold text-white">Distribución de Planes</h3>
        <div className="my-auto relative flex justify-center items-center h-full">
            <Doughnut data={data} options={options} />
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-white">{totalPlans}</span>
                <span className="text-sm text-slate-400">Activos</span>
            </div>
        </div>
    </Card>
);

// Tabla de pagos recientes
const RecentPaymentsTable = ({ payments }) => (
    <Card className="col-span-1 lg:col-span-3">
        <h3 className="font-semibold text-white">Pagos Recientes</h3>
        <div className="mt-4 flow-root">
            <table className="min-w-full divide-y divide-slate-700">
                <tbody className="divide-y divide-slate-800">
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td className="py-4 whitespace-nowrap">
                                <p className="font-medium text-white">{payment.name}</p>
                                <p className="text-sm text-slate-400">{payment.date}</p>
                            </td>
                            <td className="py-4 whitespace-nowrap text-right font-mono text-lg text-green-400">
                                +{payment.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

/**
 * SuperAdminDashboard - Rediseñado como un centro de comando estratégico.
 * * Estrategia de UX/UI:
 * 1.  Layout de Grid Sofisticado: Se utiliza un layout de grid avanzado para posicionar los widgets
 * de forma lógica, con un gráfico principal dominante y widgets secundarios que lo complementan.
 * 2.  Estética "Premium Dark": Se refina el tema oscuro con fondos sólidos y tarjetas "flotantes"
 * para un look más limpio y profesional, típico de las herramientas de BI modernas.
 * 3.  Visualización de Datos Mejorada: Se usa un gráfico de dona en lugar de pastel para mostrar la
 * distribución de planes de forma más moderna, y se estilizan los gráficos de línea con gradientes.
 * 4.  Componentización para Claridad: La UI se divide en componentes lógicos (StatCard, ActivityChart, etc.),
 * haciendo el código principal más limpio y fácil de mantener.
 */
function SuperAdminDashboard() {
    const { darkMode } = useThemeContext(); // Asumimos que el tema se aplica globalmente
    const [dashboardData, setDashboardData] = useState(null);

    // Simulación de carga de datos
    useEffect(() => {
        // En una app real, aquí harías tu llamada a la API
        setDashboardData(mockSuperAdminData);
    }, []);

    // Configuración genérica para los gráficos
    const getChartOptions = (customOptions = {}) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E293B', titleColor: '#F1F5F9', bodyColor: '#94A3B8',
                padding: 12, boxPadding: 6, cornerRadius: 8,
            },
        },
        scales: {
            x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
        },
        ...customOptions
    });

    // Configuración específica para los datos del gráfico de línea
    const getActivityChartData = (canvas) => {
        if (!canvas || !dashboardData) return { labels: [], datasets: [] };
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        
        return {
            labels: dashboardData.activityOverTime.labels,
            datasets: [{
                label: 'Facturas',
                data: dashboardData.activityOverTime.data,
                fill: true,
                backgroundColor: gradient,
                borderColor: '#38BDF8',
                pointBackgroundColor: '#38BDF8',
                pointBorderColor: '#0F172A',
                tension: 0.4,
            }]
        };
    };
    
    // Configuración para el gráfico de dona
    const planDistributionChartData = {
        labels: dashboardData?.planDistribution.labels,
        datasets: [{
            data: dashboardData?.planDistribution.data,
            backgroundColor: ['#38BDF8', '#6366F1', '#F472B6'],
            borderColor: '#1E293B',
            borderWidth: 4,
            hoverOffset: 8,
        }],
    };

    const lineChartRef = React.useRef(null);

    if (!dashboardData) {
        // Se podría mostrar un esqueleto de carga aquí
        return <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center"><p>Cargando Dashboard...</p></div>;
    }

    return (
        <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                    <p className="mt-1 text-slate-400">Vista general del rendimiento de la plataforma.</p>
                </div>
                
                {/* Master Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Fila de KPIs (abarca todo el ancho en móvil, se distribuye en grande) */}
                    <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard title="Ingresos Totales" value={dashboardData.kpis.totalRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} icon={BanknotesIcon} />
                        <StatCard title="Planes Activos" value={dashboardData.kpis.activePlans} icon={UsersIcon} />
                        <StatCard title="Total Facturas" value={dashboardData.kpis.totalInvoices.toLocaleString('es-MX')} icon={DocumentTextIcon} />
                        <StatCard title="Restaurantes" value={dashboardData.kpis.totalRestaurants} icon={BuildingStorefrontIcon} />
                    </div>

                    {/* Gráfico principal de actividad */}
                    <ActivityChart data={getActivityChartData(lineChartRef.current?.canvas)} options={getChartOptions()} ref={lineChartRef} />

                    {/* Gráfico de distribución de planes */}
                    <PlanDistributionChart 
                        data={planDistributionChartData} 
                        options={getChartOptions({ cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8' }}} })}
                        totalPlans={dashboardData.kpis.activePlans}
                    />

                    {/* Tabla de pagos recientes */}
                    <RecentPaymentsTable payments={dashboardData.recentPayments} />
                </div>
            </div>
        </main>
    );
}

export default SuperAdminDashboard;
