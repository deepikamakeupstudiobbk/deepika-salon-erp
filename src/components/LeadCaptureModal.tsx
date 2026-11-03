import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { X, Sparkles, Calendar, Phone, Mail, MapPin, User, CheckCircle2, ArrowRight } from 'lucide-react';

export const LeadCaptureModal: React.FC = () => {
  const { isLeadModalOpen, closeLeadModal, addLead } = useStudio();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Signature HD Bridal + Sangeet Look');
  const [venueCity, setVenueCity] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [submitted, setSubmitted] = useState(false);

  if (!isLeadModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !weddingDate) {
      alert('Please fill in your name, phone number, and wedding date');
      return;
    }

    addLead({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      weddingDate,
      serviceInterest,
      venueCity: venueCity || 'Barabanki / Lucknow',
      guestCount,
      notes: `Web inquiry: Date availability request for ${weddingDate}. Interested in ${serviceInterest}. Venue: ${venueCity || 'Barabanki'}.`
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setWeddingDate('');
    setVenueCity('');
    closeLeadModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority Date Checker</span>
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-white mt-0.5">
              Check Wedding Date Availability
            </h2>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">
              Inquiry Received!
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-amber-200">{name}</strong>. Our bridal concierge team has received your date check for <strong className="text-stone-200">{weddingDate}</strong>. We will WhatsApp you within 2 hours with our team availability and custom bridal quotation!
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-stone-300 leading-relaxed">
              Dates for 2026 weddings fill up fast. Fill this quick form to reserve a slot before our artists are fully booked.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Bride / Groom Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Mehra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  WhatsApp Contact
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Wedding / Function Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Services Desired
              </label>
              <select
                value={serviceInterest}
                onChange={(e) => setServiceInterest(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Signature HD Bridal + Sangeet Look">Signature HD Bridal + Sangeet Look</option>
                <option value="Royale Airbrush Bridal Masterpiece">Royale Airbrush Bridal Masterpiece</option>
                <option value="Haldi + Mehendi + Wedding Trio">Haldi + Mehendi + Wedding Trio</option>
                <option value="Professional Makeup & Cosmetology Diploma">Professional Makeup & Cosmetology Diploma</option>
                <option value="Advanced Hair Styling & Chemical Course">Advanced Hair Styling & Chemical Course</option>
                <option value="Self-Grooming Personal Makeup Course">Self-Grooming Personal Makeup Course</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Venue City / Banquet Lawn
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    placeholder="e.g. Barabanki / Sagar Grand / Lucknow"
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Side Guest Makeovers
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Submit Date Availability Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
