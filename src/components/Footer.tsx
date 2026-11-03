import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Sparkles, Phone, Mail, MapPin, Instagram, Youtube, Shield, Navigation, Receipt } from 'lucide-react';
import { STUDIO_INFO } from '../data/initialData';

export const Footer: React.FC = () => {
  const { openERPModal, openClientPortal } = useStudio();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-200 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              </div>
              <div>
                <span className="font-serif-luxury text-xl tracking-wider text-amber-100 font-semibold uppercase block leading-none">
                  Deepika Sharma
                </span>
                <span className="text-[9px] tracking-[0.2em] text-rose-300 uppercase block font-medium mt-0.5">
                  Makeup Studio & Academy · Barabanki
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-light max-w-sm">
              Premier bridal makeover destination & certified beauty academy in Barabanki, Uttar Pradesh. Specializing in high-definition airbrush artistry and professional cosmetology training.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-200 block">Behind Akash Palace, Lakhpedabagh Road</strong>
                  <span>Lakhpedabagh, Barabanki, Uttar Pradesh — 225001</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Helpline: <strong className="text-white font-mono">{STUDIO_INFO.phone}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email: <span className="font-mono text-stone-300">{STUDIO_INFO.email}</span></span>
              </div>
            </div>
          </div>

          {/* Bridal Offerings */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-luxury text-base font-semibold text-white uppercase tracking-wider">
              Artistry Menus
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#services" className="hover:text-amber-200 transition-colors">Signature HD Bridal</a></li>
              <li><a href="#services" className="hover:text-amber-200 transition-colors">Royale 4K Airbrush Bridal</a></li>
              <li><a href="#services" className="hover:text-amber-200 transition-colors">Reception & Sangeet Glam</a></li>
              <li><a href="#services" className="hover:text-amber-200 transition-colors">Pastel Haldi & Mehendi</a></li>
              <li><a href="#services" className="hover:text-amber-200 transition-colors">Pre-Bridal 7-Day Care</a></li>
            </ul>
          </div>

          {/* Academy & Studio */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-luxury text-base font-semibold text-white uppercase tracking-wider">
              Academy & Visit
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#academy" className="hover:text-amber-200 transition-colors">Bridal Makeup Master Diploma</a></li>
              <li><a href="#academy" className="hover:text-amber-200 transition-colors">Hair Styling & Chemical Course</a></li>
              <li><a href="#transformations" className="hover:text-amber-200 transition-colors">Before & After Slider</a></li>
              <li><a href="#location" className="hover:text-amber-200 transition-colors">Lakhpedabagh Google Map</a></li>
              <li><a href={STUDIO_INFO.googleMapsDirections} target="_blank" rel="noreferrer" className="hover:text-amber-200 transition-colors flex items-center gap-1">
                <span>Directions to Studio</span>
                <Navigation className="w-3 h-3 text-amber-400" />
              </a></li>
            </ul>
          </div>

          {/* ERP Access Portal */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-luxury text-base font-semibold text-white uppercase tracking-wider">
              Studio ERP Console
            </h4>
            <p className="text-[11px] text-stone-400 leading-snug">
              Authorized access portal for Studio Owner Deepika Sharma & staff members with role-based access rights.
            </p>
            <button
              onClick={openERPModal}
              className="w-full py-2.5 px-3 text-left bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-xl text-stone-200 font-medium flex items-center justify-between transition-colors shadow cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Launch Salon ERP</span>
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">v2.6</span>
            </button>

            <button
              onClick={() => openClientPortal()}
              className="w-full py-2.5 px-3 text-left bg-stone-900/90 hover:bg-stone-850 border border-amber-500/30 hover:border-amber-400 rounded-xl text-amber-300 font-medium flex items-center justify-between transition-colors shadow cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Bride & Client Portal</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded">Receipts</span>
            </button>

            <p className="text-[10px] text-stone-500 pt-1">
              Booked clients: enter phone or reference ID to view history & print vouchers.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} {STUDIO_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Behind Akash Palace, Lakhpedabagh, Barabanki</span>
            <span aria-hidden="true">·</span>
            <span>Phone: {STUDIO_INFO.phone}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
