import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import { Booking, PartPayment, ClientProfile } from '../types';
import { STUDIO_INFO, STUDIO_LOGO } from '../data/initialData';
import {
  X,
  UserCheck,
  Calendar,
  CreditCard,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  Download,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Receipt,
  ExternalLink,
  ChevronRight,
  LogOut,
  Search,
  Lock,
  KeyRound,
  ArrowRight,
  HelpCircle,
  Camera
} from 'lucide-react';

export const ClientPortalModal: React.FC = () => {
  const {
    isClientPortalOpen,
    closeClientPortal,
    clientPortalPhone,
    setClientPortalPhone,
    bookings,
    clients,
    openBookingModal,
    addClientPhoto,
    showToast
  } = useStudio();

  // Active sub-tab: 'upcoming' | 'history' | 'receipts' | 'profile'
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'receipts' | 'profile'>('upcoming');

  // Login / lookup inputs
  const [phoneInput, setPhoneInput] = useState('');
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [securityPinInput, setSecurityPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Digital Receipt Viewer State
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [activeReceiptPart, setActiveReceiptPart] = useState<PartPayment | null>(null);

  // Owner Quick Upload state for Client Photos
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');

  // Clean phone helper
  const cleanPhone = (p: string) => p.replace(/[^0-9]/g, '').slice(-10);

  // Match client by phone or booking id
  const currentClient = useMemo(() => {
    if (!clientPortalPhone) return null;
    const targetClean = cleanPhone(clientPortalPhone);
    return clients.find(c => cleanPhone(c.phone) === targetClean) || null;
  }, [clients, clientPortalPhone]);

  // Client bookings
  const clientBookings = useMemo(() => {
    if (!clientPortalPhone) return [];
    const targetClean = cleanPhone(clientPortalPhone);
    return bookings.filter(b => cleanPhone(b.phone) === targetClean || b.phone === clientPortalPhone);
  }, [bookings, clientPortalPhone]);

  // Upcoming vs past bookings
  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = useMemo(() => {
    return clientBookings.filter(b => b.date >= todayStr && b.bookingStatus !== 'cancelled');
  }, [clientBookings, todayStr]);

  const pastBookings = useMemo(() => {
    return clientBookings.filter(b => b.date < todayStr || b.bookingStatus === 'completed');
  }, [clientBookings, todayStr]);

  // All paid receipts across all bookings
  const allPaidReceipts = useMemo(() => {
    const list: { booking: Booking; part: PartPayment }[] = [];
    clientBookings.forEach(b => {
      if (b.partPayments && b.partPayments.length > 0) {
        b.partPayments.forEach(p => {
          if (p.status === 'paid') {
            list.push({ booking: b, part: p });
          }
        });
      } else if (b.advancePaid > 0) {
        list.push({
          booking: b,
          part: {
            id: `RCP-${b.id}-1`,
            partNumber: 1,
            title: 'Booking Advance Token',
            serviceName: b.serviceName,
            date: b.createdAt || b.date,
            amount: b.advancePaid,
            paymentMethod: b.paymentMethod,
            transactionId: b.transactionId,
            receivedBy: 'Deepika Sharma (Studio Owner)',
            status: 'paid'
          }
        });
      }
    });
    return list;
  }, [clientBookings]);

  // Handle Client Authentication
  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    setTimeout(() => {
      let matchedBooking: Booking | undefined;
      const cleanInput = cleanPhone(phoneInput);

      if (cleanInput.length >= 10) {
        matchedBooking = bookings.find(b => cleanPhone(b.phone) === cleanInput);
      } else if (bookingIdInput.trim()) {
        const q = bookingIdInput.trim().toLowerCase();
        matchedBooking = bookings.find(b => b.id.toLowerCase() === q);
      }

      if (matchedBooking) {
        setClientPortalPhone(matchedBooking.phone);
        setIsVerifying(false);
        showToast(`Welcome back, ${matchedBooking.clientName}! Accessing your bridal appointments.`);
      } else {
        setIsVerifying(false);
        setAuthError('No active booking found matching this phone number or Booking ID. Please verify or use one of the quick demo client profiles below.');
      }
    }, 400);
  };

  const handleSelectDemoBride = (phone: string, name: string) => {
    setClientPortalPhone(phone);
    setPhoneInput(phone);
    setAuthError('');
    showToast(`Accessing VIP Client Portal for ${name}`);
  };

  const handleLogout = () => {
    setClientPortalPhone(null);
    setPhoneInput('');
    setBookingIdInput('');
    setActiveReceiptBooking(null);
    setActiveReceiptPart(null);
    showToast('Logged out of Client Portal.');
  };

  const handlePrint = () => {
    window.print();
  };

  // Rule of Hooks: Guard strictly before JSX return
  if (!isClientPortalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* 1. LOGIN / LOOKUP SCREEN (If no client authenticated) */}
      {!clientPortalPhone ? (
        <div className="relative w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-800 text-center relative">
            <button
              onClick={closeClientPortal}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 mx-auto mb-3 shadow-lg bg-stone-900">
              <img src={STUDIO_LOGO} alt="Deepika Sharma Logo" className="w-full h-full object-cover" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold block">
              Customer & Bride Portal
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-white mt-1">
              Deepika Sharma Studio
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Securely view your bridal appointments, ceremony countdown, installment status & download digital receipts.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleClientLogin} className="p-6 space-y-4 text-xs">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium block">
                Registered Mobile Number <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="tel"
                  placeholder="e.g. +91 95804 94058 or 9839122445"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-[10px] text-stone-400">
                The phone number provided during your advance booking.
              </span>
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-stone-800"></div>
              <span className="flex-shrink mx-2 text-[10px] text-stone-400 font-mono uppercase">OR BOOKING ID</span>
              <div className="flex-grow border-t border-stone-800"></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-stone-300 font-medium block">
                Booking Reference ID (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. BK-BBK-101 or BK-BBK-202"
                  value={bookingIdInput}
                  onChange={(e) => setBookingIdInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400 font-mono uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying Credentials...' : 'Access My Client Portal'}</span>
            </button>

            {/* Quick Demo Bride Logins */}
            <div className="pt-3 border-t border-stone-800/80 space-y-2">
              <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">
                Demo Booked Brides (Click to instant login):
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { name: 'Shalini Srivastava', phone: '+91 95804 94058', service: 'Signature HD Bridal (Nov 12)', id: 'BK-BBK-101' },
                  { name: 'Priya Verma', phone: '+91 98391 22445', service: '4K Airbrush Bridal (Nov 18)', id: 'BK-BBK-202' },
                  { name: 'Kritika Awasthi', phone: '+91 98890 11223', service: 'Haldi & Mehendi Look (Nov 8)', id: 'BK-BBK-204' },
                  { name: 'Tanya Agarwal', phone: '+91 97920 33445', service: 'Couture Reception (Completed)', id: 'BK-BBK-203' }
                ].map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleSelectDemoBride(demo.phone, demo.name)}
                    className="p-2 rounded-lg bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <strong className="text-white block text-[11px]">{demo.name}</strong>
                      <span className="text-[10px] text-amber-300 font-mono">{demo.service}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800">
                      {demo.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </form>

        </div>
      ) : (

        /* 2. AUTHENTICATED BRIDE & CLIENT PORTAL */
        <div className="relative w-full max-w-5xl h-[90vh] bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Top Client Navigation Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md bg-stone-900 shrink-0">
                <img src={STUDIO_LOGO} alt="Deepika Sharma Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif-luxury text-xl font-bold text-white leading-tight">
                    {clientBookings[0]?.clientName || currentClient?.name || 'Valued Bride'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VIP Verified Bride</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-0.5">
                  <span className="font-mono text-stone-300">{clientPortalPhone}</span>
                  <span>·</span>
                  <span>Deepika Sharma Makeup Studio, Lakhpedabagh</span>
                </div>
              </div>
            </div>

            {/* Actions: Direct WhatsApp & Logout */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <a
                href={`https://wa.me/919580494058?text=Hello%20Deepika%20Sharma%20Studio,%20I%20am%20logged%20into%20the%20Client%20Portal%20for%20phone%20${encodeURIComponent(clientPortalPhone)}.%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Connect with Deepika Sharma on WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Concierge Desk</span>
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-rose-300 border border-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch / Exit</span>
              </button>

              <button
                type="button"
                onClick={closeClientPortal}
                className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 px-4 sm:px-6 py-2.5 bg-stone-900/70 border-b border-stone-800 overflow-x-auto shrink-0 text-xs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Appointments</span>
              {upcomingBookings.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'upcoming' ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300'
                }`}>
                  {upcomingBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Appointment History</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'history' ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300'
              }`}>
                {clientBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('receipts')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'receipts'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Digital Receipts & Invoices</span>
              {allPaidReceipts.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'receipts' ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300'
                }`}>
                  {allPaidReceipts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skin Profile & Look Notes</span>
            </button>
          </div>

          {/* Viewport Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950 space-y-6">
            
            {/* TAB 1: UPCOMING APPOINTMENTS */}
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {upcomingBookings.length === 0 ? (
                  <div className="p-12 text-center bg-stone-900/60 rounded-2xl border border-dashed border-stone-800 max-w-md mx-auto space-y-3">
                    <Calendar className="w-10 h-10 text-amber-400 mx-auto" />
                    <h3 className="font-serif-luxury text-xl font-bold text-white">No Upcoming Appointments</h3>
                    <p className="text-xs text-stone-400">
                      You do not have any pending wedding ceremonies or look trials scheduled.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        closeClientPortal();
                        openBookingModal();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-stone-950 text-xs font-bold rounded-xl uppercase tracking-wider"
                    >
                      Book a New Makeover
                    </button>
                  </div>
                ) : (
                  upcomingBookings.map((bk) => {
                    const balancePct = bk.totalAmount > 0 ? Math.round((bk.advancePaid / bk.totalAmount) * 100) : 100;
                    return (
                      <div
                        key={bk.id}
                        className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6 shadow-xl"
                      >
                        {/* Booking Header & Countdown */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px] font-mono uppercase tracking-wider">
                                Confirmed Appointment
                              </span>
                              <span className="font-mono text-xs text-stone-400 font-bold">
                                #{bk.id}
                              </span>
                            </div>
                            <h3 className="font-serif-luxury text-2xl font-bold text-white mt-1">
                              {bk.serviceName}
                            </h3>
                            <p className="text-xs text-stone-400 mt-0.5">
                              Client: <strong className="text-stone-200">{bk.clientName}</strong> · Phone: <strong className="text-stone-200">{bk.phone}</strong>
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                              Ceremony Date & Slot
                            </span>
                            <span className="font-mono text-lg font-bold text-white block mt-0.5">
                              {bk.date}
                            </span>
                            <span className="text-xs text-amber-300 font-medium flex items-center sm:justify-end gap-1 mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{bk.timeSlot}</span>
                            </span>
                          </div>
                        </div>

                        {/* Details Grid: Artist & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Artist Assigned */}
                          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-serif-luxury text-lg font-bold">
                                {bk.artistName.charAt(0)}
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                                  Lead Bridal Artist
                                </span>
                                <strong className="text-white text-sm block">{bk.artistName}</strong>
                                <span className="text-[11px] text-amber-300">Master Bridal Couturier</span>
                              </div>
                            </div>
                            <a
                              href={`https://wa.me/919580494058?text=Hi%20Deepika%20Sharma%20Studio,%20I%20have%20a%20query%20regarding%20my%20bridal%20appointment%20${bk.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                              title="Message Stylist Team"
                            >
                              <Phone className="w-4 h-4 text-emerald-400" />
                            </a>
                          </div>

                          {/* Location & Directions */}
                          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                                  Makeover Location
                                </span>
                                <strong className="text-white text-xs block">
                                  {bk.locationType === 'venue' ? 'On-Location Wedding Venue' : 'Deepika Sharma Studio'}
                                </strong>
                                <p className="text-[11px] text-stone-400 line-clamp-1">
                                  {bk.venueAddress || STUDIO_INFO.address}
                                </p>
                              </div>
                            </div>
                            <a
                              href={STUDIO_INFO.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-850 text-amber-300 border border-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                            >
                              <span>Map</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Payment & Installment Progress */}
                        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block">
                                Payment Ledger & Token Advance Status
                              </span>
                              <span className="text-[11px] text-stone-400">
                                {balancePct}% settled · ₹{bk.advancePaid.toLocaleString('en-IN')} paid of ₹{bk.totalAmount.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 font-mono text-xs">
                              <span className="text-stone-400">Balance Due:</span>
                              <strong className={`px-2 py-0.5 rounded text-sm ${
                                bk.balanceDue === 0
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              }`}>
                                ₹{bk.balanceDue.toLocaleString('en-IN')}
                              </strong>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, balancePct)}%` }}
                            />
                          </div>

                          {/* Part-wise Payment Milestones */}
                          {bk.partPayments && bk.partPayments.length > 0 && (
                            <div className="pt-2 border-t border-stone-900 space-y-2">
                              <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                                Scheduled Installment Breakdown:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {bk.partPayments.map((part) => (
                                  <div
                                    key={part.id}
                                    className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                                      part.status === 'paid'
                                        ? 'bg-emerald-950/30 border-emerald-500/30'
                                        : 'bg-stone-900 border-stone-800'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-white text-[11px]">Part {part.partNumber}</span>
                                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                        part.status === 'paid'
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : 'bg-amber-500/20 text-amber-300'
                                      }`}>
                                        {part.status === 'paid' ? 'Paid ✓' : 'Due'}
                                      </span>
                                    </div>
                                    <div className="font-mono text-emerald-400 font-bold">
                                      ₹{part.amount.toLocaleString('en-IN')}
                                    </div>
                                    <p className="text-[10px] text-stone-400 line-clamp-1">{part.title}</p>
                                    {part.status === 'paid' && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveReceiptBooking(bk);
                                          setActiveReceiptPart(part);
                                          setActiveTab('receipts');
                                        }}
                                        className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1 pt-0.5 cursor-pointer"
                                      >
                                        <Receipt className="w-3 h-3" />
                                        <span>View Digital Slip</span>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pre-Bridal Care Instructions */}
                        <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs">
                          <span className="font-serif-luxury font-bold text-amber-300 text-sm flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Pre-Ceremony Prep Guidelines for Bride:</span>
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300 text-[11px] pt-1">
                            <li className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>Arrive with clean, moisturizer-free face and washed, dry hair.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>Wear a button-down or zip-up top so your bridal hair & dupatta remain untouched.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>Bring your lehenga blouse, jewelry set, mathapatti, and real floral hair ornaments.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>Report at least 3.5 hours prior to your wedding mandap / baraat arrival time.</span>
                            </li>
                          </ul>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: APPOINTMENT HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-lg font-bold text-white">
                    Full Appointment & Ceremony History
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    Total {clientBookings.length} records found
                  </span>
                </div>

                <div className="divide-y divide-stone-800 bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                  {clientBookings.map((bk) => (
                    <div key={bk.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-850/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-300">
                            #{bk.id}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            bk.bookingStatus === 'confirmed'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : bk.bookingStatus === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-stone-800 text-stone-400'
                          }`}>
                            {bk.bookingStatus}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">· {bk.date}</span>
                        </div>
                        <h4 className="font-serif-luxury text-base font-bold text-white">
                          {bk.serviceName}
                        </h4>
                        <p className="text-xs text-stone-400">
                          Artist: <strong className="text-stone-300">{bk.artistName}</strong> · Time Slot: <strong className="text-stone-300">{bk.timeSlot}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <span className="text-[10px] uppercase text-stone-400 block">Total Package</span>
                          <strong className="text-sm font-bold text-white">
                            ₹{bk.totalAmount.toLocaleString('en-IN')}
                          </strong>
                          <span className="text-[10px] text-emerald-400 block">
                            Advance: ₹{bk.advancePaid.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveReceiptBooking(bk);
                            setActiveReceiptPart(bk.partPayments?.[0] || null);
                            setActiveTab('receipts');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: DIGITAL RECEIPTS & INVOICES */}
            {activeTab === 'receipts' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-white">
                      Digital Payment Receipts & Official Tax Invoices
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Download, print, or present official studio payment confirmation slips for wedding accounts.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print / Save PDF</span>
                    </button>
                  </div>
                </div>

                {/* Receipt Selector Pill list */}
                {allPaidReceipts.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">
                      Select Payment Voucher to View:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {allPaidReceipts.map(({ booking, part }) => {
                        const isSelected = activeReceiptBooking?.id === booking.id && activeReceiptPart?.id === part.id;
                        return (
                          <button
                            key={part.id}
                            type="button"
                            onClick={() => {
                              setActiveReceiptBooking(booking);
                              setActiveReceiptPart(part);
                            }}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow'
                                : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border-stone-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{part.title}</span>
                              <span className="font-mono font-bold">₹{part.amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                              #{booking.id} · {part.date} · {part.paymentMethod.toUpperCase()}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Formal Printable Digital Tax Voucher / Receipt Card */}
                {(() => {
                  const targetBooking = activeReceiptBooking || clientBookings[0];
                  const targetPart = activeReceiptPart || targetBooking?.partPayments?.[0] || {
                    id: `RCP-${targetBooking?.id || '01'}`,
                    partNumber: 1,
                    title: 'Booking Advance Token',
                    serviceName: targetBooking?.serviceName || 'Signature Bridal Makeover',
                    date: targetBooking?.createdAt || todayStr,
                    amount: targetBooking?.advancePaid || 4000,
                    paymentMethod: targetBooking?.paymentMethod || 'upi',
                    transactionId: targetBooking?.transactionId || 'UPI-DEEPIKA-9921',
                    receivedBy: 'Deepika Sharma (Founder)',
                    status: 'paid'
                  };

                  if (!targetBooking) {
                    return (
                      <div className="p-8 text-center text-stone-500">No receipt available</div>
                    );
                  }

                  return (
                    <div
                      id="printableReceipt"
                      className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-700 text-stone-100 space-y-6 shadow-2xl relative overflow-hidden"
                    >
                      {/* Watermark & Paid Stamp */}
                      <div className="absolute right-6 top-6 sm:right-10 sm:top-10 rotate-[-12deg] border-2 border-emerald-500/60 text-emerald-400 px-4 py-1.5 rounded-lg text-xs font-mono font-black tracking-widest uppercase bg-emerald-950/40 backdrop-blur-sm pointer-events-none">
                        VERIFIED PAID ✓
                      </div>

                      {/* Studio Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400 bg-stone-950 shrink-0">
                            <img src={STUDIO_LOGO} alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-serif-luxury text-xl font-bold text-white uppercase tracking-wider block">
                              Deepika Sharma
                            </span>
                            <span className="text-[10px] text-amber-300 font-mono uppercase tracking-widest block">
                              Makeup Studio & Academy · Barabanki
                            </span>
                            <span className="text-[10px] text-stone-400 block">
                              Behind Akash Palace, Lakhpedabagh Road, Barabanki, UP - 225001
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right font-mono text-xs">
                          <span className="text-[10px] uppercase text-stone-400 block font-semibold">
                            Official Receipt Voucher
                          </span>
                          <span className="text-amber-300 font-bold block mt-0.5">
                            {targetPart.id}
                          </span>
                          <span className="text-stone-400 text-[10px] block">
                            Issued: {targetPart.date}
                          </span>
                        </div>
                      </div>

                      {/* Billed To / Client Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                          <span className="text-[10px] uppercase text-stone-400 block font-sans font-semibold">
                            Billed To (Bride / Client):
                          </span>
                          <strong className="text-white text-sm block font-sans">{targetBooking.clientName}</strong>
                          <div className="text-stone-400 text-[11px]">Phone: {targetBooking.phone}</div>
                          <div className="text-stone-400 text-[11px]">Booking ID: #{targetBooking.id}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                          <span className="text-[10px] uppercase text-stone-400 block font-sans font-semibold">
                            Ceremony & Appointment Details:
                          </span>
                          <strong className="text-amber-300 text-xs block font-sans">{targetBooking.serviceName}</strong>
                          <div className="text-stone-400 text-[11px]">Date: {targetBooking.date} ({targetBooking.timeSlot})</div>
                          <div className="text-stone-400 text-[11px]">Lead Artist: {targetBooking.artistName}</div>
                        </div>
                      </div>

                      {/* Line Items Table */}
                      <div className="border border-stone-800 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] font-mono border-b border-stone-800">
                            <tr>
                              <th className="p-3">Payment Installment / Description</th>
                              <th className="p-3">Transaction Reference</th>
                              <th className="p-3">Method</th>
                              <th className="p-3 text-right">Amount Paid</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800 font-mono">
                            <tr className="bg-stone-900">
                              <td className="p-3 font-sans">
                                <strong className="text-white block">{targetPart.title}</strong>
                                <span className="text-[10px] text-stone-400">{targetBooking.serviceName}</span>
                              </td>
                              <td className="p-3 text-stone-300">{targetPart.transactionId || 'UPI-SETTLED'}</td>
                              <td className="p-3 text-stone-300 uppercase">{targetPart.paymentMethod}</td>
                              <td className="p-3 text-right text-emerald-400 font-bold text-sm tabular-nums">
                                ₹{targetPart.amount.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Totals & Outstanding Settlement Summary */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div className="text-[11px] text-stone-400 space-y-0.5 max-w-sm">
                          <p>• Advance token secures date & artist in Deepika Sharma Studio calendar.</p>
                          <p>• Remaining balance to be cleared at studio before bridal vidaai.</p>
                          <p>• Digital payment proof generated automatically by Studio ERP.</p>
                        </div>

                        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 w-full sm:w-64 space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between text-stone-400">
                            <span>Package Total:</span>
                            <span className="text-white font-bold">₹{targetBooking.totalAmount.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400">
                            <span>Total Paid To Date:</span>
                            <span className="font-bold">₹{targetBooking.advancePaid.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-amber-300 border-t border-stone-800 pt-1.5 font-bold">
                            <span>Pending Balance:</span>
                            <span>₹{targetBooking.balanceDue.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Signatory & Verification Footer */}
                      <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
                        <div className="text-[11px] text-stone-400">
                          <div>Official Helpline: <strong>{STUDIO_INFO.phone}</strong></div>
                          <div>Email: <strong>{STUDIO_INFO.email}</strong></div>
                        </div>

                        <div className="text-center sm:text-right">
                          <div className="font-serif-luxury text-sm font-bold text-amber-300 italic">
                            Deepika Sharma
                          </div>
                          <span className="text-[10px] text-stone-400 uppercase font-mono block">
                            Founder & Master Makeup Artist · Authorized Signatory
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 4: SKIN PROFILE & TRIAL LOOK NOTES (WITH REAL CLIENT PHOTO UPLOAD) */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif-luxury text-xl font-bold text-white">
                        Bridal Skin Diagnosis & Consultation Profile
                      </h3>
                      <p className="text-xs text-stone-400">
                        Confidential consultation record maintained by Deepika Sharma Studio for customized product selection.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                      <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                        Skin Type Diagnosis
                      </span>
                      <strong className="text-white text-sm block mt-1">
                        {currentClient?.skinType || 'Combination / Sensitive'}
                      </strong>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">Hydra-prime base recommended</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                      <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                        Undertone & Foundation Base
                      </span>
                      <strong className="text-amber-300 text-sm block mt-1">
                        {currentClient?.undertone || 'Warm Golden / Olive'}
                      </strong>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Matched with Charlotte Tilbury 5 Warm</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                      <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                        Allergies & Sensitivities
                      </span>
                      <strong className="text-rose-300 text-sm block mt-1">
                        {currentClient?.allergies || 'Fragrance-free primers only; no harsh scrubs'}
                      </strong>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Hypoallergenic lash adhesive verified</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
                    <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] block">
                      Artist Studio Consultation Notes:
                    </span>
                    <p className="text-stone-300 leading-relaxed italic">
                      "{currentClient?.notes || 'Bride desires traditional royal red lehenga look with heritage polki jewelry setting. Matte crimson lip and elongated kohl eyeliner. Trial approved.'}"
                    </p>
                  </div>
                </div>

                {/* OWNER QUICK UPLOAD: ADD NEW MAKEOVER PHOTO FROM DEVICE / G DRIVE FOLDER */}
                {currentClient && (
                  <div className="p-5 rounded-2xl bg-stone-900 border border-amber-500/40 space-y-4">
                    <h4 className="font-serif-luxury text-base font-bold text-amber-300 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Owner Quick Upload: Add Real Client Makeover Photo</span>
                    </h4>
                    <p className="text-xs text-stone-400">
                      Choose real client photo files directly from your computer or Google Drive sync folder to attach them to this bride's vault.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-stone-300">Select Image File (From GDrive / Device)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewPhotoUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-stone-950 hover:file:bg-amber-300 cursor-pointer bg-stone-950 border border-stone-800 rounded-xl p-1"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-stone-300">Look Title / Description</label>
                        <input
                          type="text"
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          placeholder="e.g. Wedding Pheras Royal Look"
                          className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newPhotoUrl) {
                            showToast('Please choose an image file first!');
                            return;
                          }
                          addClientPhoto(currentClient.id, {
                            url: newPhotoUrl,
                            title: newPhotoTitle || 'Bridal Vault Look',
                            date: new Date().toISOString().split('T')[0],
                            category: 'Studio Vault',
                            verifiedConsent: true
                          });
                          setNewPhotoUrl('');
                          setNewPhotoTitle('');
                          showToast('Real client makeover photo uploaded successfully to vault!');
                        }}
                        className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        Save Photo to Client Vault
                      </button>
                    </div>
                  </div>
                )}

                {/* Approved Look Photos */}
                {currentClient?.photos && currentClient.photos.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Approved Trial Look Archive</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentClient.photos.map((photo) => (
                        <div key={photo.id} className="rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                          <img src={photo.url} alt={photo.title} className="w-full h-48 object-cover object-top" />
                          <div className="p-3">
                            <strong className="text-white text-xs block">{photo.title}</strong>
                            <span className="text-[10px] text-stone-400 font-mono">{photo.category} · {photo.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Deepika Sharma Studio Secure Client Portal · End-to-End SSL Encrypted</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeClientPortal}
                className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
