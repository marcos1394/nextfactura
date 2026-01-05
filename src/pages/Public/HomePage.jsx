import React from 'react';

// --- IMPORTACIONES CORREGIDAS (Subiendo 2 niveles) ---
// Nota: Como este archivo está en src/pages/Public/, debemos salir dos veces (../../)
// para llegar a src/components/
import Hero from '../../components/HomePageSections/Hero';
import SocialProofSection from '../../components/HomePageSections/SocialProofSection';
import BenefitsSection from '../../components/HomePageSections/BenefitsSection';
import TestimonialsSection from '../../components/HomePageSections/TestimonialsSection';
import PlansSection from '../../components/HomePageSections/PlansSection';
import FaqSection from '../../components/HomePageSections/FaqSection';
import CallToActionSection from '../../components/HomePageSections/CallToActionSection';

/**
 * HomePage - La página de inicio de NextManager.
 * * Estrategia de UX/UI Aplicada: "El Embudo Narrativo"
 * 1. Hero: Captura la atención (Propuesta de valor).
 * 2. SocialProof: Genera confianza inmediata (Logos/Métricas).
 * 3. Benefits: Explica el "Por qué" (Resultados).
 * 4. Testimonials: Valida con terceros (Prueba social humana).
 * 5. Plans: Presenta la oferta clara (Precios).
 * 6. FAQ: Elimina objeciones (Seguridad).
 * 7. CTA: Cierre de venta (Acción final).
 */
function HomePage() {
  return (
    // Usamos un contenedor principal con el fondo base para evitar parpadeos
    <main id="nextmanager-homepage" className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <Hero />
      <SocialProofSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PlansSection />
      <FaqSection />
      <CallToActionSection />
    </main>
  );
}

export default HomePage;