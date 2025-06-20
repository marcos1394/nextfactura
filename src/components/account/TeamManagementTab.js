// src/components/account/TeamManagementTab.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Usaremos un set de iconos consistente y de alta calidad
import { UserPlusIcon, EllipsisVerticalIcon, ShieldCheckIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

// --- MOCK DATA (DATOS DE MUESTRA PARA DISEÑO) ---
const mockTeamMembers = [
    { id: 'user_1', name: 'Carlos Mendoza', email: 'carlos.mendoza@elsazon.com', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop', role: 'Propietario', status: 'Activo' },
    { id: 'user_2', name: 'Ana García (Contadora)', email: 'ana.garcia@contador.com', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop', role: 'Contador', status: 'Activo' },
    { id: 'user_3', name: 'invitacion@gerente.com', email: 'invitacion@gerente.com', avatarUrl: null, role: 'Gerente', status: 'Invitación Pendiente' },
];

const roles = [
    { id: 'admin', name: 'Administrador', description: 'Acceso total, excepto facturación y gestión de planes.' },
    { id: 'accountant', name: 'Contador', description: 'Acceso de solo lectura a reportes y facturas.' },
    { id: 'viewer', name: 'Lector', description: 'Acceso de solo lectura al dashboard principal.' },
];

// Componente del Modal para invitar
const InviteMemberModal = ({ isOpen, onClose }) => {
    const handleInvite = (e) => {
        e.preventDefault();
        alert('Invitación enviada (simulado).');
        onClose();
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invitar Nuevo Miembro</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">La persona recibirá un enlace por correo para unirse a tu equipo.</p>
                        </div>
                        <form onSubmit={handleInvite}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                                    <input type="email" required placeholder="nombre@ejemplo.com" className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Asignar Rol</label>
                                    <select required className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900">
                                        {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-slate-600">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white">Enviar Invitación</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


function TeamManagementTab() {
    const [members, setMembers] = useState(mockTeamMembers);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm">
                <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Equipo</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Invita y administra a los miembros que tienen acceso a esta cuenta.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-700">
                        <UserPlusIcon className="w-5 h-5"/> Invitar Miembro
                    </button>
                </div>
                <div className="flow-root">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Nombre</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Rol</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">Estado</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-slate-700">
                            {members.map(member => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {member.avatarUrl ? <img className="h-10 w-10 rounded-full object-cover" src={member.avatarUrl} alt="" /> : <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center"><UserCircleIcon className="w-6 h-6 text-gray-400"/></div>}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-slate-400">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-slate-300">{member.role}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'Activo' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-500 hover:text-gray-700"><EllipsisVerticalIcon className="w-5 h-5"/></button>
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

export default TeamManagementTab;
