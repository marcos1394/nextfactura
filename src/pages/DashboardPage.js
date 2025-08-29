import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { 
    BanknotesIcon, 
    DocumentTextIcon, 
    CreditCardIcon, 
    ShoppingCartIcon,
    UserGroupIcon,
    ClockIcon,
    ChartBarIcon,
    CubeIcon,
    EyeIcon,
    DocumentArrowDownIcon,
    CalendarDaysIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

// Mock data para simular el contexto y autenticación
const mockUser = {
    restaurants: [{ id: 1, name: "Gallozon Restaurant" }]
};

const mockTheme = { darkMode: false };

// Datos simulados
const mockChequesData = [
    {
        "totalbebidas": 0,
        "totalalimentos": 212.931,
        "totalsindescuento": 212.931,
        "efectivo": 247,
        "tarjeta": 0,
        "total": 247,
        "totalarticulos": 4,
        "estacion": "DESKTOP-TSFOE7T",
        "idturno": 1,
        "tipodeservicio": 1,
        "orden": 4,
        "cambio": 53,
        "impreso": true,
        "pagado": true,
        "mesa": "03",
        "nopersonas": 1,
        "cierre": "2025-08-27T18:13:25.000Z",
        "fecha": "2025-08-27T18:13:12.000Z",
        "numcheque": 4,
        "folio": "3"
    },
    {
        "totalbebidas": 0,
        "totalalimentos": 423.2759,
        "totalsindescuento": 423.2759,
        "efectivo": 0,
        "tarjeta": 0,
        "total": 491,
        "totalarticulos": 3,
        "estacion": "DESKTOP-TSFOE7T",
        "idturno": 1,
        "tipodeservicio": 1,
        "orden": 3,
        "cambio": 0,
        "impreso": true,
        "pagado": true,
        "mesa": "01",
        "nopersonas": 1,
        "cierre": "2025-08-27T18:12:57.000Z",
        "fecha": "2025-08-27T18:12:49.000Z",
        "numcheque": 3,
        "folio": "2"
    },
    {
        "totalbebidas": 0,
        "totalalimentos": 222.4138,
        "totalsindescuento": 222.4138,
        "efectivo": 258,
        "tarjeta": 0,
        "total": 258,
        "totalarticulos": 2,
        "estacion": "DESKTOP-TSFOE7T",
        "idturno": 1,
        "tipodeservicio": 3,
        "orden": 2,
        "cambio": 42,
        "impreso": true,
        "pagado": true,
        "mesa": "",
        "nopersonas": 1,
        "cierre": "2025-08-27T18:07:33.000Z",
        "fecha": "2025-08-27T18:07:33.000Z",
        "numcheque": 2,
        "folio": "1"
    },
    {
        "totalbebidas": 0,
        "totalalimentos": 465.5172,
        "totalsindescuento": 465.5172,
        "efectivo": 0,
        "tarjeta": 540,
        "total": 540,
        "totalarticulos": 2,
        "estacion": "DESKTOP-TSFOE7T",
        "idturno": 1,
        "tipodeservicio": 3,
        "orden": 1,
        "cambio": 0,
        "impreso": true,
        "pagado": true,
        "mesa": "",
        "nopersonas": 1,
        "cierre": "2025-08-27T18:07:21.000Z",
        "fecha": "2025-08-27T18:07:21.000Z",
        "numcheque": 1,
        "folio": "0"
    }
];

const mockProductsData = [
    { idproducto: "0110002", descripcion: "1 POLLO Y MEDIO", nombrecorto: "", plu: "" },
    { idproducto: "09003", descripcion: "1/4 DE POLLO", nombrecorto: "", plu: "" },
    { idproducto: "10005", descripcion: "1/4 DE POLLO", nombrecorto: "", plu: "" },
    { idproducto: "01004", descripcion: "1/4 POLLO", nombrecorto: "", plu: "" },
    { idproducto: "03002", descripcion: "10 GALLITOS", nombrecorto: "", plu: "" }
];

// Componentes UI
const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${className}`}>
        {children}
    </div>
);

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const { darkMode } = mockTheme;
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600',
        indigo: 'from-indigo-500 to-indigo-600'
    };

    return (
        <Card className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full bg-white bg-opacity-10"></div>
            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8 text-white opacity-80" />
                    {trend && (
                        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                            {trend === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
                            {trendValue}
                        </div>
                    )}
                </div>
                <p className="text-3xl font-bold mb-1">{value}</p>
                <p className="text-sm opacity-90">{title}</p>
                {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
            </div>
        </Card>
    );
};

const PaymentMethodChart = ({ effectivo, tarjeta }) => {
    const total = effectivo + tarjeta;
    const data = {
        labels: ['Efectivo', 'Tarjeta'],
        datasets: [{
            data: [effectivo, tarjeta],
            backgroundColor: ['#10B981', '#3B82F6'],
            borderWidth: 0,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                }
            }
        }
    };

    return (
        <Card className="bg-white border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h3>
            <div className="h-48 mb-4">
                <Doughnut data={data} options={options} />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Efectivo</span>
                    <span className="font-semibold">${effectivo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tarjeta</span>
                    <span className="font-semibold">${tarjeta.toFixed(2)}</span>
                </div>
            </div>
        </Card>
    );
};

const ServiceTypeChart = ({ data }) => {
    const serviceTypes = {
        1: 'Mesa',
        2: 'Barra',
        3: 'Para Llevar'
    };

    const chartData = {
        labels: Object.values(serviceTypes),
        datasets: [{
            label: 'Órdenes por Tipo',
            data: [
                data.filter(item => item.tipodeservicio === 1).length,
                data.filter(item => item.tipodeservicio === 2).length,
                data.filter(item => item.tipodeservicio === 3).length
            ],
            backgroundColor: ['#8B5CF6', '#F59E0B', '#EF4444'],
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#F3F4F6'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <Card className="bg-white border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Servicio</h3>
            <div className="h-48">
                <Bar data={chartData} options={options} />
            </div>
        </Card>
    );
};

const RecentOrdersTable = ({ orders }) => {
    const getServiceTypeLabel = (type) => {
        const types = { 1: 'Mesa', 2: 'Barra', 3: 'Para Llevar' };
        return types[type] || 'Desconocido';
    };

    const getPaymentMethod = (efectivo, tarjeta) => {
        if (efectivo > 0 && tarjeta > 0) return 'Mixto';
        if (efectivo > 0) return 'Efectivo';
        if (tarjeta > 0) return 'Tarjeta';
        return 'Sin pago';
    };

    return (
        <Card className="bg-white border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todas</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.numcheque} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">#{order.numcheque}</div>
                                            <div className="text-sm text-gray-500">Folio: {order.folio}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.mesa || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {getServiceTypeLabel(order.tipodeservicio)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        getPaymentMethod(order.efectivo, order.tarjeta) === 'Efectivo' ? 'bg-green-100 text-green-800' :
                                        getPaymentMethod(order.efectivo, order.tarjeta) === 'Tarjeta' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {getPaymentMethod(order.efectivo, order.tarjeta)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        order.pagado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {order.pagado ? 'Pagado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.fecha).toLocaleTimeString('es-MX', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900">
                                            <DocumentArrowDownIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const SalesChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => new Date(item.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })),
        datasets: [{
            label: 'Ventas por Hora',
            data: data.map(item => item.total),
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: '#3B82F6',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#F3F4F6'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <Card className="bg-white border-gray-200 md:col-span-2">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
                <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Hoy</span>
                </div>
            </div>
            <div className="h-80">
                <Line data={chartData} options={options} />
            </div>
        </Card>
    );
};

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            const chequesData = mockChequesData;
            const productsData = mockProductsData;

            // Calcular métricas
            const totalVentas = chequesData.reduce((acc, cheque) => acc + cheque.total, 0);
            const totalEfectivo = chequesData.reduce((acc, cheque) => acc + cheque.efectivo, 0);
            const totalTarjeta = chequesData.reduce((acc, cheque) => acc + cheque.tarjeta, 0);
            const totalArticulos = chequesData.reduce((acc, cheque) => acc + cheque.totalarticulos, 0);
            const totalClientes = chequesData.reduce((acc, cheque) => acc + cheque.nopersonas, 0);
            const ticketPromedio = chequesData.length > 0 ? totalVentas / chequesData.length : 0;

            const processedData = {
                kpis: {
                    totalVentas,
                    totalEfectivo,
                    totalTarjeta,
                    totalArticulos,
                    totalClientes,
                    ticketPromedio,
                    totalOrdenes: chequesData.length,
                    productosRegistrados: productsData.length
                },
                cheques: chequesData.reverse(), // Mostrar más recientes primero
                productos: productsData
            };

            setDashboardData(processedData);
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="h-80 bg-gray-200 rounded-2xl md:col-span-2"></div>
                            <div className="h-80 bg-gray-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Gallozon</h1>
                    <p className="mt-2 text-gray-600">Resumen completo de tu punto de venta</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Última actualización: {new Date().toLocaleString('es-MX')}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Ventas Total"
                        value={`$${dashboardData.kpis.totalVentas.toFixed(2)}`}
                        subtitle="Ingresos del día"
                        icon={BanknotesIcon}
                        color="blue"
                        trend="up"
                        trendValue="12.5%"
                    />
                    <StatCard
                        title="Órdenes"
                        value={dashboardData.kpis.totalOrdenes}
                        subtitle="Cheques procesados"
                        icon={DocumentTextIcon}
                        color="green"
                        trend="up"
                        trendValue="8.2%"
                    />
                    <StatCard
                        title="Ticket Promedio"
                        value={`$${dashboardData.kpis.ticketPromedio.toFixed(2)}`}
                        subtitle="Por transacción"
                        icon={ChartBarIcon}
                        color="purple"
                        trend="up"
                        trendValue="5.1%"
                    />
                    <StatCard
                        title="Clientes"
                        value={dashboardData.kpis.totalClientes}
                        subtitle="Personas atendidas"
                        icon={UserGroupIcon}
                        color="orange"
                        trend="up"
                        trendValue="15.3%"
                    />
                    <StatCard
                        title="Efectivo"
                        value={`$${dashboardData.kpis.totalEfectivo.toFixed(2)}`}
                        subtitle="Pagos en efectivo"
                        icon={BanknotesIcon}
                        color="green"
                    />
                    <StatCard
                        title="Tarjeta"
                        value={`$${dashboardData.kpis.totalTarjeta.toFixed(2)}`}
                        subtitle="Pagos con tarjeta"
                        icon={CreditCardIcon}
                        color="blue"
                    />
                    <StatCard
                        title="Artículos"
                        value={dashboardData.kpis.totalArticulos}
                        subtitle="Productos vendidos"
                        icon={ShoppingCartIcon}
                        color="indigo"
                    />
                    <StatCard
                        title="Productos"
                        value={dashboardData.kpis.productosRegistrados}
                        subtitle="En catálogo"
                        icon={CubeIcon}
                        color="red"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SalesChart data={dashboardData.cheques} />
                    <PaymentMethodChart 
                        efectivo={dashboardData.kpis.totalEfectivo} 
                        tarjeta={dashboardData.kpis.totalTarjeta} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <ServiceTypeChart data={dashboardData.cheques} />
                    <Card className="bg-white border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Adicionales</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Cambio Entregado</span>
                                <span className="font-semibold">
                                    ${dashboardData.cheques.reduce((acc, c) => acc + c.cambio, 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Órdenes Mesa</span>
                                <span className="font-semibold">
                                    {dashboardData.cheques.filter(c => c.tipodeservicio === 1).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Para Llevar</span>
                                <span className="font-semibold">
                                    {dashboardData.cheques.filter(c => c.tipodeservicio === 3).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <span className="text-green-700 font-medium">Órdenes Pagadas</span>
                                <span className="font-semibold text-green-700">
                                    {dashboardData.cheques.filter(c => c.pagado).length}/{dashboardData.cheques.length}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Orders Table */}
                <RecentOrdersTable orders={dashboardData.cheques} />
            </div>
        </div>
    );
}

export default Dashboard;