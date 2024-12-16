import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaMoneyBillWave, FaFileInvoiceDollar, FaUsers, FaCashRegister } from 'react-icons/fa';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function SuperAdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activePlans, setActivePlans] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0); 
  const [recentPayments, setRecentPayments] = useState([]); 
  const [topRestaurants, setTopRestaurants] = useState([]); 
  const [invoicesPerMonth, setInvoicesPerMonth] = useState([]); 
  const [planDistribution, setPlanDistribution] = useState({ monthly: 0, facturaCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      // Simulación de datos obtenidos desde el backend
      const revenue = 150000;
      const activePlans = 45;
      const invoices = 5000;
      const restaurants = 60; // Total de restaurantes registrados
      const topRestaurantsData = [
        { restaurant: 'Restaurante A', invoices: 1200 },
        { restaurant: 'Restaurante B', invoices: 800 },
        { restaurant: 'Restaurante C', invoices: 600 },
      ];

      const payments = [
        { restaurant: 'Restaurante A', amount: 5000, date: '2024-09-15' },
        { restaurant: 'Restaurante B', amount: 3200, date: '2024-09-14' },
        { restaurant: 'Restaurante C', amount: 4000, date: '2024-09-13' },
      ];

      const invoicesByMonth = [500, 600, 700, 800, 1200, 1300];

      const planDist = { monthly: 30, facturaCount: 15 };

      setTotalRevenue(revenue);
      setActivePlans(activePlans);
      setTotalInvoices(invoices);
      setTotalRestaurants(restaurants);
      setRecentPayments(payments);
      setTopRestaurants(topRestaurantsData);
      setInvoicesPerMonth(invoicesByMonth);
      setPlanDistribution(planDist);
    };

    fetchData();
  }, []);

  // Aseguramos que `topRestaurants` sea siempre un array antes de usar `.map()`
  const barData = {
    labels: topRestaurants ? topRestaurants.map((item) => item.restaurant) : [], 
    datasets: [
      {
        label: 'Facturas Emitidas',
        data: topRestaurants ? topRestaurants.map((item) => item.invoices) : [], 
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Aseguramos que `invoicesPerMonth` sea siempre un array antes de usar `.map()`
  const lineData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Facturas Emitidas',
        data: invoicesPerMonth && invoicesPerMonth.length > 0 ? invoicesPerMonth : [0], 
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const pieData = {
    labels: ['Planes Mensuales', 'Planes por Factura'],
    datasets: [
      {
        data: planDistribution ? [planDistribution.monthly, planDistribution.facturaCount] : [0, 0],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-600 text-white py-8">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Dashboard del Superadministrador</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center">
            <FaMoneyBillWave className="text-5xl mb-4" />
            <h3 className="text-2xl font-bold">Ingresos Totales</h3>
            <p className="text-4xl font-bold">${totalRevenue} MXN</p>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center">
            <FaUsers className="text-5xl mb-4" />
            <h3 className="text-2xl font-bold">Planes Activos</h3>
            <p className="text-4xl font-bold">{activePlans}</p>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center">
            <FaFileInvoiceDollar className="text-5xl mb-4" />
            <h3 className="text-2xl font-bold">Facturas Emitidas</h3>
            <p className="text-4xl font-bold">{totalInvoices}</p>
          </div>

          <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center">
            <FaCashRegister className="text-5xl mb-4" />
            <h3 className="text-2xl font-bold">Restaurantes</h3>
            <p className="text-4xl font-bold">{totalRestaurants}</p>
          </div>
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Restaurantes con más Facturas Emitidas</h3>
          {topRestaurants && topRestaurants.length > 0 ? <Bar data={barData} /> : <p>No hay datos disponibles</p>}
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Facturas Emitidas por Mes</h3>
          {invoicesPerMonth && invoicesPerMonth.length > 0 ? <Line data={lineData} /> : <p>No hay datos disponibles</p>}
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Distribución de Planes Activos</h3>
          {planDistribution ? <Pie data={pieData} /> : <p>No hay datos disponibles</p>}
        </div>

        <div className="bg-black p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">Pagos Recientes</h3>
          {recentPayments && recentPayments.length > 0 ? (
            <ul className="text-white">
              {recentPayments.map((payment, index) => (
                <li key={index} className="mb-2">
                  <p><strong>{payment.restaurant}</strong> pagó <strong>${payment.amount} MXN</strong> el {payment.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay pagos recientes</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4">Porcentaje de Planes Activos</h3>
            <div style={{ width: 150, height: 150 }}>
              <CircularProgressbar value={(activePlans / 50) * 100} text={`${(activePlans / 50) * 100}%`} />
            </div>
            <p className="mt-4">Del total de 50 posibles planes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
