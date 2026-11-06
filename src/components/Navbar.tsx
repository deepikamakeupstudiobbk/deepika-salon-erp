import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Sparkles, Calendar, UserCheck, Shield, Menu, X, Bell, MapPin, GraduationCap, Receipt, ChevronRight } from 'lucide-react';
import { STUDIO_LOGO } from '../data/initialData';

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/70 shadow-md shadow-amber-950/40 shrink-0 transition-transform duration-300 group-hover:scale-105 bg-stone-900">
              <img src={STUDIO_LOGO} alt="Deepika Sharma Monogram Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-serif-luxury text-xl sm:text-2xl tracking-wider text-amber-100 font-semibold uppercase block leading-none">
                Deepika Sharma
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.15em] text-rose-300 uppercase block font-medium mt-0.5">
                Makeup Studio & Academy · BBK
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Compact Spacing for 100% Viewport) */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-medium tracking-wide text-stone-300">
            <a href="#services" className="hover:text-amber-200 transition-colors whitespace-nowrap">Services</a>
            <a href="#transformations" className="hover:text-amber-200 transition-colors whitespace-nowrap">Before & After</a>
            <a href="#lookbook" className="hover:text-amber-200 transition-colors whitespace-nowrap">Lookbook</a>
            <a href="#academy" className="hover:text-amber-200 transition-colors whitespace-nowrap flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Academy</span>
            </a>
            <a href="#artists" className="hover:text-amber-200 transition-colors whitespace-nowrap">Artists</a>
            <a href="#location" className="hover:text-amber-200 transition-colors whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Map</span>
            </a>
            <a href="#reviews" className="hover:text-amber-200 transition-colors whitespace-nowrap">Reviews</a>
          </nav>

          {/* Zone 3: Primary Actions & ERP Portal */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={openNotificationsModal}
              title="Notifications"
              className="relative p-2 rounded-full text-stone-300 hover:text-amber-200 hover:bg-stone-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {pendingNotifsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingNotifsCount}
                </span>
              )}
            </button>

            {/* Client Portal Button */}
            <button
              onClick={() => openClientPortal()}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border border-amber-500/40 bg-stone-900 text-stone-200 hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <Receipt className="w-3 h-3 text-amber-400" />
              <span>My Bookings</span>
            </button>

            {/* Owner/Staff ERP Button */}
            <button
              onClick={openERPModal}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors whitespace-nowrap ${
                session.role === 'owner'
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-200'
                  : session.role === 'employee'
                  ? 'border-stone-700 bg-stone-800 text-stone-300'
                  : 'border-stone-800 bg-stone-900 text-stone-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>{session.role === 'owner' ? 'ERP' : session.role === 'employee' ? 'Staff' : 'Salon ERP'}</span>
            </button>

            {/* Book Advance Button */}
            <button
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <Calendar className="w-3 h-3" />
              <span>Book Advance</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 text-stone-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-800 bg-stone-950 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col gap-2.5 text-sm font-medium text-stone-300">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Services & Pricing</a>
            <a href="#transformations" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Before & After</a>
            <a href="#lookbook" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Bridal Lookbook</a>
            <a href="#academy" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Beauty Academy</a>
            <a href="#artists" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Our Artists</a>
            <a href="#location" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Studio Map</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-200">Client Reviews</a>
          </nav>
          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); openClientPortal(); }}
              className="w-full text-left py-2 px-3 rounded text-xs font-medium text-amber-200 bg-stone-900 border border-amber-500/30 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>My Bookings & Receipts</span>
              </span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
