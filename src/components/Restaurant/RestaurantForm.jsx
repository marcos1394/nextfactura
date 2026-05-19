import React from 'react';
import { 
    Store, MapPin, Tag, FileText, BookOpen, ChevronDown, 
    Lock, Download, Server, QrCode, Database, User, Cpu, 
    Plus, Trash2, Loader2, AlertTriangle, RefreshCw,
    FileBox
} from 'lucide-react';
import { Card, InputField, FileUpload } from '../ui/FormComponents';

const RestaurantForm = ({ 
    restaurants, 
    activeId, 
    setActiveId, 
    onAdd, 
    onRemove, 
    onUpdate, 
    fiscalRegimes,
    // Props para acciones de conexión y descarga
    isGeneratingKey,
    onGenerateKey,
    onDownloadInstaller,
    isDownloadingInstaller
}) => {
    
    // Obtenemos la sucursal activa actual del array
    const activeRestaurant = restaurants.find(r => r.id === activeId);

    // Si no hay restaurantes (caso raro), no renderizamos nada para evitar errores
    if (!activeRestaurant) return null;

    return (
        <div className="space-y-6">
            
            {/* --- 1. TABS DE SUCURSALES (Navegación horizontal) --- */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-700 no-scrollbar">
                {restaurants.map((r, idx) => (
                    <button
                        key={r.id}
                        onClick={() => setActiveId(r.id)}
                        className={`px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                            activeId === r.id 
                            ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-slate-800 dark:text-blue-400' 
                            : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <Store className="w-4 h-4" />
                        {r.name || `Sucursal ${idx + 1}`}
                    </button>
                ))}
                
                <button 
                    onClick={onAdd} 
                    className="ml-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-1 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" /> Nueva
                </button>
            </div>

            {/* --- 2. FORMULARIO ACTIVO --- */}
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* A. Datos Generales */}
                <Card title="Datos Generales">
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField 
                            icon={Store} 
                            label="Nombre Comercial" 
                            value={activeRestaurant.name} 
                            onChange={e => onUpdate('name', e.target.value)} 
                            placeholder="Ej. Sucursal Centro"
                        />
                        <InputField 
                            icon={MapPin} 
                            label="Dirección (Ubicación Física)" 
                            value={activeRestaurant.address} 
                            onChange={e => onUpdate('address', e.target.value)} 
                            placeholder="Calle, Número y Colonia"
                        />
                    </div>
                </Card>

                {/* B. Datos Fiscales */}
                <Card title="Datos Fiscales">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <InputField 
                            icon={Tag} 
                            label="RFC" 
                            value={activeRestaurant.rfc} 
                            onChange={e => onUpdate('rfc', e.target.value.toUpperCase())} 
                            maxLength={13} 
                            placeholder="XAXX010101000"
                        />
                        <InputField 
                            icon={FileText} 
                            label="Razón Social" 
                            value={activeRestaurant.businessName} 
                            onChange={e => onUpdate('businessName', e.target.value)} 
                            placeholder="Nombre Legal SA de CV"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <InputField 
                            icon={MapPin} 
                            label="Dirección Fiscal (Código Postal)" 
                            value={activeRestaurant.fiscalAddress} 
                            onChange={e => onUpdate('fiscalAddress', e.target.value)} 
                            placeholder="Ej. 06600 (Requerido por SAT)"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Régimen Fiscal</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                            <select 
                                value={activeRestaurant.fiscalRegime} 
                                onChange={e => onUpdate('fiscalRegime', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                            >
                                <option value="">Selecciona un régimen...</option>
                                {fiscalRegimes.map(reg => (
                                    <option key={reg.code} value={reg.code}>{reg.code} - {reg.description}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <FileUpload 
                            label="Certificado (.cer)" 
                            accept=".cer" 
                            file={activeRestaurant.csdCertFile} 
                            onChange={f => onUpdate('csdCertFile', f)} 
                        />
                        <FileUpload 
                            label="Llave Privada (.key)" 
                            accept=".key" 
                            file={activeRestaurant.csdKeyFile} 
                            onChange={f => onUpdate('csdKeyFile', f)} 
                        />
                        <InputField 
                            icon={Lock} 
                            label="Contraseña CSD" 
                            type="password" 
                            value={activeRestaurant.csdPassword} 
                            onChange={e => onUpdate('csdPassword', e.target.value)} 
                        />
                    </div>
                </Card>

                {/* C. Conexión */}
                <Card title="Conexión SoftRestaurant">
                    {/* Selector de Método */}
                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={() => onUpdate('connectionMethod', 'agent')}
                            className={`flex-1 py-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                                activeRestaurant.connectionMethod === 'agent' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
                                : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Download className="w-6 h-6" />
                            <span className="font-medium text-sm">Agente Local (Recomendado)</span>
                        </button>
                        <button 
                            onClick={() => onUpdate('connectionMethod', 'direct')}
                            className={`flex-1 py-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                                activeRestaurant.connectionMethod === 'direct' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm' 
                                : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Server className="w-6 h-6" />
                            <span className="font-medium text-sm">Conexión Directa SQL</span>
                        </button>
                    </div>

                    {/* Contenido Dinámico según Método */}
                    {activeRestaurant.connectionMethod === 'agent' ? (
                        <div className="space-y-4">
                            
                            {/* Sección 1: Clave de Vinculación */}
                            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600 hidden md:block">
                                    <QrCode className="w-10 h-10 text-gray-700 dark:text-white" />
                                </div>
                                <div className="flex-1 w-full text-center md:text-left">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Clave de Vinculación</h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
                                        Esta clave conecta tu caja con la nube de forma segura.
                                    </p>
                                    
                                    <div className="relative">
                                        <input 
                                            readOnly 
                                            value={activeRestaurant.agentKey || "Se generará al guardar..."} 
                                            className="w-full font-mono text-center md:text-left bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg py-2.5 px-4 text-sm text-gray-600 dark:text-slate-300" 
                                        />
                                        {/* Botón de regenerar solo visible si ya hay clave */}
                                        {activeRestaurant.agentKey && onGenerateKey && (
                                            <button 
                                                onClick={onGenerateKey} 
                                                disabled={isGeneratingKey}
                                                className="absolute right-1 top-1 bottom-1 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-gray-600 transition-colors"
                                                title="Regenerar clave"
                                            >
                                                {isGeneratingKey ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCw className="w-4 h-4"/>}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sección 2: Botón de Descarga del Instalador */}
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg text-blue-600 dark:text-blue-300">
                                        <FileBox className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-blue-900 dark:text-blue-100">Instalador de Agente</h5>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">Requerido en el servidor (Windows)</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onDownloadInstaller}
                                    disabled={isDownloadingInstaller}
                                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isDownloadingInstaller ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Descargando...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Descargar .msi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* SQL Directo */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex gap-3 text-amber-800 dark:text-amber-200 text-sm border border-amber-100 dark:border-amber-900/30">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <p>Esta opción requiere exponer tu base de datos a internet (IP Pública o VPN). Asegúrate de configurar tu Firewall (Puerto 1433).</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField 
                                    icon={Server} 
                                    label="Host / IP Pública" 
                                    placeholder="Ej. 201.120.x.x" 
                                    value={activeRestaurant.dbHost} 
                                    onChange={e => onUpdate('dbHost', e.target.value)} 
                                />
                                <InputField 
                                    icon={Cpu} 
                                    label="Puerto" 
                                    placeholder="1433" 
                                    value={activeRestaurant.dbPort} 
                                    onChange={e => onUpdate('dbPort', e.target.value)} 
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <InputField 
                                    icon={Database} 
                                    label="Base de Datos" 
                                    placeholder="SoftRestaurantDB" 
                                    value={activeRestaurant.dbName} 
                                    onChange={e => onUpdate('dbName', e.target.value)} 
                                />
                                <InputField 
                                    icon={User} 
                                    label="Usuario SQL" 
                                    placeholder="sa" 
                                    value={activeRestaurant.dbUser} 
                                    onChange={e => onUpdate('dbUser', e.target.value)} 
                                />
                                <InputField 
                                    icon={Lock} 
                                    label="Contraseña SQL" 
                                    type="password" 
                                    value={activeRestaurant.dbPassword} 
                                    onChange={e => onUpdate('dbPassword', e.target.value)} 
                                />
                            </div>
                        </div>
                    )}
                </Card>

                {/* Botón Eliminar Sucursal */}
                <div className="flex justify-end pt-2">
                    {restaurants.length > 1 && (
                        <button 
                            onClick={() => onRemove(activeId)} 
                            className="px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Eliminar Sucursal
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantForm;