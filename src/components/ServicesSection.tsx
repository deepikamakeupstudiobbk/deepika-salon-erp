import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Check, Clock, CalendarCheck, Sparkles, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';

export const ServicesSection: React.FC = () => {
  const { services, openBookingModal } = useStudio();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredServices = services.filter(service => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'bridal') return service.category === 'bridal';
    if (activeCategory === 'party') return service.category === 'party';
    if (activeCategory === 'pre_bridal') return service.category === 'pre_bridal';
    return true;
  });

  return (
    <section id="services" className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
              <span>Bespoke Packages & Inclusions</span>
              <span aria-hidden="true">·</span>
              <span>Transparent Advance Tokens</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100">
              Curated Bridal & Makeover Menus
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-xl font-light">
              Every package includes complimentary skin consultation, premium mink lash architecture, designer draping, and setting for high-definition 4K capture.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              All Offerings
            </button>
            <button
              onClick={() => setActiveCategory('bridal')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'bridal'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Royal Bridal
            </button>
            <button
              onClick={() => setActiveCategory('party')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'party'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Reception & Party
            </button>
            <button
              onClick={() => setActiveCategory('pre_bridal')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === 'pre_bridal'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Pre-Bridal Rituals
            </button>
          </div>
        </div>

        {/* 3-Column Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-56 overflow-hidden bg-stone-950">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  
                  {service.popular && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                      Most Booked
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm text-stone-200 text-xs px-2.5 py-1 rounded flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Pricing and Advance Token Breakdown */}
                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                        Total Package Price
                      </span>
                      <span className="font-mono text-xl font-bold text-amber-100 tabular-nums">
                        ₹{service.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-rose-300 block font-medium">
                        Advance to Lock Date
                      </span>
                      <span className="font-mono text-sm font-semibold text-rose-200 tabular-nums">
                        ₹{service.advanceRequired.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] uppercase tracking-wider text-stone-300 font-semibold block">
                      Package Includes:
                    </span>
                    <ul className="space-y-1.5">
                      {service.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="p-6 pt-0 mt-4">
                <button
                  onClick={() => openBookingModal(service.id)}
                  className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider bg-stone-800 hover:bg-amber-400 text-stone-200 hover:text-stone-950 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-amber-400 group-hover:text-stone-950 shadow"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book with ₹{service.advanceRequired.toLocaleString('en-IN')} Advance</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
