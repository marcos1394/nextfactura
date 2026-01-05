import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Banknote, 
  Users, 
  FileText, 
  Store, 
  TrendingUp,
  Download
} from 'lucide-react';
import Card from '../../components/ui/Card'; // Asumo que ya tienes este componente

// Registro de ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// --- MOCK DATA ---
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
    recentPayments: [
        { id: 'pay_1', name: 'SaborMX Central', amount: 5000, date: '2025-06-19', status: 'completed' },
        { id: 'pay_2', name: 'El Fogón Norte', amount: 3200, date: '2025-06-18', status: 'completed' },
        { id: 'pay_3', name: 'Pizza Nostra', amount: 4000, date: '2025-06-18', status: 'pending' },
        { id: 'pay_4', name: 'Consultores Gastronómicos', amount: 8500, date: '2025-06-17', status: 'completed' },
    ]
};

// --- SUBCOMPONENTES ---

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {trend}
                </span>
                <span className="text-gray-400 ml-2">vs mes anterior</span>
            </div>
        )}
    </Card>
);

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 lg:col-span-2 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

function SuperAdminDashboard() {
    const [data, setData] = useState(null);
    const chartRef = useRef(null);
    const [gradient, setGradient] = useState(null);

    // Simulación de carga
    useEffect(() => {
        const timer = setTimeout(() => {
            setData(mockSuperAdminData);
        }, 1000); // 1 segundo de carga simulada
        return () => clearTimeout(timer);
    }, []);

    // Configuración del gradiente para el gráfico de línea
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const ctx = chart.ctx;
        const newGradient = ctx.createLinearGradient(0, 0, 0, 400);
        newGradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Azul inicio
        newGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');   // Azul final (transparente)
        setGradient(newGradient);
    }, [data]);

    if (!data) return <SkeletonLoader />;

    // Configuración de Datos Gráficos
    const lineChartData = {
        labels: data.activityOverTime.labels,
        datasets: [{
            label: 'Facturas Emitidas',
            data: data.activityOverTime.data,
            fill: true,
            backgroundColor: gradient || 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            tension: 0.4,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#3b82f6',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    };

    const doughnutData = {
        labels: data.planDistribution.labels,
        datasets: [{
            data: data.planDistribution.data,
            backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899'], // Azul, Violeta, Rosa
            borderWidth: 0,
            hoverOffset: 4,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 13 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { border: { display: false }, grid: { color: '#e2e8f0', borderDash: [5, 5] }, ticks: { color: '#94a3b8' } }
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Control Global</h1>
                    <p className="text-gray-500 dark:text-slate-400">Resumen ejecutivo de la plataforma.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Exportar Reporte
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Ingresos Totales" 
                    value={data.kpis.totalRevenue.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} 
                    icon={Banknote} 
                    trend="+12.5%"
                />
                <StatCard 
                    title="Planes Activos" 
                    value={data.kpis.activePlans} 
                    icon={Users} 
                    trend="+5%"
                />
                <StatCard 
                    title="Total Facturas" 
                    value={data.kpis.totalInvoices.toLocaleString()} 
                    icon={FileText} 
                    trend="+24%"
                />
                <StatCard 
                    title="Restaurantes" 
                    value={data.kpis.totalRestaurants} 
                    icon={Store} 
                    trend="+2%"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Actividad Principal */}
                <Card className="lg:col-span-2 min-h-[400px]">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Actividad de la Plataforma</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Volumen de facturación mensual</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <Line ref={chartRef} data={lineChartData} options={chartOptions} />
                    </div>
                </Card>

                {/* Distribución de Planes */}
                <Card className="min-h-[400px] flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Distribución de Planes</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Porcentaje de suscripciones</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className="w-[250px] h-[250px]">
                            <Doughnut 
                                data={doughnutData} 
                                options={{
                                    cutout: '75%',
                                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
                                }} 
                            />
                        </div>
                        {/* Texto Central */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{data.kpis.activePlans}</span>
                            <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">Activos</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Pagos Recientes */}
            <Card title="Pagos Recientes" noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Restaurante</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Fecha</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Estado</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {data.recentPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{payment.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">{payment.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            payment.status === 'completed' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                            {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">
                                        {payment.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default SuperAdminDashboard;