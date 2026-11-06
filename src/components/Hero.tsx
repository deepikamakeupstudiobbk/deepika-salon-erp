import React from 'react';
import { useStudio } from '../context/StudioContext';
import { HERO_IMAGE } from '../data/initialData';
import { Calendar, Sparkles, ShieldCheck, Star, MapPin, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  const { openBookingModal } = useStudio();

  return (
    <section className="relative bg-stone-950 text-stone-100 overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28 border-b border-stone-850">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-950/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Barabanki’s Premier Bridal Studio & Academy</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl tracking-tight text-amber-50 font-bold leading-[1.15]">
              Royal Bridal Elegance & Certified Cosmetology Academy.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans-clean">
              Founded by celebrity artist <strong className="text-amber-200 font-semibold">Deepika Sharma</strong>. Experience bespoke high-definition 4K airbrushing for royal weddings, alongside certified professional academy courses in Barabanki.
            </p>

            {/* Key Highlights Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-xl text-xs text-stone-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Waterproof HD</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-xl text-xs text-stone-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ISO Certified Academy</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-2 rounded-xl text-xs text-stone-300 col-span-2 sm:col-span-1">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Lakhpedabagh, BBK</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-950/50 transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Bridal Date Advance</span>
              </button>

              <a
                href="#services"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-medium text-stone-200 bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 rounded-xl transition-all"
              >
                <span>Explore Packages & Prices</span>
              </a>
            </div>

            {/* Google Reviews Trust Badge */}
            <div className="pt-4 flex items-center gap-3 border-t border-stone-900">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-stone-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Client" />
                <img className="w-8 h-8 rounded-full border-2 border-stone-950 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="Client" />
                <img className="w-8 h-8 rounded-full border-2 border-stone-950 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Client" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-stone-300 font-bold ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-[11px] text-stone-400">Trusted by 500+ Brides across Barabanki & Lucknow</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-stone-900 shadow-2xl aspect-[4/5]">
                <img
                  src={HERO_IMAGE}
                  alt="Deepika Sharma Signature Royal Indian Bride Makeover"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Caption Badge */}
                <div className="absolute bottom-4 inset-x-4 bg-stone-950/85 backdrop-blur-md border border-amber-500/40 p-3.5 rounded-xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">Signature Look</span>
                      <span className="text-xs sm:text-sm font-semibold text-stone-100 font-serif-luxury">Royal HD Bridal Transformation</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 text-[11px] font-bold">₹21,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
