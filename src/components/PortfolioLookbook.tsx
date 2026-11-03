import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { INITIAL_PORTFOLIO } from '../data/initialData';
import { PortfolioItem } from '../types';
import {
  Maximize2,
  X,
  Sparkles,
  User,
  Crown,
  Gem,
  Camera,
  GraduationCap,
  Award,
  Filter
} from 'lucide-react';

interface CategoryOption {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor?: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'all', label: 'All Looks', icon: Sparkles },
  { key: 'bridal', label: 'Bridal', icon: Crown, badgeColor: 'text-amber-300 bg-amber-950/70 border-amber-500/40' },
  { key: 'engagement', label: 'Engagement', icon: Gem, badgeColor: 'text-rose-300 bg-rose-950/70 border-rose-500/40' },
  { key: 'editorial', label: 'Editorial', icon: Camera, badgeColor: 'text-sky-300 bg-sky-950/70 border-sky-500/40' },
  { key: 'academy', label: 'Academy', icon: GraduationCap, badgeColor: 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40' },
  { key: 'reception', label: 'Reception', icon: Award, badgeColor: 'text-purple-300 bg-purple-950/70 border-purple-500/40' },
  { key: 'haldi_mehendi', label: 'Haldi & Mehendi', icon: Sparkles, badgeColor: 'text-yellow-300 bg-yellow-950/70 border-yellow-500/40' }
];

export const PortfolioLookbook: React.FC = () => {
  const { openBookingModal } = useStudio();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredPortfolio = INITIAL_PORTFOLIO.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const getCategoryCount = (key: string) => {
    if (key === 'all') return INITIAL_PORTFOLIO.length;
    return INITIAL_PORTFOLIO.filter(item => item.category === key).length;
  };

  const getCategoryBadgeStyle = (category: string) => {
    const found = CATEGORIES.find(c => c.key === category);
    return found?.badgeColor || 'text-amber-300 bg-stone-900 border-stone-800';
  };

  return (
    <section id="lookbook" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
            <span>The Aura Editorial Archives</span>
            <span aria-hidden="true">·</span>
            <span>Handcrafted Bridal Elegance</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100">
            Real Lookbook & Masterpiece Gallery
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-3 font-light">
            Explore authentic wedding ceremonies, engagement sessions, high-fashion editorials, and professional academy showcases crafted by Deepika Sharma Studio.
          </p>

          {/* Category Filter Buttons */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 font-mono uppercase tracking-wider mb-2">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse by Category</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = filterCategory === cat.key;
                const count = getCategoryCount(cat.key);

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setFilterCategory(cat.key)}
                    className={`px-3.5 py-2 text-xs rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer font-medium whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 ring-1 ring-amber-300 scale-[1.02]'
                        : 'bg-stone-950/80 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-950' : 'text-amber-400'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected
                          ? 'bg-stone-950/20 text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Counter */}
            <div className="pt-2 text-xs text-stone-400 flex items-center justify-center gap-2">
              <span>
                Showing <strong className="text-amber-300 font-mono">{filteredPortfolio.length}</strong> of{' '}
                <strong className="text-white font-mono">{INITIAL_PORTFOLIO.length}</strong> creations
              </span>
              {filterCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer ml-1"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Masonry / Grid */}
        {filteredPortfolio.length === 0 ? (
          <div className="p-12 text-center bg-stone-950/60 rounded-2xl border border-dashed border-stone-800 max-w-md mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="font-serif-luxury text-lg font-bold text-white">No creations under this category</h3>
            <p className="text-xs text-stone-400">
              Browse our full archives or select another category above.
            </p>
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className="px-4 py-2 bg-amber-400 text-stone-950 text-xs font-bold rounded-lg uppercase tracking-wider"
            >
              Show All Looks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all duration-300 h-96"
              >
                <img
                  src={item.imageAfter}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-md border backdrop-blur-sm ${getCategoryBadgeStyle(
                      item.category
                    )}`}
                  >
                    {item.category.replace('_', ' ')}
                  </span>

                  {/* Expand Icon */}
                  <div className="p-2 rounded-full bg-stone-900/70 backdrop-blur-sm text-stone-200 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors shadow">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Look Info Footer */}
                <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                  <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-amber-200 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 flex items-center gap-1.5 font-light">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.artistName}</span>
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-stone-300 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Full Modal Viewer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-white bg-stone-900/80 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image View */}
              <div className="relative h-80 sm:h-96 md:h-full min-h-[400px] bg-stone-900">
                <img
                  src={selectedItem.imageAfter}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Information */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded border ${getCategoryBadgeStyle(
                          selectedItem.category
                        )}`}
                      >
                        {selectedItem.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold font-mono">
                        Archive #{selectedItem.id}
                      </span>
                    </div>

                    <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-2">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Lead Stylist / Mentor: <strong className="text-stone-200">{selectedItem.artistName}</strong>
                    </p>
                  </div>

                  <p className="text-sm text-stone-300 leading-relaxed font-light">
                    {selectedItem.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider block">
                      Signature Highlights:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, i) => (
                        <span key={i} className="text-xs text-amber-200 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-800 space-y-3">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      openBookingModal(selectedItem.category === 'academy' ? 'crs-1' : 'srv-1');
                    }}
                    className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {selectedItem.category === 'academy'
                        ? 'Inquire for Academy Admissions & Batch'
                        : 'Inquire & Reserve This Look'}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-stone-400">
                    {selectedItem.category === 'academy'
                      ? 'Deepika Sharma Studio & Academy certificate provided upon graduation.'
                      : 'Customized for your facial structure, bridal attire color, and jewelry layout.'}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
