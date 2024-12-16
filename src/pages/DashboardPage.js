import React, { useState, useEffect, useContext } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import { ThemeContext } from '../context/ThemeContext'; // Importar el contexto del tema

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [planProgress, setPlanProgress] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [latestInvoices, setLatestInvoices] = useState([]);
  const { darkMode } = useContext(ThemeContext); // Usar el contexto del tema

  useEffect(() => {
    const fetchData = async () => {
      const invoices = [
        { restaurant: 'Restaurante A', invoices: 120 },
        { restaurant: 'Restaurante B', invoices: 80 },
      ];
      const totalInvoices = invoices.reduce((sum, item) => sum + item.invoices, 0);
      
      const latest = [
        { ticket: '001', restaurant: 'Restaurante A', amount: 500, iva: 80, date: '2024-09-17' },
        { ticket: '002', restaurant: 'Restaurante B', amount: 320, iva: 51, date: '2024-09-17' },
      ];

      setInvoiceData(invoices);
      setTotalInvoices(totalInvoices);
      setPlanProgress(75);
      setDaysRemaining(10);
      setLatestInvoices(latest);
    };

    fetchData();
  }, []);

  const barData = {
    labels: invoiceData.map((item) => item.restaurant),
    datasets: [
      {
        label: 'Facturas Emitidas',
        data: invoiceData.map((item) => item.invoices),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Montos Facturados',
        data: [6500, 5900, 8000, 8100, 5600, 5500],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const ivaData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'IVA Generado',
        data: [1040, 944, 1280, 1296, 896, 880],
        fill: true,
        backgroundColor: 'rgba(255,206,86,0.4)',
        borderColor: 'rgba(255,206,86,1)',
      },
    ],
  };

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Dashboard de Facturación</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-bold mb-4 text-center">Facturas Emitidas</h3>
            <Bar data={barData} />
          </div>

          <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-bold mb-4 text-center">Montos Facturados</h3>
            <Line data={lineData} />
          </div>

          <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-bold mb-4 text-center">IVA Generado</h3>
            <Line data={ivaData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`flex flex-col items-center p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar value={planProgress} text={`${planProgress}%`} />
            </div>
            <h4 className="text-xl font-bold mt-4">Consumo del Plan</h4>
            <p className="text-lg">{100 - planProgress}% de facturas restantes</p>
          </div>

          <div className={`flex flex-col items-center p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <FaFileInvoiceDollar className="text-5xl mb-4" />
            <h4 className="text-xl font-bold">Días Restantes del Plan</h4>
            <p className="text-2xl font-bold">{daysRemaining} días</p>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-2xl font-bold mb-4">Últimos 10 Tickets Facturados</h3>
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Ticket</th>
                <th className="px-4 py-2">Restaurante</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">IVA</th>
                <th className="px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {latestInvoices.map((invoice) => (
                <tr key={invoice.ticket} className="border-t border-gray-500">
                  <td className="px-4 py-2">{invoice.ticket}</td>
                  <td className="px-4 py-2">{invoice.restaurant}</td>
                  <td className="px-4 py-2">{invoice.amount} MXN</td>
                  <td className="px-4 py-2">{invoice.iva} MXN</td>
                  <td className="px-4 py-2">{invoice.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
