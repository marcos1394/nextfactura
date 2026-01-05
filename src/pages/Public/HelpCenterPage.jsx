import React from 'react';
import { 
    Search, 
    BookOpen, 
    CreditCard, 
    Settings, 
    LifeBuoy, 
    ChevronRight, 
    MessageCircle,
    FileText
} from 'lucide-react';

// --- DATOS DE MUESTRA ---
const helpCategories = [
    { 
        id: 'getting-started',
        name: 'Primeros Pasos', 
        description: 'Configura tu cuenta, conecta tu POS y personaliza tu portal.', 
        icon: BookOpen, 
        href: '#' 
    },
    { 
        id: 'billing',
        name: 'Facturación y Pagos', 
        description: 'Todo sobre cómo generar facturas, planes y métodos de pago.', 
        icon: CreditCard, 
        href: '#' 
    },
    { 
        id: 'account',
        name: 'Gestión de Cuenta', 
        description: 'Actualiza tu perfil, seguridad y administración de usuarios.', 
        icon: Settings, 
        href: '#' 
    },
];

const popularArticles = [
    { title: 'Guía rápida: Configura tu primer restaurante', href: '#' },
    { title: '¿Cómo cargar mis sellos digitales (CSD)?', href: '#' },
    { title: 'Cambiar o cancelar mi plan de suscripción', href: '#' },
    { title: 'Solución de errores al conectar Soft Restaurant®', href: '#' },
    { title: '¿Cómo recuperar una factura cancelada?', href: '#' },
];

// --- SUBCOMPONENTES ---

const CategoryCard = ({ category }) => (
    <a 
        href={category.href} 
        className="group flex flex-col p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
            <category.icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {category.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
            {category.description}
        </p>
    </a>
);

const ArticleLink = ({ title, href }) => (
    <a 
        href={href} 
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
    >
        <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span className="font-medium text-gray-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
            </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </a>
);

// --- COMPONENTE PRINCIPAL ---

function HelpCenterPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            
            {/* --- HERO SECTION (Buscador) --- */}
            <div className="bg-slate-900 relative overflow-hidden">
                {/* Patrón de fondo sutil */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                <div className="relative max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        <LifeBuoy className="w-4 h-4" /> Centro de Ayuda
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        ¿Cómo podemos ayudarte hoy?
                    </h1>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Busca en nuestra base de conocimientos o explora por categorías para encontrar respuestas rápidas.
                    </p>

                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-500/30 shadow-xl transition-all"
                            placeholder="Buscar artículos (ej. 'conectar impresora', 'factura XML')..."
                        />
                    </div>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
                
                {/* Grid de Categorías */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {helpCategories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Artículos Populares */}
                    <div className="lg:col-span-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Artículos más consultados
                        </h2>
                        <div className="space-y-3">
                            {popularArticles.map((article, idx) => (
                                <ArticleLink key={idx} title={article.title} href={article.href} />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar de Ayuda Extra */}
                    <div className="lg:col-span-4">
                        <div className="bg-blue-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-blue-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                ¿No encuentras lo que buscas?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6">
                                Nuestro equipo de soporte está disponible para resolver problemas técnicos complejos.
                            </p>
                            <a 
                                href="/contact" 
                                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contactar Soporte
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HelpCenterPage;