import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import { FaFileInvoiceDollar, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import { useThemeContext } from '../context/ThemeContext';
import axios from 'axios';

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
  const { darkMode } = useThemeContext();
  const [invoiceData, setInvoiceData] = useState(null);
  const [planProgress, setPlanProgress] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [latestInvoices, setLatestInvoices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, invoicesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/latest-invoices`)
        ]);

        setInvoiceData(dashboardRes.data.invoiceStats);
        setPlanProgress(dashboardRes.data.planUsage);
        setDaysRemaining(dashboardRes.data.daysRemaining);
        setLatestInvoices(invoicesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartOptions = () => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#fff' : '#000'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
      },
      y: {
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
      }
    }
  });

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-4xl mb-4" />
      <p>Cargando datos del dashboard...</p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
      <FaExclamationTriangle className="text-4xl mb-4" />
      <p className="text-xl">{error}</p>
    </div>
  );

  if (loading) return renderLoader();
  if (error) return renderError();

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Dashboard de Facturación</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-2xl font-bold mb-4 text-center">Facturas Emitidas</h3>
            {invoiceData?.length > 0 ? (
              <Bar 
                data={{
                  labels: invoiceData.map(item => item.restaurant),
                  datasets: [{
                    label: 'Facturas Emitidas',
                    data: invoiceData.map(item => item.invoices),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  }]
                }}
                options={getChartOptions()}
              />
            ) : (
              <p className="text-center py-8">No hay datos de facturas disponibles</p>
            )}
          </div>

          {/* Secciones similares para las demás gráficas */}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`flex flex-col items-center p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {planProgress !== null ? (
              <>
                <div style={{ width: 100, height: 100 }}>
                  <CircularProgressbar 
                    value={planProgress} 
                    text={`${planProgress}%`}
                    styles={{
                      path: { stroke: '#3B82F6' },
                      text: { fill: darkMode ? '#fff' : '#000' }
                    }}
                  />
                </div>
                <h4 className="text-xl font-bold mt-4">Consumo del Plan</h4>
                <p className="text-lg">{100 - planProgress}% de facturas restantes</p>
              </>
            ) : (
              <p className="text-center py-4">Datos de consumo no disponibles</p>
            )}
          </div>

          {/* Sección días restantes */}

        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-2xl font-bold mb-4">Últimos 10 Tickets Facturados</h3>
          {latestInvoices?.length > 0 ? (
            <table className="table-auto w-full text-left">
              <thead>
                <tr>
                  {['Ticket', 'Restaurante', 'Monto', 'IVA', 'Fecha'].map(header => (
                    <th key={header} className="px-4 py-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestInvoices.map(invoice => (
                  <tr key={invoice.ticket} className="border-t border-gray-500">
                    <td className="px-4 py-2">{invoice.ticket}</td>
                    <td className="px-4 py-2">{invoice.restaurant}</td>
                    <td className="px-4 py-2">{invoice.amount?.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN'
                    }) || 'N/A'}</td>
                    <td className="px-4 py-2">{invoice.iva?.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN'
                    }) || 'N/A'}</td>
                    <td className="px-4 py-2">{new Date(invoice.date).toLocaleDateString() || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-8">No se encontraron tickets recientes</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;