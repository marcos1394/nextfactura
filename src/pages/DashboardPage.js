import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { ArrowTrendingUpIcon, BanknotesIcon, DocumentTextIcon, Cog6ToothIcon, EyeIcon, DocumentArrowDownIcon, CubeIcon, ClockIcon, UserGroupIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

// Simulación de contexto de tema y autenticación
const useThemeContext = () => ({ darkMode: true });
const useAuth = () => ({ 
  user: { 
    restaurants: [{ id: 1, name: "Gallozon Central" }] 
  } 
});

// Mock data basado en el formato real
const mockChequesData = [
  {
    totalbebidas: 0,
    totalalimentos: 212.931,
    totalsindescuento: 212.931,
    efectivo: 247,
    tarjeta: 0,
    total: 247,
    totalarticulos: 4,
    estacion: "DESKTOP-TSFOE7T",
    idturno: 1,
    tipodeservicio: 1,
    orden: 4,
    cambio: 53,
    impreso: true,
    pagado: true,
    mesa: "03",
    nopersonas: 1,
    cierre: "2025-08-27T18:13:25.000Z",
    fecha: "2025-08-27T18:13:12.000Z",
    numcheque: 4,
    folio: "3"
  },
  {
    totalbebidas: 45,
    totalalimentos: 423.2759,
    totalsindescuento: 423.2759,
    efectivo: 0,
    tarjeta: 491,
    total: 491,
    totalarticulos: 3,
    estacion: "DESKTOP-TSFOE7T",
    idturno: 1,
    tipodeservicio: 1,
    orden: 3,
    cambio: 0,
    impreso: true,
    pagado: true,
    mesa: "01",
    nopersonas: 2,
    cierre: "2025-08-27T18:12:57.000Z",
    fecha: "2025-08-27T18:12:49.000Z",
    numcheque: 3,
    folio: "2"
  },
  {
    totalbebidas: 30,
    totalalimentos: 222.4138,
    totalsindescuento: 222.4138,
    efectivo: 258,
    tarjeta: 0,
    total: 258,
    totalarticulos: 2,
    estacion: "DESKTOP-TSFOE7T",
    idturno: 1,
    tipodeservicio: 3,
    orden: 2,
    cambio: 42,
    impreso: true,
    pagado: true,
    mesa: "",
    nopersonas: 1,
    cierre: "2025-08-27T18:07:33.000Z",
    fecha: "2025-08-27T18:07:33.000Z",
    numcheque: 2,
    folio: "1"
  }
];

const mockProductsData = [
  { idproducto: "0110002", descripcion: "1 POLLO Y MEDIO", nombrecorto: "", plu: "" },
  { idproducto: "09003", descripcion: "1/4 DE POLLO", nombrecorto: "", plu: "" },
  { idproducto: "03001", descripcion: "6 GALLITOS", nombrecorto: "", plu: "" },
  { idproducto: "08004", descripcion: "AGUA 500ML", nombrecorto: "", plu: "" },
];

// --- COMPONENTES DE UI ---
const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-700/50 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const StatCard = ({ item, trend }) => {
  const { darkMode } = useThemeContext();
  const isPositive = trend > 0;
  
  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 hover:from-gray-700/90 hover:to-gray-800/90">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600/20">
            <item.Icon className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-gray-300">{item.title}</p>
        </div>
        {trend !== undefined && (
          <span className={`text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{item.value}</p>
        <p className="text-sm text-gray-400">{item.subtitle}</p>
      </div>
    </Card>
  );
};

const MainChart = ({ data, options, title }) => {
  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30">7D</button>
          <button className="px-3 py-1 text-xs bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30">30D</button>
        </div>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

const PaymentMethodsChart = ({ data }) => {
  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90">
      <h3 className="text-lg font-semibold text-white mb-4">Métodos de Pago</h3>
      <div className="h-48">
        <Doughnut data={data} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#D1D5DB', padding: 20 }
            }
          }
        }} />
      </div>
    </Card>
  );
};

const TopProductsChart = ({ data }) => {
  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90">
      <h3 className="text-lg font-semibold text-white mb-4">Productos Más Vendidos</h3>
      <div className="space-y-3">
        {data.map((product, index) => (
          <div key={product.name} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-400">{index + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{product.name}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(product.sales / data[0].sales) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-300">{product.sales}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const LatestInvoicesTable = ({ invoices }) => {
  const statusColor = {
    true: 'bg-green-600/20 text-green-400',
    false: 'bg-yellow-600/20 text-yellow-400',
  };

  const serviceTypeNames = {
    1: 'Mesa',
    2: 'Mostrador', 
    3: 'Para Llevar'
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Últimos Cheques</h3>
        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Ver Todo
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              {['Folio', 'Mesa', 'Total', 'Artículos', 'Pago', 'Estado', 'Fecha'].map(header => (
                <th key={header} className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {invoices.map(invoice => (
              <tr key={invoice.numcheque} className="hover:bg-gray-700/30 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono text-sm text-white">#{invoice.folio}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-300">
                    {invoice.mesa || serviceTypeNames[invoice.tipodeservicio] || 'N/A'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white">${invoice.total.toFixed(2)}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-300">{invoice.totalarticulos}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    {invoice.efectivo > 0 && <CurrencyDollarIcon className="w-4 h-4 text-green-400" />}
                    {invoice.tarjeta > 0 && <CreditCardIcon className="w-4 h-4 text-blue-400" />}
                    <span className="text-xs text-gray-400">
                      {invoice.efectivo > 0 && invoice.tarjeta > 0 ? 'Mixto' : 
                       invoice.efectivo > 0 ? 'Efectivo' : 'Tarjeta'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColor[invoice.pagado]}`}>
                    {invoice.pagado ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-400">
                    {new Date(invoice.fecha).toLocaleDateString('es-MX')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-800/50 rounded-2xl"></div>
      ))}
    </div>
    <div className="h-96 bg-gray-800/50 rounded-2xl"></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80 bg-gray-800/50 rounded-2xl"></div>
      <div className="h-80 bg-gray-800/50 rounded-2xl"></div>
    </div>
  </div>
);

function Dashboard() {
  const { darkMode } = useThemeContext();
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Simulamos la carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const chequesData = mockChequesData;
        const productsData = mockProductsData;
        
        // Procesamiento de datos más detallado
        const totalFacturado = chequesData.reduce((acc, cheque) => acc + cheque.total, 0);
        const totalEfectivo = chequesData.reduce((acc, cheque) => acc + cheque.efectivo, 0);
        const totalTarjeta = chequesData.reduce((acc, cheque) => acc + cheque.tarjeta, 0);
        const totalArticulos = chequesData.reduce((acc, cheque) => acc + cheque.totalarticulos, 0);
        const totalPersonas = chequesData.reduce((acc, cheque) => acc + cheque.nopersonas, 0);
        const facturasEmitidas = chequesData.length;
        const ticketPromedio = facturasEmitidas > 0 ? totalFacturado / facturasEmitidas : 0;
        
        // Datos por día (última semana)
        const salesByDay = {};
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' });
          salesByDay[dayName] = Math.random() * 1000 + 200; // Datos simulados
        }

        const processedData = {
          kpis: [
            { 
              title: 'Ventas del Día', 
              value: `$${totalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
              subtitle: `${facturasEmitidas} cheques`,
              Icon: BanknotesIcon 
            },
            { 
              title: 'Ticket Promedio', 
              value: `$${ticketPromedio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
              subtitle: 'Por cliente',
              Icon: ArrowTrendingUpIcon 
            },
            { 
              title: 'Artículos Vendidos', 
              value: totalArticulos.toString(), 
              subtitle: `${totalPersonas} personas atendidas`,
              Icon: CubeIcon 
            },
            { 
              title: 'Productos Activos', 
              value: productsData.length.toString(), 
              subtitle: 'En catálogo',
              Icon: DocumentTextIcon 
            }
          ],
          salesOverTime: {
            labels: Object.keys(salesByDay),
            data: Object.values(salesByDay),
          },
          paymentMethods: {
            efectivo: totalEfectivo,
            tarjeta: totalTarjeta
          },
          topProducts: [
            { name: '1/4 DE POLLO', sales: 25 },
            { name: 'GALLITOS 6 PZA', sales: 18 },
            { name: 'AGUA 500ML', sales: 15 },
            { name: 'ARROZ', sales: 12 }
          ],
          latestInvoices: chequesData.slice(0, 5)
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

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: dashboardData?.salesOverTime.labels || [],
    datasets: [{
      label: 'Ventas ($)',
      data: dashboardData?.salesOverTime.data || [],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3B82F6',
      borderWidth: 3,
      tension: 0.4,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  const paymentData = {
    labels: ['Efectivo', 'Tarjeta'],
    datasets: [{
      data: dashboardData ? [dashboardData.paymentMethods.efectivo, dashboardData.paymentMethods.tarjeta] : [],
      backgroundColor: ['#10B981', '#3B82F6'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { color: '#9CA3AF' }
      },
      y: {
        grid: { color: '#374151', drawBorder: false },
        ticks: { 
          color: '#9CA3AF',
          callback: (value) => `$${value}`
        }
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error de Conexión</div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard Gallozon POS
          </h1>
          <p className="mt-2 text-gray-400">Resumen en tiempo real de tu punto de venta</p>
        </div>
        
        {isLoading ? <DashboardSkeleton /> : (
          dashboardData && (
            <div className="space-y-8">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardData.kpis.map((item, index) => (
                  <StatCard key={item.title} item={item} trend={[8.5, -2.1, 15.3, 5.7][index]} />
                ))}
              </div>
              
              {/* Main Chart */}
              <MainChart 
                data={chartData} 
                options={chartOptions}
                title="Ventas de la Última Semana"
              />

              {/* Secondary Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentMethodsChart data={paymentData} />
                <TopProductsChart data={dashboardData.topProducts} />
              </div>

              {/* Latest Invoices Table */}
              <LatestInvoicesTable invoices={dashboardData.latestInvoices} />
            </div>
          )
        )}
      </div>
    </main>
  );
}

export default Dashboard;