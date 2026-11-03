import React from 'react';
import { INITIAL_TESTIMONIALS, HERO_IMAGE, RECEPTION_GLAM, HALDI_MEHENDI, MAKEOVER_AFTER, STUDIO_INFO } from '../data/initialData';
import { Star, Instagram, Youtube, MessageCircle, Heart, Quote, ExternalLink } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

const SOCIAL_POSTS = [
  {
    id: 'soc-1',
    image: HERO_IMAGE,
    caption: 'Pure royal nostalgia. Antique kohl eyes & polki mathapatti setting for our gorgeous bride @kavita_singhal ✨',
    likes: '2.4k',
    views: '18.2k',
    tag: '#RoyalBridal'
  },
  {
    id: 'soc-2',
    image: RECEPTION_GLAM,
    caption: 'Reception glamour done right! Hollywood glossy waves and sculpted blush mauve tones. Save this for your reception lehenga 💎',
    likes: '1.9k',
    views: '14.5k',
    tag: '#ReceptionLook'
  },
  {
    id: 'soc-3',
    image: HALDI_MEHENDI,
    caption: 'Sunshine & marigolds 🌼 Sweatproof glass skin makeup with whimsical boho braids and real fresh jasmine for Haldi.',
    likes: '3.1k',
    views: '29.8k',
    tag: '#HaldiBride'
  },
  {
    id: 'soc-4',
    image: MAKEOVER_AFTER,
    caption: 'The power of skin-prep and 4K airbrushing. Real bride trial approved! Tap link in bio to book your 2026 wedding date 🤍',
    likes: '4.5k',
    views: '42.1k',
    tag: '#AirbrushMakeover'
  }
];

export const SocialAndTestimonials: React.FC = () => {
  const { openLeadModal } = useStudio();

  return (
    <section id="reviews" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Testimonials Zone */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
              <span>Verified Bride Stories</span>
              <span aria-hidden="true">·</span>
              <span>Google 4.9★ & WedMeGood Verified</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100">
              Words From Our Deepika Sharma Brides
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-2 font-light">
              Read how our punctuality, calm studio atmosphere, and waterproof bridal artistry in Lakhpedabagh Barabanki helped brides celebrate with unshakeable confidence.
            </p>

          {/* Direct Google Reviews on Official Google Maps */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href={STUDIO_INFO.googleReviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/20 hover:from-amber-400/30 hover:to-amber-500/30 text-amber-200 border border-amber-400/50 text-xs font-semibold transition-all shadow-md"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span>View All Live Verified Client Reviews on Google Maps (4.9★)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>

              <a
                href={`https://wa.me/${STUDIO_INFO.whatsapp}?text=Namaste%20Deepika%20Sharma%20Studio,%20I%20would%20like%20to%20read%20more%20bridal%20reviews%20and%20consult%20for%20my%20wedding.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp for Bride Video Feedback</span>
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Integration: Instagram Reel Feed */}
        <div className="pt-8 border-t border-stone-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rose-300 font-medium mb-1">
                <Instagram className="w-4 h-4" />
                <span>{STUDIO_INFO.instagramHandle}</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-white">
                Latest Bridal Reels & Studio Feed
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-2 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-rose-400" />
                <span>Follow on Instagram</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-2 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>Watch Bridal Vlogs</span>
              </a>
            </div>
          </div>

          {/* Social Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SOCIAL_POSTS.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-xl overflow-hidden bg-stone-950 border border-stone-800 h-72 shadow"
              >
                <img
                  src={post.image}
                  alt="Aura Studio Bridal Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded">
                  {post.tag}
                </div>

                <div className="absolute bottom-3 inset-x-3 space-y-1.5">
                  <p className="text-[11px] text-stone-200 line-clamp-2 leading-tight">
                    {post.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-800">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="font-mono">{post.views} views</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
