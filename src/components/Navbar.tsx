import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Sparkles, Calendar, UserCheck, Shield, Menu, X, Bell, MapPin, GraduationCap, Receipt, ChevronRight } from 'lucide-react';
import { STUDIO_INFO, STUDIO_LOGO } from '../data/initialData';

export const Navbar: React.FC = () => {
  const {
    openBookingModal,
    openERPModal,
    openNotificationsModal,
    openClientPortal,
    session,
    notifications
  } = useStudio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingNotifsCount = notifications.filter(n => n.status === 'scheduled').length;

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Deepika Sharma Makeup Studio & Academy) */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-400/70 shadow-md shadow-amber-950/40 shrink-0 transition-transform duration-300 group-hover:scale-105 bg-stone-900">
              <img src={STUDIO_LOGO} alt="Deepika Sharma Monogram Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif-luxury text-2xl tracking-wider text-amber-100 font-semibold uppercase block leading-none">
                Deepika Sharma
              </span>
              <span className="text-[10px] tracking-[0.2em] text-rose-300 uppercase block font-medium mt-1">
                Makeup Studio & Academy · Barabanki
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide text-stone-300">
            <a href="#services" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
              Services & Pricing
            </a>
            <a href="#transformations" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
              Before & After
            </a>
            <a href="#lookbook" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
              Lookbook
            </a>
            <a href="#academy" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Academy</span>
            </a>
            <a href="#artists" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
              Artists
            </a>
            <a href="#location" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Studio Map</span>
            </a>
            <a href="#reviews" className="hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
              Reviews
            </a>
          </nav>

          {/* Zone 3: Primary Actions & ERP Portal */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Reminders Bell */}
            <button
              onClick={openNotificationsModal}
              title="Client Appointment Reminders & Push Queue"
              className="relative p-2.5 rounded-full text-stone-300 hover:text-amber-200 hover:bg-stone-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {pendingNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingNotifsCount}
                </span>
              )}
            </button>

            {/* Secure Bride & Client Portal Button */}
            <button
              onClick={() => openClientPortal()}
              title="Customer Portal: View Bridal Appointments & Download Digital Receipts"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-amber-500/40 bg-stone-900/90 hover:bg-stone-850 text-stone-200 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              <span>My Bookings</span>
            </button>

            {/* Studio ERP / Staff Portal Button (Owner / Staff only) */}
            <button
              onClick={openERPModal}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                session.role === 'owner'
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-200 hover:bg-amber-900/50'
                  : session.role === 'employee'
                  ? 'border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700'
                  : 'border-stone-800 bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {session.role === 'owner'
                  ? 'Owner ERP'
                  : session.role === 'employee'
                  ? `Staff (${session.name.split(' ')[0]})`
                  : 'Salon ERP'}
              </span>
            </button>

            {/* Primary Action: Book Online Advance */}
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Advance</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-950 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col gap-3 text-sm font-medium text-stone-300">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Services & Pricing
            </a>
            <a
              href="#transformations"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Before & After Makeovers
            </a>
            <a
              href="#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Bridal Lookbook
            </a>
            <a
              href="#academy"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Beauty Academy Courses
            </a>
            <a
              href="#artists"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Our Artists & Team
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Studio Map (Lakhpedabagh)
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-200 py-1"
            >
              Client Reviews
            </a>
          </nav>
          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openClientPortal();
              }}
              className="w-full text-left py-2 px-3 rounded text-xs font-medium text-amber-200 bg-stone-900 border border-amber-500/30 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>My Bookings & Digital Receipts</span>
              </span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openERPModal();
              }}
              className="w-full text-left py-2 px-3 rounded text-xs font-medium text-stone-300 bg-stone-900 border border-stone-800 flex items-center justify-between"
            >
              <span>Salon ERP Management Portal</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
