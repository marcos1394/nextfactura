import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckBadgeIcon, 
  CloudIcon, 
  DevicePhoneMobileIcon, 
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArchiveBoxIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/24/solid';
import CountUp from 'react-countup';


const NextFacturaHero = () => {
  const [activePhrase, setActivePhrase] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('mensual');
  const [selectedProduct, setSelectedProduct] = useState('NEXFACTURA');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const socialProofRef = useRef(null);
// Hook para detectar si un elemento está visible
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
};

const isSocialProofVisible = useOnScreen(socialProofRef);


  const typingPhrases = [
    "Automatiza tu facturación con NextFactura",
    "Solución integral para restaurantes",
    "Conexión perfecta con SoftRestaurant",
    "Simplifica tu gestión de facturas"
  ];

  const planDetails = {
    'NEXFACTURA': {
      mensual: { 
        precio: 450, 
        descripcion: [
          "Hasta 200 facturas mensuales",
          "Soporte básico por correo",
          "Integración básica con SoftRestaurant",
          "Generación de reportes simples"
        ]
      },
      semestral: { 
        precio: 2300, 
        descripcion: [
          "Hasta 1,500 facturas en 6 meses",
          "Soporte prioritario",
          "Integración completa con SoftRestaurant",
          "Reportes avanzados",
          "Ahorro de $400"
        ]
      },
      anual: { 
        precio: 4150, 
        descripcion: [
          "Facturación ilimitada",
          "Soporte premium 24/7",
          "Actualizaciones gratuitas",
          "Integración personalizada",
          "Consultoría trimestral",
          "Mayor ahorro del año"
        ]
      }
    },
    'NEXTMANAGER': {
      mensual: { 
        precio: 430, 
        descripcion: [
          "Panel de administración básico",
          "Seguimiento de ventas",
          "Exportación de datos",
          "Alertas básicas"
        ]
      },
      semestral: { 
        precio: 2200, 
        descripcion: [
          "Panel de administración completo",
          "Análisis de tendencias",
          "Exportación avanzada",
          "Alertas personalizadas",
          "Ahorro de $380"
        ]
      },
      anual: { 
        precio: 3950, 
        descripcion: [
          "Gestión financiera avanzada",
          "Reportes ejecutivos",
          "Predicción de ventas",
          "Integración con contabilidad",
          "Asesoría financiera",
          "Mayor flexibilidad"
        ]
      }
    },
    'COMBINADO': {
      anual: { 
        precio: 7500, 
        descripcion: [
          "NextFactura + NextManager",
          "Facturación ilimitada",
          "Soporte técnico prioritario",
          "Sesión de capacitación especial",
          "Consultoría semestral",
          "Ahorro de $600",
          "Integración total",
          "Actualizaciones premium"
        ]
      }
    }
  };

  const testimonials = [
    {
      name: "Carlos Mendoza",
      role: "Dueño de Restaurante",
      quote: "NextFactura transformó completamente nuestra gestión administrativa. Ahora, facturo en segundos lo que antes me tomaba horas.",
      avatar: "/images/ejemplo1.jpg"
    },
    {
      name: "María Rodríguez",
      role: "Gerente Financiera",
      quote: "La integración con SoftRestaurant es perfecta. Nuestros reportes son más precisos y eficientes gracias a NextFactura.",
      avatar: "/images/ejemplo3.jpg"
    },
    {
      name: "Juan González",
      role: "Consultor Tecnológico",
      quote: "Un software que realmente entiende las necesidades de los restaurantes. La seguridad y las actualizaciones son excepcionales.",
      avatar: "/images/ejemplo2.jpg"
    }
  ];

  const frequentQuestions = [
    {
      question: "¿Cómo funciona la integración con SoftRestaurant?",
      answer: "NextFactura se sincroniza automáticamente con tu sistema de punto de venta. Todos los datos de ventas se convierten en facturas electrónicas en tiempo real sin intervención manual."
    },
    {
      question: "¿Qué pasa si necesito soporte técnico?",
      answer: "Ofrecemos soporte técnico por correo electrónico y teléfono. Los planes semestral y anual incluyen soporte prioritario con tiempos de respuesta más rápidos."
    },
    {
      question: "¿Puedo probar NextFactura antes de comprar?",
      answer: "¡Claro! Ofrecemos una demo gratuita donde podrás explorar todas las funcionalidades de NextFactura y ver cómo puede transformar tu gestión."
    },
    {
      question: "¿Es seguro almacenar mis datos fiscales?",
      answer: "Utilizamos encriptación de última generación y cumplimos con todas las normativas de seguridad fiscal. Tus datos están 100% protegidos."
    }
  ];

  const socialProof = [
    { icon: UsersIcon, number: "+5,000", label: "Restaurantes Atendidos" },
    { icon: StarIcon, number: "4.8/5", label: "Calificación de Usuarios" },
    { icon: DocumentTextIcon, number: "+1M", label: "Facturas Generadas" }
  ];

  const beneficios = [
    { 
      icon: CheckBadgeIcon, 
      title: "Facturación Automática", 
      description: "Genera facturas instantáneamente con un solo clic, eliminando procesos manuales tediosos." 
    },
    { 
      icon: CloudIcon, 
      title: "Integración SoftRestaurant", 
      description: "Sincronización perfecta y en tiempo real con tu sistema de punto de venta." 
    },
    { 
      icon: DevicePhoneMobileIcon, 
      title: "Gestión Móvil", 
      description: "Administra tus facturas y ventas desde cualquier dispositivo, en cualquier momento." 
    },
    { 
      icon: ChartBarIcon, 
      title: "Análisis Financiero", 
      description: "Obtén insights detallados sobre tus ventas, tendencias y rendimiento financiero." 
    },
    { 
      icon: LightBulbIcon, 
      title: "Soluciones Inteligentes", 
      description: "Recomendaciones personalizadas para optimizar tu facturación y gestión." 
    },
    { 
      icon: ShieldCheckIcon, 
      title: "Seguridad Certificada", 
      description: "Protección de datos de última generación y cumplimiento de normativas fiscales." 
    },
    { 
      icon: CreditCardIcon, 
      title: "Pagos Integrados", 
      description: "Facilita el cobro con múltiples métodos de pago y seguimiento de transacciones." 
    },
    { 
      icon: ArchiveBoxIcon, 
      title: "Respaldos Automáticos", 
      description: "Almacenamiento seguro y recuperación instantánea de todos tus documentos fiscales." 
    }
  ];

// Carrusel automático
useEffect(() => {
  const interval = setInterval(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, 5000); // Cambia cada 5 segundos

  return () => clearInterval(interval); // Limpia el intervalo al desmontar
}, [testimonials.length]);

useEffect(() => {
  const interval = setInterval(() => {
    setActivePhrase((prev) => (prev + 1) % typingPhrases.length);
  }, 3000); // Cambia cada 3 segundos

  return () => clearInterval(interval); // Limpia el intervalo al desmontar
}, [activePhrase]);



  const renderPlanPricing = (product) => {
    if (product === 'COMBINADO') {
      const plan = planDetails[product]['anual'];
      return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 rounded-xl shadow-2xl">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <SparklesIcon className="w-8 h-8 mr-2 text-yellow-300" />
            Paquete Anual Combinado
          </h3>
          <p className="text-3xl font-extrabold mb-4">${plan.precio} MXN</p>
          <ul className="space-y-2 text-sm">
            {plan.descripcion.map((item, index) => (
              <li key={index} className="flex items-center">
                <CheckBadgeIcon className="w-5 h-5 mr-2 text-yellow-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="space-y-3">
          {['mensual', 'semestral', 'anual'].map((period) => (
            <div 
              key={period} 
              className={`p-4 rounded-lg transition-all ${
                currentPlan === period 
                  ? 'bg-blue-100 dark:bg-blue-900' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setCurrentPlan(period)}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="capitalize font-bold text-lg">{period.charAt(0).toUpperCase() + period.slice(1)}</span>
                <span className="font-extrabold text-xl">
                  ${planDetails[product][period].precio} MXN
                </span>
              </div>
              <ul className="space-y-1 text-sm">
                {planDetails[product][period].descripcion.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckBadgeIcon className="w-4 h-4 mr-2 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-gray-900 dark:from-gray-900 dark:to-black dark:text-white transition-all duration-700">
{/* Hero Section */}
<div className="container mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">

        {/* Left Side: Hero Content */}
        <div className="space-y-8">
        <motion.h1 
  key={activePhrase}
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ duration: 0.8 }}
  className="text-5xl font-bold"
>
  {typingPhrases[activePhrase]}
</motion.h1>



<p className="text-xl text-gray-800 dark:text-gray-200">

            Solución completa de facturación electrónica diseñada específicamente para restaurantes que utilizan SoftRestaurant.
          </p>

          <div className="flex space-x-4">
          <button className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-500 transition-all duration-300 shadow-lg">
          Comenzar Ahora
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-500 transition-all duration-300 shadow-lg">
            Solicitar Demo
            </button>
          </div>
        </div>

        {/* Right Side: Plans */}
        <div className="space-y-6">
          <div className="flex space-x-4 mb-6">
            {['NEXFACTURA', 'NEXTMANAGER', 'COMBINADO'].map((product) => (
              <button 
                key={product}
                onClick={() => setSelectedProduct(product)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedProduct === product 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                {product}
              </button>
            ))}
          </div>

          {renderPlanPricing(selectedProduct)}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Beneficios de NextFactura</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {beneficios.map(({ icon: Icon, title, description }, index) => (
             <motion.div 
             key={title}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             whileHover={{
               scale: 1.1,
               backgroundColor: "rgba(59, 130, 246, 0.1)",
               borderColor: "#3b82f6",
               borderWidth: 2,
             }}
             transition={{ delay: index * 0.1 }}
             className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-transparent hover:shadow-lg"
           >
             <Icon className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
             <h3 className="text-xl font-bold text-center mb-3 text-blue-700">{title}</h3>
             <p className="text-center text-gray-600 dark:text-gray-300">{description}</p>
           </motion.div>
           
            ))}
          </div>
        </div>
      </div>

    {/* Social Proof Section - Completed Implementation */}
    <div ref={socialProofRef} className="bg-white dark:bg-gray-900 py-16">

  <div className="container mx-auto px-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
  {socialProof.map(({ icon: Icon, number, label }, index) => (
    <motion.div 
      key={label}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.2 }}
      className="bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg"
    >
      <Icon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
      <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">

      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isSocialProofVisible ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 1 }}
>
  <CountUp start={0} end={parseInt(number.replace(/[^\d]/g, ''))} duration={2} />
</motion.div>


      </h3>
      <p className="text-gray-800 dark:text-gray-300">{label}</p>
    </motion.div>
  ))}
</div>
    
    {/* Optional: Testimonial Carousel */}
    <div className="mt-16">
      <h3 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h3>
      <div className="max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
      <motion.div
  key={activeTestimonial}
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -50 }}
  transition={{ duration: 0.5 }}
  className="bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-xl text-center"
>
  <p className="italic text-xl mb-6">"{testimonials[activeTestimonial].quote}"</p>
  <div className="flex items-center justify-center space-x-4">
    <img 
      src={testimonials[activeTestimonial].avatar} 
      alt={testimonials[activeTestimonial].name} 
      className="w-16 h-16 rounded-full shadow-lg"
    />
    <div>
      <h4 className="font-bold text-blue-700 dark:text-blue-300">{testimonials[activeTestimonial].name}</h4>
      <p className="text-gray-600 dark:text-gray-400">{testimonials[activeTestimonial].role}</p>
    </div>
  </div>
</motion.div>

        {/* Testimonial Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-3">
  {testimonials.map((_, index) => (
    <motion.button
      key={index}
      onClick={() => setActiveTestimonial(index)}
      className={`w-3 h-3 rounded-full transition-all ${
        activeTestimonial === index 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-6' 
          : 'bg-gray-300 dark:bg-gray-600'
      }`}
      whileHover={{ scale: 1.2 }}
    />
  ))}
</div>

      </div>
    </div>
  </div>
</div>
<div className="container mx-auto py-16">
  <h3 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
  <div className="space-y-4">
    {frequentQuestions.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${
          activeQuestion === index ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <button
          className="flex justify-between w-full text-left text-lg font-medium"
          onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
        >
          {item.question}
          <motion.span
            className="ml-2 text-blue-500"
            animate={{ rotate: activeQuestion === index ? 180 : 0 }}
          >
            ▼
          </motion.span>
        </button>
        {activeQuestion === index && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-gray-600 dark:text-gray-300"
          >
            {item.answer}
          </motion.p>
        )}
      </motion.div>
    ))}
  </div>
</div>


</div>
)}
export default NextFacturaHero;
