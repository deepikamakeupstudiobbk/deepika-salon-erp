/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Sparkles, Calendar, CheckCircle2, MapPin } from 'lucide-react';
import { HERO_IMAGE, STUDIO_INFO } from '../data/initialData';

export const Hero: React.FC = () => {
  const { openBookingModal, openLeadModal } = useStudio();

  return (
    <section className="relative overflow-hidden bg-stone-950 text-stone-100 py-12 lg:py-20 border-b border-stone-800">
      {/* Subtle Warm Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quiet Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
              <span>{STUDIO_INFO.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-rose-300">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Behind Akash Palace, Barabanki</span>
              </span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-stone-100 leading-[1.1] font-semibold text-balance">
              Royal Bridal Elegance & Certified Cosmetology Academy.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Founded by celebrity artist <strong className="text-amber-200 font-medium">Deepika Sharma</strong>. Experience bespoke high-definition 4K airbrushing for royal weddings, alongside certified professional academy courses in Barabanki.
            </p>

            {/* Inclusions summary strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Temptu 4K Airbrushing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>MAC & Charlotte Tilbury</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Academy Courses & Diploma</span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openBookingModal()}
                className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Book Wedding Date (Advance Pay)</span>
              </button>

              <button
                onClick={openLeadModal}
                className="px-4 py-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-stone-200 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Check Date Availability</span>
              </button>
            </div>

            {/* Trust Metrics Adjacency */}
            <div className="pt-4 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-400">
              <div>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-amber-100 block">450+</span>
                <span>Barabanki Brides Styled</span>
              </div>
              <div>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-amber-100 block">4.9 ★</span>
                <span>Top Salon in Barabanki</span>
              </div>
              <div>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-amber-100 block">180+</span>
                <span>Academy Graduates</span>
              </div>
              <div>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-amber-100 block">100%</span>
                <span>Verified Advance Lock</span>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Gold Filigree Accent Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-600/30 via-rose-500/20 to-amber-200/40 rounded-2xl blur-sm -z-10" />

              <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="Deepika Sharma Signature Royal Indian Bride Makeover"
                  className="w-full h-[400px] sm:h-[460px] object-cover object-top hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Floating Real-life Look Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] tracking-wider uppercase text-amber-300 font-semibold block truncate">
                      Featured Bride · Pheras Ceremony
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg text-white font-medium truncate">
                      Heritage Polki & Crimson Airbrush
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                      Artistry by Master Deepika Sharma · Lakhpedabagh
                    </p>
                  </div>
                  <button
                    onClick={() => openBookingModal('srv-1')}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded shadow whitespace-nowrap shrink-0 transition-colors"
                  >
                    Get This Look
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
