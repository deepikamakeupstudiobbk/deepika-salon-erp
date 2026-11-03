import React, { useState, useRef, useCallback } from 'react';
import { useStudio } from '../context/StudioContext';
import { Sparkles, SlidersHorizontal, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';
import {
  MAKEOVER_BEFORE,
  MAKEOVER_AFTER,
  RECEPTION_GLAM,
  HALDI_MEHENDI
} from '../data/initialData';

interface LookPreset {
  id: string;
  name: string;
  category: string;
  beforeImg: string;
  afterImg: string;
  artist: string;
  highlights: string[];
  serviceId: string;
}

const LOOK_PRESETS: LookPreset[] = [
  {
    id: 'look-1',
    name: 'Royal Heritage HD Bridal',
    category: 'Bridal Ceremony',
    beforeImg: MAKEOVER_BEFORE,
    afterImg: MAKEOVER_AFTER,
    artist: 'Ananya Sharma (Lead Artist)',
    highlights: [
      'Temptu 4K Micro-Airbrush Base',
      'Elongated Kohl Winged Smokey Eyes',
      'Matte Ruby Royal Lip Sealing',
      'Heritage Polki Maang Tikka Setting'
    ],
    serviceId: 'srv-1'
  },
  {
    id: 'look-2',
    name: 'Evening Reception Hollywood Glam',
    category: 'Reception & Sangeet',
    beforeImg: MAKEOVER_BEFORE,
    afterImg: RECEPTION_GLAM,
    artist: 'Pooja Verma (Senior Specialist)',
    highlights: [
      'Glass Skin 3D Priming',
      'Rose-Gold Shimmer Foil Lids',
      'Plump Mauve Velvet Lip Contour',
      'Sculpted Hollywood Waves Hair'
    ],
    serviceId: 'srv-3'
  },
  {
    id: 'look-3',
    name: 'Sun-Kissed Floral Haldi & Mehendi',
    category: 'Daytime Pre-Wedding',
    beforeImg: MAKEOVER_BEFORE,
    afterImg: HALDI_MEHENDI,
    artist: 'Neha Sen & Pooja Verma',
    highlights: [
      'Waterproof Dewy Glass Tint',
      'Fresh Botanical Jasmine Adornment',
      'Textured Boho Braid with Baby’s Breath',
      'Sweat & Haldi Resistant Formula'
    ],
    serviceId: 'srv-4'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const { openBookingModal } = useStudio();
  const [activePreset, setActivePreset] = useState<LookPreset>(LOOK_PRESETS[0]);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleClickTrack = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  return (
    <section id="transformations" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
            <span>Visual Evidence of Artistry</span>
            <span aria-hidden="true">·</span>
            <span>Unretouched Real Brides</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100 tracking-tight text-balance">
            Real Transformations, Featherweight Perfection.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-4 font-light">
            Slide horizontally to reveal how our skin-first micro-airbrush technique enhances natural facial contours without caking, masking, or artificial filters.
          </p>

          {/* Interactive Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {LOOK_PRESETS.map((preset) => {
              const isActive = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePreset(preset);
                    setSliderPos(50);
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-amber-300 text-stone-950 font-semibold shadow-md'
                      : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700/80 border border-stone-700/50'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Comparison Split Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Slider Container */}
          <div className="lg:col-span-8">
            <div
              ref={containerRef}
              onClick={handleClickTrack}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
              className="relative w-full h-[400px] sm:h-[500px] md:h-[560px] rounded-2xl overflow-hidden select-none cursor-ew-resize shadow-2xl border border-stone-700 bg-stone-950 group"
            >
              {/* After Image (Full background) */}
              <img
                src={activePreset.afterImg}
                alt={`${activePreset.name} - After Transformation`}
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Before Image (Clipped Left Layer) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={activePreset.beforeImg}
                  alt={`${activePreset.name} - Before Raw Canvas`}
                  className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
                    height: '100%'
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Dividing Vertical Line & Floating Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-lg pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-stone-950 border-2 border-amber-400 text-amber-300 shadow-xl flex items-center justify-center transform -translate-x-1/2">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Quiet Text Overlay Labels (Zero-Pill discipline) */}
              <div className="absolute top-4 left-4 bg-stone-950/75 backdrop-blur-sm border border-stone-800 text-stone-200 px-3 py-1 rounded text-xs uppercase tracking-widest pointer-events-none">
                Bare Skin (Before)
              </div>
              <div className="absolute top-4 right-4 bg-amber-950/80 backdrop-blur-sm border border-amber-600/50 text-amber-200 px-3 py-1 rounded text-xs uppercase tracking-widest pointer-events-none">
                HD Makeover (After)
              </div>

              {/* Mobile Drag Instruction Tip */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-stone-950/70 backdrop-blur-sm text-stone-300 text-[11px] px-3 py-1 rounded-full pointer-events-none">
                Drag slider left/right to compare
              </div>
            </div>
          </div>

          {/* Details & Inclusions Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-5">
              
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
                  {activePreset.category}
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  {activePreset.name}
                </h3>
                <p className="text-xs text-stone-400">
                  Curated & Styled by {activePreset.artist}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                  Artistry Breakdown & Key Formulas:
                </span>
                {activePreset.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Skin Longevity</span>
                  <span className="font-mono text-amber-300 font-semibold">18+ Hours Sweatproof</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Foundation Base</span>
                  <span className="text-stone-200 font-medium">Temptu & Charlotte Tilbury</span>
                </div>
              </div>

              <button
                onClick={() => openBookingModal(activePreset.serviceId)}
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-lg shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book This Exact Look</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
