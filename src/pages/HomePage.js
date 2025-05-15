// src/pages/HomePage.js
import React from 'react';
import Hero from '../components/HomePageSections/Hero'; // Ajusta la ruta si es necesario
import PlansSection from '../components/HomePageSections/PlansSection';
import BenefitsSection from '../components/HomePageSections/BenefitsSection';
import SocialProofSection from '../components/HomePageSections/SocialProofSection';
import TestimonialsSection from '../components/HomePageSections/TestimonialsSection';
import FaqSection from '../components/HomePageSections/FaqSection';

function HomePage() {
  return (
    // Usamos un Fragment <>...</> o un div si necesitas un contenedor específico
    <>
      <Hero />
      <PlansSection /> {/* Muestra los planes debajo del Hero */}
      <BenefitsSection />
      <SocialProofSection />
      <TestimonialsSection />
      <FaqSection />
      {/* Puedes añadir más secciones aquí si las tienes */}
    </>
  );
}

export default HomePage;