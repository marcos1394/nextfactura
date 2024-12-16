import React, { useState } from 'react';

const PortalFacturacionTemplate = ({ 
  logo, 
  nombreRestaurante, 
  colorPrimario = '#3498db', 
  colorDegradado = ['#3498db', '#2c3e50'], 
  textoHero, 
  datosRestaurante 
}) => {
  const [ticket, setTicket] = useState('');

  const handleBuscarTicket = () => {
    // Aquí puedes manejar la lógica para buscar tickets
    alert(`Buscando ticket: ${ticket}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className="py-4" 
        style={{ backgroundColor: colorPrimario }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {logo && <img src={logo} alt="Logo del restaurante" className="h-12" />}
          <h1 className="text-white text-2xl font-bold">{nombreRestaurante || 'Nombre del Restaurante'}</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="flex items-center justify-center text-center text-white py-20"
        style={{
          background: `linear-gradient(135deg, ${colorDegradado[0]}, ${colorDegradado[1]})`,
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">{textoHero || 'Encuentra tu ticket y genera tu factura fácilmente'}</h2>
          <div className="flex justify-center gap-4 mt-6">
            <input
              type="text"
              placeholder="Número de ticket"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              className="px-4 py-2 rounded-lg text-black"
            />
            <button
              onClick={handleBuscarTicket}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-300 transition"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-lg">{nombreRestaurante || 'Nombre del Restaurante'}</p>
          {datosRestaurante && (
            <div className="mt-2">
              <p>{`Dirección: ${datosRestaurante.direccion || 'No especificada'}`}</p>
              <p>{`Teléfono: ${datosRestaurante.telefono || 'No especificado'}`}</p>
              <p>{`Correo: ${datosRestaurante.correo || 'No especificado'}`}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PortalFacturacionTemplate;
