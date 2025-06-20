// src/pages/HomePage.js

import React from 'react';

// Importación de todos los componentes optimizados en el orden estratégico
import Hero from '../components/HomePageSections/Hero';
import SocialProofSection from '../components/HomePageSections/SocialProofSection';
import BenefitsSection from '../components/HomePageSections/BenefitsSection';
import TestimonialsSection from '../components/HomePageSections/TestimonialsSection';
import PlansSection from '../components/HomePageSections/PlansSection';
import FaqSection from '../components/HomePageSections/FaqSection';
import CallToActionSection from '../components/HomePageSections/CallToActionSection';

/**
 * HomePage - La página de inicio de NextManager, completamente reconstruida.
 * * Estrategia de UX/UI Aplicada: "El Embudo Narrativo"
 * Esta página ya no es una lista de secciones, sino un viaje guiado para el usuario:
 * 1.  <Hero />:                 Captura la atención con una propuesta de valor clara y potente.
 * 2.  <SocialProofSection />:   Construye confianza inmediata con logos y métricas.
 * 3.  <BenefitsSection />:      Demuestra el valor real, enfocándose en resultados.
 * 4.  <TestimonialsSection />:  Valida los beneficios con pruebas sociales humanas.
 * 5.  <PlansSection />:         Presenta la oferta (precios) de forma clara y comparable.
 * 6.  <FaqSection />:           Resuelve las últimas dudas y objeciones.
 * 7.  <CallToActionSection />:  Impulsa la conversión con una llamada a la acción final y directa.
 *
 * Cada componente ha sido rediseñado para máxima claridad, impacto visual y persuasión.
 */
function HomePage() {
  return (
    // Usamos <main> para la semántica y accesibilidad.
    // El id es útil para anclas o estilos específicos.
    <main id="nextmanager-homepage" role="main">
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
