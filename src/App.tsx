/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioLookbook } from './components/PortfolioLookbook';
import { AcademySection } from './components/AcademySection';
import { TeamSection } from './components/TeamSection';
import { LocationMapSection } from './components/LocationMapSection';
import { SocialAndTestimonials } from './components/SocialAndTestimonials';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { ERPModal } from './components/dashboard/ERPModal';
import { ClientPortalModal } from './components/ClientPortalModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { CheckCircle2 } from 'lucide-react';

const StudioAppContent: React.FC = () => {
  const { toastMessage } = useStudio();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans-clean selection:bg-amber-400 selection:text-stone-950 overflow-x-hidden">
      
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 max-w-sm bg-stone-900 border border-amber-500/50 text-stone-100 p-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Main Sections with optimized spacing for 100% display zoom */}
      <Navbar />
      <main className="flex-1 pt-20 lg:pt-24">
        <Hero />
        <BeforeAfterSlider />
        <ServicesSection />
        <PortfolioLookbook />
        <AcademySection />
        <TeamSection />
        <LocationMapSection />
        <SocialAndTestimonials />
      </main>
      <Footer />

      {/* Interactive Modals & Floating Toolsets */}
      <BookingModal />
      <LeadCaptureModal />
      <NotificationCenterModal />
      <ClientPortalModal />
      <ERPModal />
      <LiveChatWidget />

    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <StudioAppContent />
    </StudioProvider>
  );
}
