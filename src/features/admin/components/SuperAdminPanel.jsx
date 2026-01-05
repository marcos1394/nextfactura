import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  Users, 
  Activity, 
  Plus, 
  Filter, 
  Lock,
  Eye
} from 'lucide-react';

/**
 * SuperAdminPanel - Panel de control maestro.
 * Permite gestionar a los administradores del sistema y ver métricas globales.
 */
function SuperAdminPanel({ admins = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Métricas calculadas en tiempo real
  const totalClientsManaged = admins.reduce((acc, admin) => acc + (admin.clients?.length || 0), 0);
  const activeAdmins = admins.length; // En un caso real, filtrarías por status

  // Helper para iniciales
  const getInitials = (name) => name.substring(0, 2).toUpperCase();

  return (
    <div className="w-full space-y-8">
      
      {/* --- Header con Acciones Principales --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Modo Dios</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Super Admin
          </h2>
          <p className="text-gray-500 dark:text-slate-400">
            Visión global de la infraestructura y gestión de permisos.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg">
          <Plus className="w-5 h-5" />
          Crear Administrador
        </button>
      </div>

      {/* --- Tarjetas de Métricas (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Admins */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Administradores</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeAdmins}</h3>
          </div>
        </div>

        {/* Card 2: Clientes Totales (Impacto) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Clientes Totales</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalClientsManaged}</h3>
          </div>
        </div>

        {/* Card 3: Estado del Sistema */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Estado del Sistema</p>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Operativo
            </h3>
          </div>
        </div>
      </div>

      {/* --- Sección de Gestión (Tabla) --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar administrador..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 bg-gray-50 dark:bg-slate-800 transition-colors font-medium">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Administrador</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Credenciales</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Carga de Trabajo</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    
                    {/* Admin Profile */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-700">
                            {getInitials(admin.name)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{admin.name}</div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">ID: <span className="font-mono">#{admin.id}</span></div>
                        </div>
                      </div>
                    </td>

                    {/* Email / Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                        <span className="truncate max-w-[150px]">{admin.email}</span>
                        {/* Mock Verified Badge */}
                        <span className="text-blue-500" title="Verificado">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      </div>
                    </td>

                    {/* Clientes */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{admin.clients ? admin.clients.length : 0}</span>
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-500 dark:text-slate-400">clientes</span>
                           {/* Mini barra de capacidad */}
                           <div className="w-16 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mt-0.5">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${Math.min((admin.clients?.length || 0) * 5, 100)}%` }} // Simulación de %
                              ></div>
                           </div>
                        </div>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                        Activo
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Ver Detalles">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Bloquear Acceso">
                          <Lock className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                       <div className="bg-gray-100 dark:bg-slate-900 p-4 rounded-full mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                       </div>
                       <p className="text-lg font-medium text-gray-900 dark:text-white">No se encontraron administradores</p>
                       <p className="text-sm">Intenta ajustar los filtros de búsqueda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400 flex justify-center">
             Datos actualizados en tiempo real • Sistema seguro
        </div>
      </div>
    </div>
  );
}

export default SuperAdminPanel;