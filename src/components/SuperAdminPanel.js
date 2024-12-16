import React from 'react';

function SuperAdminPanel({ admins }) {
  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-3xl font-bold mb-6">Panel de Superadministrador</h2>
      
      {/* Gestión de Administradores */}
      <section className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Gestión de Administradores</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Email</th>
              <th className="py-2">Clientes</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="py-2">{admin.id}</td>
                <td className="py-2">{admin.name}</td>
                <td className="py-2">{admin.email}</td>
                <td className="py-2">{admin.clients.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default SuperAdminPanel;
