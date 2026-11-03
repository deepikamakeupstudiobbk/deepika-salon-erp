import React from 'react';
import { STUDIO_INFO } from '../data/initialData';
import { MapPin, Phone, Clock, Mail, Navigation, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const LocationMapSection: React.FC = () => {
  const { openBookingModal } = useStudio();

  return (
    <section id="location" className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
            <span>Flagship Studio & Academy Location</span>
            <span aria-hidden="true">·</span>
            <span>Barabanki, Uttar Pradesh</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100">
            Visit Our Studio Behind Akash Palace
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2 font-light">
            Conveniently situated in Lakhpedabagh, Barabanki. Experience luxurious bridal trials, personalized skin consultations, and world-class beauty academy courses.
          </p>
        </div>

        {/* 2-Column Split: Studio Location Card & Google Map Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Studio Details & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-6">
            <div className="space-y-6">
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-stone-950 px-2.5 py-1 rounded border border-stone-800">
                  Registered Salon & Training Academy
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-3">
                  {STUDIO_INFO.name}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Founder: <strong className="text-stone-200">{STUDIO_INFO.founder}</strong> (Celebrity Bridal Makeup Artist)
                </p>
              </div>

              {/* Address Strip */}
              <div className="space-y-4 text-xs text-stone-300">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800/80">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm font-semibold">Studio Address:</strong>
                    <p className="text-stone-300 mt-0.5 leading-relaxed font-sans">
                      {STUDIO_INFO.address}
                    </p>
                    <span className="text-[11px] text-amber-400 block mt-1">
                      Landmark: Behind Akash Palace, Lakhpedabagh
                    </span>
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-950 border border-stone-800/80">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Appointment Helpline</span>
                      <a href={`tel:${STUDIO_INFO.phone.replace(/\s+/g, '')}`} className="font-mono text-sm font-bold text-white hover:text-amber-200">
                        {STUDIO_INFO.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${STUDIO_INFO.whatsapp}?text=Namaste%20Deepika%20Sharma%20Studio,%20I%20would%20like%20to%20visit%20your%20Lakhpedabagh%20studio.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded text-xs font-semibold"
                  >
                    WhatsApp
                  </a>
                </div>

                {/* Operating Timings */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800/80">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Working Hours</span>
                    <span className="text-stone-200 font-medium">{STUDIO_INFO.timings}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-800/80 space-y-3">
              <a
                href={STUDIO_INFO.googleMapsDirections}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl font-bold uppercase tracking-wider text-xs shadow flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Driving Directions on Google Maps</span>
              </a>

              <button
                onClick={() => openBookingModal()}
                className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-xl font-semibold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Book In-Studio Bridal Trial</span>
              </button>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Embed & Street Context */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl">
            
            {/* Map Top Bar */}
            <div className="px-5 py-3 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span className="font-semibold text-white">Google Maps: Behind Akash Palace, Lakhpedabagh, Barabanki</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={STUDIO_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 bg-stone-900 border border-amber-400/30 px-3 py-1 rounded-lg transition-colors"
                >
                  <span>Open Official Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Google Map Card */}
            <div className="relative flex-1 min-h-[380px] bg-stone-950 overflow-hidden">
              <iframe
                title="Deepika Sharma Makeup Studio Barabanki Location Map"
                src="https://maps.google.com/maps?q=Lakhpedabagh+Behind+Akash+Palace+Barabanki+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[380px]"
              />

              {/* Floating Pin Card on top of map */}
              <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-2xl max-w-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Studio Location</span>
                </div>
                <h4 className="font-serif-luxury text-sm font-bold text-white">
                  Deepika Sharma Makeup Studio
                </h4>
                <p className="text-[11px] text-stone-300 leading-snug">
                  Behind Akash Palace, Lakhpedabagh Road, Barabanki, UP - 225001
                </p>
                <div className="pt-1.5 flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <span>● Open Today: 09:00 AM – 08:00 PM</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
