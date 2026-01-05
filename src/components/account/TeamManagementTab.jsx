import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UserPlus, MoreVertical, Shield, Eye, Edit2, Trash2, 
    Mail, CheckCircle, Clock, X, User 
} from 'lucide-react';

// --- MOCK DATA ---
const mockTeamMembers = [
    { 
        id: 'user_1', 
        name: 'Carlos Mendoza', 
        email: 'carlos.mendoza@elsazon.com', 
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop', 
        role: 'Propietario', 
        status: 'active' 
    },
    { 
        id: 'user_2', 
        name: 'Ana García', 
        email: 'ana.garcia@contador.com', 
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop', 
        role: 'Contador', 
        status: 'active' 
    },
    { 
        id: 'user_3', 
        name: 'Invitación Pendiente', 
        email: 'gerente@restaurante.com', 
        avatarUrl: null, 
        role: 'Gerente', 
        status: 'pending' 
    },
];

const roles = [
    { id: 'admin', name: 'Administrador', description: 'Acceso total, excepto facturación y gestión de planes.' },
    { id: 'accountant', name: 'Contador', description: 'Acceso de solo lectura a reportes y facturas.' },
    { id: 'viewer', name: 'Lector', description: 'Acceso de solo lectura al dashboard principal.' },
];

// --- COMPONENTES AUXILIARES ---

const StatusBadge = ({ status }) => {
    const config = {
        active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, label: 'Activo' },
        pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock, label: 'Pendiente' },
        inactive: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: X, label: 'Inactivo' },
    };
    const { color, icon: Icon, label } = config[status] || config.inactive;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
        </span>
    );
};

const Avatar = ({ src, alt, name }) => {
    if (src) {
        return <img className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" src={src} alt={alt} />;
    }
    return (
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm border border-transparent">
            {name ? name.charAt(0).toUpperCase() : <User className="w-5 h-5"/>}
        </div>
    );
};

// --- MODAL DE INVITACIÓN ---
const InviteMemberModal = ({ isOpen, onClose }) => {
    const handleInvite = (e) => {
        e.preventDefault();
        // Aquí iría la lógica real de invitación
        alert('Invitación enviada (simulado).');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    {/* Modal */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                        className="relative bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Invitar Colaborador</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Envía un acceso seguro a tu equipo.</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleInvite} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder="colaborador@ejemplo.com" 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rol y Permisos</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <select 
                                        required 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    >
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-blue-700 dark:text-blue-300">
                                    <span className="font-semibold">Nota:</span> Los administradores tienen acceso completo excepto a facturación.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
                                >
                                    Enviar Invitación
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- COMPONENTE PRINCIPAL ---
function TeamManagementTab() {
    const [members, setMembers] = useState(mockTeamMembers);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Header de la Tabla */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-blue-500" />
                            Miembros del Equipo
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                            Gestiona quién tiene acceso a tu panel de control.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:bg-blue-700 transition-all hover:shadow-md active:scale-95"
                    >
                        <UserPlus className="w-4 h-4"/> 
                        Invitar
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Rol</th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-6 py-3.5"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <Avatar src={member.avatarUrl} alt={member.name} name={member.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded w-fit">
                                            <Shield className="w-3.5 h-3.5 text-gray-500" />
                                            {member.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={member.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Editar">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Eliminar">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <InviteMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

// Icono auxiliar para el título (si no lo importaste arriba)
import { Users as UsersIcon } from 'lucide-react';

export default TeamManagementTab;