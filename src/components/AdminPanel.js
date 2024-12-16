import React from 'react';

function AdminPanel({ clients }) {
  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-3xl font-bold mb-6">Panel de Administración</h2>
      
      {/* Gestión de Clientes */}
      <section className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Gestión de Clientes</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Email</th>
              <th className="py-2">Tickets Facturados</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="py-2">{client.id}</td>
                <td className="py-2">{client.name}</td>
                <td className="py-2">{client.email}</td>
                <td className="py-2">{client.tickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminPanel;
