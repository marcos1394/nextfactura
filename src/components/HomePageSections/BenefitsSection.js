// src/components/HomePageSections/BenefitsSection.js
import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckBadgeIcon, CloudIcon, DevicePhoneMobileIcon, ChartBarIcon,
  LightBulbIcon, ShieldCheckIcon, CreditCardIcon, ArchiveBoxIcon
} from '@heroicons/react/24/solid';

const beneficios = [
  { icon: CheckBadgeIcon, title: "Facturación Automática", description: "Genera facturas instantáneamente con un solo clic, eliminando procesos manuales." },
  { icon: CloudIcon, title: "Integración SoftRestaurant", description: "Sincronización perfecta y en tiempo real con tu sistema punto de venta." },
  { icon: DevicePhoneMobileIcon, title: "Gestión Móvil", description: "Administra tus facturas y ventas desde cualquier dispositivo, en cualquier momento." },
  { icon: ChartBarIcon, title: "Análisis Financiero", description: "Obtén insights detallados sobre tus ventas, tendencias y rendimiento." },
  { icon: LightBulbIcon, title: "Soluciones Inteligentes", description: "Recomendaciones personalizadas para optimizar tu facturación y gestión." },
  { icon: ShieldCheckIcon, title: "Seguridad Certificada", description: "Protección de datos de última generación y cumplimiento de normativas." },
  { icon: CreditCardIcon, title: "Pagos Integrados", description: "Facilita el cobro con múltiples métodos y seguimiento de transacciones." },
  { icon: ArchiveBoxIcon, title: "Respaldos Automáticos", description: "Almacenamiento seguro y recuperación instantánea de documentos fiscales." }
];

const BenefitsSection = () => {
  return (
    <div id="benefits" className="bg-white dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Beneficios Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {beneficios.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }} // Anima cuando entra en vista
              viewport={{ once: true, amount: 0.3 }} // Configuración de whileInView
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;