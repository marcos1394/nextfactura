import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { Search, Ticket, Mail, CheckCircle } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

Modal.setAppElement('#root');

function TicketSearch() {
  const [ticketData, setTicketData] = useState({
    ticketNumber: '',
    amount: '',
    date: '',
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const handleChange = (e) => {
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    const { ticketNumber, amount, date } = ticketData;

    if (!ticketNumber || !amount || !date) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tickets/search`,
        {
          ticketNumber,
          amount,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setSelectedTicket(response.data.data);
        toast.success('Ticket encontrado. Puedes proceder a facturar.');
      } else {
        setSelectedTicket(null);
        toast.error('Ticket no encontrado.');
      }
    } catch (error) {
      console.error('Error al buscar el ticket:', error);
      toast.error('Error al buscar el ticket.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacturar = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      const facturaData = {
        email,
        prueba: false,
        opciones: ['CALCULAR_SELLO'],
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/timbrado/timbrar`,
        {
          restaurantId: selectedTicket.restaurantId,
          ticketId: selectedTicket.id,
          facturaData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        toast.success(`Factura generada correctamente. En breve la recibirás en ${email}.`);
        setIsModalOpen(false);
      } else {
        toast.error('Error al generar la factura.');
      }
    } catch (error) {
      console.error('Error al timbrar la factura:', error);
      if (error.response && error.response.data && error.response.data.details) {
        toast.error(`Error al timbrar la factura: ${error.response.data.details}`);
      } else {
        toast.error('Error al timbrar la factura.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`p-6 text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <div className="flex justify-center mb-4">
            <Ticket className={`w-12 h-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Buscar Ticket
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Ingresa los detalles de tu ticket para facturar
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="ticketNumber"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-400'
                }`}
                placeholder="Número de Ticket"
                value={ticketData.ticketNumber}
                onChange={handleChange}
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Ticket className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                name="amount"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-400'
                }`}
                placeholder="Monto"
                value={ticketData.amount}
                onChange={handleChange}
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <span className={`text-lg font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
              </div>
            </div>

            <div className="relative">
              <input
                type="date"
                name="date"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-400'
                }`}
                value={ticketData.date}
                onChange={handleChange}
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
                darkMode 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Buscando...' : 'Buscar Ticket'}</span>
            </button>
          </div>

          {selectedTicket && (
            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Ticket Encontrado
              </h3>
              <div className="space-y-2">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Número de Ticket:</strong> {selectedTicket.ticketNumber}
                </p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Monto:</strong> {selectedTicket.amount} MXN
                </p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Fecha:</strong> {new Date(selectedTicket.date).toLocaleDateString()}
                </p>
                <button
                  onClick={handleFacturar}
                  className={`w-full py-3 mt-4 rounded-lg transition-all duration-300 ${
                    darkMode 
                      ? 'bg-green-700 text-white hover:bg-green-600' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Facturar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={`outline-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-t-2xl`}>
          <div className="flex justify-center mb-4">
            <Mail className={`w-12 h-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Enviar Factura
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleModalSubmit}>
            <div className="relative mb-4">
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-400'
                }`}
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Facturando...' : 'Enviar Factura'}
            </button>
          </form>
        </div>
      </Modal>

      <ToastContainer theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
}

export default TicketSearch;