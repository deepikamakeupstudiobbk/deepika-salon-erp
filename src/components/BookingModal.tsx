import React, { useState, useEffect, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Printer,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Edit3,
  Layers,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod, PartPayment } from '../types';
import { STUDIO_INFO, STUDIO_LOGO } from '../data/initialData';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    services,
    employees,
    preselectedServiceId,
    addBooking,
    openClientPortal
  } = useStudio();

  // Wizard Step: 1 = Details & Milestone Plan, 2 = Advance Payment, 3 = Confirmed Voucher
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State - Service Selection
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-1');
  const [isCustomService, setIsCustomService] = useState<boolean>(false);
  const [customServiceName, setCustomServiceName] = useState<string>('');
  const [customTotalAmount, setCustomTotalAmount] = useState<string>('25000');
  const [customAdvanceAmount, setCustomAdvanceAmount] = useState<string>('5000');

  // Artist & Appointment Slot
  const [selectedArtistId, setSelectedArtistId] = useState<string>('emp-1');
  const [bookingDate, setBookingDate] = useState<string>('2026-11-20');
  const [bookingTime, setBookingTime] = useState<string>('02:00 PM');
  const [locationType, setLocationType] = useState<'studio' | 'venue'>('venue');
  const [venueAddress, setVenueAddress] = useState<string>('');

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [bridalNotes, setBridalNotes] = useState<string>('');

  // Milestone Payment Tracker State (Supports 1, 2, or 3 installments)
  const [milestoneCount, setMilestoneCount] = useState<1 | 2 | 3>(3);
  const [milestonePreset, setMilestonePreset] = useState<'standard' | 'equal' | 'custom'>('standard');

  // Milestone 1 (Initial Advance Token - Paid at Step 2)
  const [m1Title, setM1Title] = useState<string>('Milestone 1: Booking Advance Token to Lock Event Date');
  const [m1Date, setM1Date] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [m1Amount, setM1Amount] = useState<number>(4000);

  // Milestone 2 (Pre-Bridal Consultation & Trial Session)
  const [m2Title, setM2Title] = useState<string>('Milestone 2: Pre-Bridal Consultation & Hair Draping Trial');
  const [m2Date, setM2Date] = useState<string>('2026-11-13');
  const [m2Amount, setM2Amount] = useState<number>(8500);

  // Milestone 3 (Final Settlement on Wedding Day)
  const [m3Title, setM3Title] = useState<string>('Milestone 3: Final Makeover Settlement on Wedding Day');
  const [m3Date, setM3Date] = useState<string>('2026-11-20');
  const [m3Amount, setM3Amount] = useState<number>(8500);

  // Payment Gateway
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('4532 8901 2234 5678');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('892');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Confirmed Result State
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [savedPartPayments, setSavedPartPayments] = useState<PartPayment[]>([]);

  useEffect(() => {
    if (preselectedServiceId) {
      if (preselectedServiceId === 'custom_manual') {
        setIsCustomService(true);
        setSelectedServiceId('custom_manual');
      } else {
        setIsCustomService(false);
        setSelectedServiceId(preselectedServiceId);
      }
    }
  }, [preselectedServiceId]);

  const currentStandardService = services.find(s => s.id === selectedServiceId) || services[0];
  const currentArtist = employees.find(e => e.id === selectedArtistId) || employees[0];

  // Derived effective totals
  const effectiveServiceName = isCustomService
    ? (customServiceName.trim() || 'Custom Tailored Bridal Package')
    : currentStandardService.title;

  const effectiveTotalAmount = isCustomService
    ? Math.max(0, parseFloat(customTotalAmount) || 0)
    : currentStandardService.price;

  const effectiveAdvanceRequired = isCustomService
    ? Math.max(0, parseFloat(customAdvanceAmount) || 0)
    : currentStandardService.advanceRequired;

  const effectiveBalanceDue = Math.max(0, effectiveTotalAmount - effectiveAdvanceRequired);

  // Sync dates when wedding date changes
  useEffect(() => {
    setM3Date(bookingDate);
    try {
      const d = new Date(bookingDate);
      d.setDate(d.getDate() - 7);
      if (!isNaN(d.getTime())) {
        setM2Date(d.toISOString().split('T')[0]);
      }
    } catch {
      // ignore
    }
  }, [bookingDate]);

  // Recalculate milestone amounts when service, total amount, milestoneCount, or preset changes
  useEffect(() => {
    if (milestonePreset === 'custom') return;

    if (milestoneCount === 1) {
      setM1Amount(effectiveTotalAmount);
      setM1Title('Milestone 1: Full Package Payment Upfront');
      setM2Amount(0);
      setM3Amount(0);
    } else if (milestoneCount === 2) {
      if (milestonePreset === 'equal') {
        const half = Math.round(effectiveTotalAmount / 2);
        setM1Amount(half);
        setM2Amount(effectiveTotalAmount - half);
        setM3Amount(0);
      } else {
        const token = effectiveAdvanceRequired > 0 && effectiveAdvanceRequired < effectiveTotalAmount
          ? effectiveAdvanceRequired
          : Math.round(effectiveTotalAmount * 0.25);
        setM1Amount(token);
        setM2Amount(Math.max(0, effectiveTotalAmount - token));
        setM3Amount(0);
      }
      setM1Title('Milestone 1: Booking Advance Token to Lock Event Date');
      setM2Title('Milestone 2: Final Settlement on Wedding Day');
    } else {
      if (milestonePreset === 'equal') {
        const oneThird = Math.round(effectiveTotalAmount / 3);
        setM1Amount(oneThird);
        setM2Amount(oneThird);
        setM3Amount(Math.max(0, effectiveTotalAmount - (oneThird * 2)));
      } else {
        const token = effectiveAdvanceRequired > 0 && effectiveAdvanceRequired < effectiveTotalAmount
          ? effectiveAdvanceRequired
          : Math.round(effectiveTotalAmount * 0.2);
        const remaining = Math.max(0, effectiveTotalAmount - token);
        const trialPart = Math.round(remaining / 2);
        const finalPart = Math.max(0, remaining - trialPart);

        setM1Amount(token);
        setM2Amount(trialPart);
        setM3Amount(finalPart);
      }
      setM1Title('Milestone 1: Booking Advance Token to Lock Event Date');
      setM2Title('Milestone 2: Pre-Bridal Consultation & Hair Draping Trial');
      setM3Title('Milestone 3: Final Makeover Settlement on Wedding Day');
    }
  }, [effectiveTotalAmount, effectiveAdvanceRequired, milestoneCount, milestonePreset]);

  const currentMilestonesSum = useMemo(() => {
    if (milestoneCount === 1) return m1Amount;
    if (milestoneCount === 2) return m1Amount + m2Amount;
    return m1Amount + m2Amount + m3Amount;
  }, [milestoneCount, m1Amount, m2Amount, m3Amount]);

  const milestoneDiscrepancy = effectiveTotalAmount - currentMilestonesSum;
  const isMilestonesBalanced = Math.abs(milestoneDiscrepancy) === 0;

  const handleAutoBalance = () => {
    if (milestoneCount === 1) {
      setM1Amount(effectiveTotalAmount);
    } else if (milestoneCount === 2) {
      const newM2 = Math.max(0, effectiveTotalAmount - m1Amount);
      setM2Amount(newM2);
    } else {
      const newM3 = Math.max(0, effectiveTotalAmount - m1Amount - m2Amount);
      setM3Amount(newM3);
    }
  };

  const handleServiceSelectChange = (val: string) => {
    setSelectedServiceId(val);
    if (val === 'custom_manual') {
      setIsCustomService(true);
      if (!customServiceName) setCustomServiceName('Signature Bridal Makeover + Pre-Bridal Ritual Package');
      setMilestonePreset('standard');
    } else {
      setIsCustomService(false);
      setMilestonePreset('standard');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Please fill in your name and phone number to proceed.');
      return;
    }
    if (isCustomService && (!customServiceName.trim() || effectiveTotalAmount <= 0)) {
      alert('Please enter a valid custom service title and total package amount.');
      return;
    }
    if (!isMilestonesBalanced) {
      if (!confirm(`The sum of milestones (₹${currentMilestonesSum.toLocaleString('en-IN')}) does not match the total package amount (₹${effectiveTotalAmount.toLocaleString('en-IN')}). Would you like to auto-balance the final milestone and proceed?`)) {
        return;
      }
      handleAutoBalance();
    }
    setStep(2);
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedTxn = `TXN-${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const newBkId = `BK-BBK-${Math.floor(200 + Math.random() * 800)}`;

      const generatedParts: PartPayment[] = [];

      generatedParts.push({
        id: `PAY-${newBkId}-1`,
        partNumber: 1,
        title: m1Title || 'Milestone 1: Booking Advance Token',
        serviceName: effectiveServiceName,
        date: m1Date || new Date().toISOString().split('T')[0],
        amount: m1Amount,
        paymentMethod,
        transactionId: generatedTxn,
        receivedBy: `${currentArtist.name} (Online Gateway)`,
        status: 'paid',
        notes: 'Advance token verified and locked via gateway checkout.'
      });

      if (milestoneCount >= 2 && m2Amount > 0) {
        generatedParts.push({
          id: `PAY-${newBkId}-2`,
          partNumber: 2,
          title: m2Title || (milestoneCount === 2 ? 'Milestone 2: Final Settlement' : 'Milestone 2: Pre-Bridal Trial Session'),
          serviceName: effectiveServiceName,
          date: milestoneCount === 2 ? bookingDate : m2Date,
          amount: m2Amount,
          paymentMethod: 'upi',
          transactionId: 'PENDING-INSTALLMENT-2',
          receivedBy: `${currentArtist.name}`,
          status: 'pending',
          notes: milestoneCount === 2 ? 'Final balance clearance on wedding day.' : 'Scheduled installment due during pre-bridal consultation.'
        });
      }

      if (milestoneCount === 3 && m3Amount > 0) {
        generatedParts.push({
          id: `PAY-${newBkId}-3`,
          partNumber: 3,
          title: m3Title || 'Milestone 3: Final Settlement on Wedding Day',
          serviceName: effectiveServiceName,
          date: m3Date || bookingDate,
          amount: m3Amount,
          paymentMethod: 'cash',
          transactionId: 'PENDING-SETTLEMENT-3',
          receivedBy: 'Deepika Sharma (Owner)',
          status: 'pending',
          notes: 'Due on event day prior to ceremony departure.'
        });
      }

      const newBk = addBooking({
        clientName,
        phone: clientPhone,
        email: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        serviceId: isCustomService ? 'custom_manual' : currentStandardService.id,
        serviceName: effectiveServiceName,
        date: bookingDate,
        timeSlot: bookingTime,
        artistId: currentArtist.id,
        artistName: currentArtist.name,
        locationType,
        venueAddress: locationType === 'venue' ? venueAddress || 'Client Wedding Venue' : STUDIO_INFO.address,
        totalAmount: effectiveTotalAmount,
        advancePaid: m1Amount,
        balanceDue: Math.max(0, effectiveTotalAmount - m1Amount),
        paymentStatus: m1Amount >= effectiveTotalAmount ? 'fully_paid' : 'advance_paid',
        bookingStatus: 'confirmed',
        paymentMethod,
        transactionId: generatedTxn,
        notes: bridalNotes,
        partPayments: generatedParts
      });

      setConfirmedBookingId(newBk.id);
      setTransactionRef(generatedTxn);
      setSavedPartPayments(generatedParts);
      setIsProcessingPayment(false);
      setStep(3);
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (!isBookingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/80 shadow bg-stone-950 shrink-0">
              <img src={STUDIO_LOGO} alt="Deepika Sharma Monogram" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Deepika Sharma Luxury Concierge</span>
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mt-0.5">
                {step === 1 && 'Reserve Your Bridal Makeover'}
                {step === 2 && 'Advance Token Payment Gateway'}
                {step === 3 && 'Booking Confirmed & Installment Receipt'}
              </h2>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="px-6 py-2.5 bg-stone-900/60 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className={step >= 1 ? 'text-amber-300 font-semibold' : ''}>1. Service & 3-Part Plan</span>
          <span className="text-stone-700">→</span>
          <span className={step >= 2 ? 'text-amber-300 font-semibold' : ''}>2. Advance Token Pay</span>
          <span className="text-stone-700">→</span>
          <span className={step === 3 ? 'text-emerald-400 font-semibold' : ''}>3. Verified Voucher</span>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: Details & Flexible 3-Part Payment Plan */}
        {/* ========================================================================= */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            
            {/* Service & Artist Pickers */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Package / Look</span>
                  </label>
                  <span className="text-[11px] text-amber-300">
                    Standard Catalog or Custom Entry
                  </span>
                </div>
                <select
                  value={isCustomService ? 'custom_manual' : selectedServiceId}
                  onChange={(e) => handleServiceSelectChange(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <optgroup label="Standard Studio Bridal Packages">
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} — ₹{s.price.toLocaleString('en-IN')} (Advance: ₹{s.advanceRequired.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Custom / Manual Packages">
                    <option value="custom_manual">
                      ✍️ Custom / Manual Service Entry (Type Custom Service Name & Fee)
                    </option>
                  </optgroup>
                </select>
              </div>

              {/* MANUAL / CUSTOM SERVICE INPUT FIELDS */}
              {isCustomService && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    <span>Manual Custom Service & Pricing Specification</span>
                  </div>
                  
                  <div>
                    <label className="text-[11px] text-stone-300 font-medium block mb-1">
                      Custom Service Title / Combo Package Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bridal HD Pheras + 2 Siders Makeup + Hair Spa & Saree Draping"
                      value={customServiceName}
                      onChange={(e) => setCustomServiceName(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-300 font-medium block mb-1">
                        Total Package Amount (₹) *
                      </label>
                      <input
                        type="number"
                        min="1000"
                        required
                        placeholder="e.g. 25000"
                        value={customTotalAmount}
                        onChange={(e) => setCustomTotalAmount(e.target.value)}
                        className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-300 font-medium block mb-1">
                        Initial Advance Token to Pay Now (₹) *
                      </label>
                      <input
                        type="number"
                        min="500"
                        required
                        placeholder="e.g. 5000"
                        value={customAdvanceAmount}
                        onChange={(e) => setCustomAdvanceAmount(e.target.value)}
                        className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1 border-t border-amber-500/20">
                    <span>Remaining Balance for Installments:</span>
                    <span className="font-mono font-bold text-stone-200">
                      ₹{effectiveBalanceDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {/* Preferred Stylist */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Preferred Stylist / Artist
                </label>
                <select
                  value={selectedArtistId}
                  onChange={(e) => setSelectedArtistId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Event / Wedding Date</span>
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Makeover Start Slot</span>
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="08:00 AM">08:00 AM (Morning Pooja / Haldi)</option>
                  <option value="11:30 AM">11:30 AM (Afternoon Luncheon)</option>
                  <option value="02:00 PM">02:00 PM (Bridal Pheras Setup)</option>
                  <option value="04:30 PM">04:30 PM (Evening Reception Glam)</option>
                  <option value="07:00 PM">07:00 PM (Night Cocktails / Sangeet)</option>
                </select>
              </div>
            </div>

            {/* Location Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                Makeover Destination
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocationType('venue')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    locationType === 'venue'
                      ? 'border-amber-400 bg-amber-950/30 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="block font-medium">On-Site Wedding Venue</span>
                  <span className="text-[10px] text-stone-400">Stylist travels to hotel / banquet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationType('studio')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                    locationType === 'studio'
                      ? 'border-amber-400 bg-amber-950/30 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="block font-medium">Deepika Sharma Studio</span>
                  <span className="text-[10px] text-stone-400">Behind Akash Palace, Barabanki</span>
                </button>
              </div>

              {locationType === 'venue' && (
                <input
                  type="text"
                  placeholder="Venue Address (e.g. Sagar Grand, Akash Palace Lawn, Hotel or Home Address in Barabanki/Lucknow)"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full p-2.5 mt-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                />
              )}
            </div>

            {/* Client Info */}
            <div className="space-y-3 pt-2 border-t border-stone-800">
              <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider block">
                Bride / Client Contact Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Radhika Kapoor)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone (+91 95804 94058)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  placeholder="Email Address for Digital Receipt"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full pl-9 p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <textarea
                rows={2}
                placeholder="Bridal Notes: Outfit color (e.g. Crimson velvet lehenga), skin sensitivities, or jewelry type"
                value={bridalNotes}
                onChange={(e) => setBridalNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* MILESTONE PAYMENT TRACKER */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/95 border border-amber-500/40 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Milestone Payment Tracker
                      </h4>
                      <span className="text-[10px] text-amber-300 font-mono font-medium">
                        (Up to 3 Installments)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Schedule milestone installments with specific due dates, deliverables, and auto-balancing.
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMilestoneCount(1)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      milestoneCount === 1
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    1 Part
                  </button>
                  <button
                    type="button"
                    onClick={() => setMilestoneCount(2)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      milestoneCount === 2
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    2 Milestones
                  </button>
                  <button
                    type="button"
                    onClick={() => setMilestoneCount(3)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      milestoneCount === 3
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    3 Milestones ★
                  </button>
                </div>
              </div>

              {/* Milestone Preset buttons */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Preset Strategy:</span>
                <button
                  type="button"
                  onClick={() => setMilestonePreset('standard')}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                    milestonePreset === 'standard'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  Standard Bridal (Advance + Trial + Final)
                </button>
                <button
                  type="button"
                  onClick={() => setMilestonePreset('equal')}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                    milestonePreset === 'equal'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  Equal Splits
                </button>
              </div>

              {/* Installment Breakdown Cards */}
              <div className="space-y-3">
                {/* Milestone 1 */}
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Milestone 1 (Paid Now as Advance Token)</span>
                    <span className="text-[11px] font-mono text-amber-400">Due Today</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={m1Title}
                      onChange={(e) => setM1Title(e.target.value)}
                      placeholder="Milestone title"
                      className="p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">₹</span>
                      <input
                        type="number"
                        value={m1Amount}
                        onChange={(e) => {
                          setM1Amount(Number(e.target.value));
                          setMilestonePreset('custom');
                        }}
                        className="w-full p-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono font-bold text-amber-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Milestone 2 */}
                {milestoneCount >= 2 && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-200">
                        {milestoneCount === 2 ? 'Milestone 2 (Wedding Day Settlement)' : 'Milestone 2 (Pre-Bridal Trial Session)'}
                      </span>
                      <input
                        type="date"
                        value={m2Date}
                        onChange={(e) => setM2Date(e.target.value)}
                        className="p-1 rounded bg-stone-900 border border-stone-700 text-[11px] text-stone-300 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={m2Title}
                        onChange={(e) => setM2Title(e.target.value)}
                        placeholder="Milestone title"
                        className="p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">₹</span>
                        <input
                          type="number"
                          value={m2Amount}
                          onChange={(e) => {
                            setM2Amount(Number(e.target.value));
                            setMilestonePreset('custom');
                          }}
                          className="w-full p-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono font-bold text-stone-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Milestone 3 */}
                {milestoneCount === 3 && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-200">Milestone 3 (Final Makeover Settlement)</span>
                      <input
                        type="date"
                        value={m3Date}
                        onChange={(e) => setM3Date(e.target.value)}
                        className="p-1 rounded bg-stone-900 border border-stone-700 text-[11px] text-stone-300 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={m3Title}
                        onChange={(e) => setM3Title(e.target.value)}
                        placeholder="Milestone title"
                        className="p-1.5 rounded bg-stone-900 border border-stone-700 text-xs text-stone-200"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">₹</span>
                        <input
                          type="number"
                          value={m3Amount}
                          onChange={(e) => {
                            setM3Amount(Number(e.target.value));
                            setMilestonePreset('custom');
                          }}
                          className="w-full p-1.5 rounded bg-stone-900 border border-stone-700 text-xs font-mono font-bold text-stone-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation & Balance check banner */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                <div className="flex items-center gap-2">
                  {isMilestonesBalanced ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Installments sum matches Total (₹{effectiveTotalAmount.toLocaleString('en-IN')})
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 font-medium">
                      <AlertCircle className="w-4 h-4" /> Discrepancy of ₹{Math.abs(milestoneDiscrepancy).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {!isMilestonesBalanced && (
                  <button
                    type="button"
                    onClick={handleAutoBalance}
                    className="px-3 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Auto-Balance Final Part
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Advance Token Payment (₹{m1Amount.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Advance Token Payment Gateway Simulator */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            
            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Client / Bride:</span>
                <span className="font-semibold text-white">{clientName} ({clientPhone})</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Selected Service:</span>
                <span className="font-semibold text-amber-300">{effectiveServiceName}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Event Date & Slot:</span>
                <span className="font-semibold text-white">{bookingDate} ({bookingTime})</span>
              </div>
              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-sm">
                <span className="font-bold text-stone-200">Milestone 1 Advance Due Now:</span>
                <span className="font-mono font-bold text-amber-300 text-base">₹{m1Amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                Select Secure Payment Method
              </label>
              
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-md'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-md'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-md'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span>Net Banking / Wallet</span>
                </button>
              </div>
            </div>

            {/* Dynamic Payment Form Body */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
              {paymentMethod === 'upi' && (
                <div className="text-center space-y-3 py-2">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-stone-950" />
                  </div>
                  <p className="text-xs text-stone-300">
                    Scan via Google Pay, PhonePe, Paytm, or BHIM UPI to lock date.
                  </p>
                  <input
                    type="text"
                    placeholder="Enter UPI Transaction Ref / VPA (e.g. 9580494058@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs text-center focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">CVV Security</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-[11px] text-stone-400 block">Select Preferred Bank</label>
                  <select className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs cursor-pointer">
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank (PNB)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-900/50 p-3 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-bit SSL Encrypted Studio Checkout. Advance payment is non-refundable and instantly locks the event date in Barabanki archive.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleSimulatePayment}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Secure Transaction...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay ₹{m1Amount.toLocaleString('en-IN')} & Confirm Booking</span>
                  </span>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Confirmed Voucher & Printable Installment Receipt */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            
            {/* Success Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-white">
                Booking Locked Successfully!
              </h3>
              <p className="text-xs text-stone-300">
                Your event date is securely reserved in Barabanki. Booking ID: <strong className="text-amber-300 font-mono">{confirmedBookingId}</strong>
              </p>
            </div>

            {/* Printable Voucher Card */}
            <div id="printable-voucher" className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 text-xs">
              
              {/* Voucher Top Brand */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h4 className="font-serif-luxury text-base font-bold text-white">{STUDIO_INFO.name}</h4>
                  <p className="text-[10px] text-stone-400">Official Bridal Makeover & Installment Voucher</p>
                </div>
                <div className="text-right font-mono text-[11px] text-amber-300">
                  Ref: {transactionRef}
                </div>
              </div>

              {/* Client & Booking Grid */}
              <div className="grid grid-cols-2 gap-3 text-stone-300">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Client Name</span>
                  <strong className="text-white">{clientName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Contact Phone</span>
                  <strong className="text-white">{clientPhone}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Service Package</span>
                  <strong className="text-amber-200">{effectiveServiceName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Assigned Artist</span>
                  <strong className="text-white">{currentArtist.name}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Event Date & Time</span>
                  <strong className="text-white">{bookingDate} ({bookingTime})</strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase">Makeover Destination</span>
                  <strong className="text-white">{locationType === 'studio' ? 'Studio (Lakhpedabagh)' : venueAddress || 'On-Site Venue'}</strong>
                </div>
              </div>

              {/* Installment Schedule Breakdown Table */}
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <span className="font-semibold text-stone-200 uppercase tracking-wider text-[11px] block">
                  Milestone Installment Schedule:
                </span>
                <div className="space-y-1.5">
                  {savedPartPayments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded bg-stone-950 border border-stone-800 text-[11px]">
                      <div>
                        <strong className="text-stone-200 block">{p.title}</strong>
                        <span className="text-stone-400 font-mono">Due: {p.date} · {p.receivedBy}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-amber-300 block">₹{p.amount.toLocaleString('en-IN')}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${p.status === 'paid' ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-900 text-stone-400'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary Strip */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 block">Total Package Amount</span>
                  <span className="font-mono font-bold text-white">₹{effectiveTotalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Advance Token Paid</span>
                  <span className="font-mono font-bold text-emerald-400">₹{m1Amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block">Balance Due</span>
                  <span className="font-mono font-bold text-amber-300">₹{Math.max(0, effectiveTotalAmount - m1Amount).toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Official Voucher</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeBookingModal();
                  openClientPortal();
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Client Portal & View Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
