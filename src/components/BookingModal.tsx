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
        // Standard 2-milestone: Token advance + Wedding day clearance
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
      // 3 Milestones
      if (milestonePreset === 'equal') {
        const oneThird = Math.round(effectiveTotalAmount / 3);
        setM1Amount(oneThird);
        setM2Amount(oneThird);
        setM3Amount(Math.max(0, effectiveTotalAmount - (oneThird * 2)));
      } else {
        // Standard Bridal Milestone (e.g. ~20% Token, ~40% Pre-bridal Trial, ~40% Wedding Day)
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

  // Current milestone sum and balancing calculation
  const currentMilestonesSum = useMemo(() => {
    if (milestoneCount === 1) return m1Amount;
    if (milestoneCount === 2) return m1Amount + m2Amount;
    return m1Amount + m2Amount + m3Amount;
  }, [milestoneCount, m1Amount, m2Amount, m3Amount]);

  const milestoneDiscrepancy = effectiveTotalAmount - currentMilestonesSum;
  const isMilestonesBalanced = Math.abs(milestoneDiscrepancy) === 0;

  // Auto-balance button handler
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

  // Handle service selector change
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

      // Construct Part-Wise Installment Schedule based on active milestone configuration
      const generatedParts: PartPayment[] = [];

      // Milestone 1 (Always paid online now)
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

      // Milestone 2 (If configured)
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

      // Milestone 3 (If configured)
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
              <img src={STUDIO_LOGO} alt="Deepika Sharma Monogram" className="w-full h-full object-cover" />
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
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 hover:bg-stone-800 transition-colors"
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
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
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

              {/* MANUAL / CUSTOM SERVICE INPUT FIELDS (Owner & Employee & Client Custom Quote) */}
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
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
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
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-sm focus:outline-none focus:border-amber-400"
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
                  className={`p-3 rounded-xl border text-left text-xs transition-colors ${
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
                  className={`p-3 rounded-xl border text-left text-xs transition-colors ${
                    locationType === 'studio'
                      ? 'border-amber-400 bg-amber-950/30 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="block font-medium">Deepika Sharma Studio</span>
                  <span className="text-[10px] text-stone-400">Behind Akash Palace, Lakhpedabagh</span>
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

            {/* ========================================================================= */}
            {/* MILESTONE PAYMENT TRACKER (1, 2, or 3 Installments with Dates & Services) */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/95 border border-amber-500/40 space-y-4 shadow-xl">
              
              {/* Tracker Header */}
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

                {/* Milestone Count Segmented Control */}
                <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMilestoneCount(1)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
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
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
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
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                      milestoneCount === 3
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    3 Milestones ★
                  </button>
                </div>
              </div>

              {/* Milestone Preset Split Bar */}
              {milestoneCount > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-stone-400">Installment Preset:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setMilestonePreset('standard')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        milestonePreset === 'standard'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                          : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      {milestoneCount === 3 ? 'Standard Bridal (20% - 40% - 40%)' : 'Standard (Token + Wedding Day)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMilestonePreset('equal')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        milestonePreset === 'equal'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                          : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      {milestoneCount === 3 ? 'Equal Split (33% × 3)' : 'Equal Split (50% - 50%)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMilestonePreset('custom')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        milestonePreset === 'custom'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                          : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      Custom Amounts
                    </button>
                  </div>
                </div>
              )}

              {/* Visual Milestone Progress Tracker Bar */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="font-semibold text-stone-300 uppercase tracking-wider text-[10px]">
                    Milestone Allocation Timeline
                  </span>
                  <span className="font-mono text-white">
                    Total: ₹{effectiveTotalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Proportional Segment Bar */}
                <div className="h-4 rounded-lg bg-stone-900 overflow-hidden flex p-0.5 gap-1 border border-stone-800">
                  <div
                    style={{ width: `${effectiveTotalAmount > 0 ? Math.max(10, Math.min(100, (m1Amount / effectiveTotalAmount) * 100)) : 100}%` }}
                    className="h-full bg-emerald-500 rounded flex items-center justify-center text-[9px] font-bold text-stone-950 font-mono transition-all"
                    title={`Milestone 1: ₹${m1Amount.toLocaleString('en-IN')}`}
                  >
                    M1 ({effectiveTotalAmount > 0 ? Math.round((m1Amount / effectiveTotalAmount) * 100) : 100}%)
                  </div>

                  {milestoneCount >= 2 && m2Amount > 0 && (
                    <div
                      style={{ width: `${effectiveTotalAmount > 0 ? Math.max(10, Math.min(100, (m2Amount / effectiveTotalAmount) * 100)) : 0}%` }}
                      className="h-full bg-amber-400 rounded flex items-center justify-center text-[9px] font-bold text-stone-950 font-mono transition-all"
                      title={`Milestone 2: ₹${m2Amount.toLocaleString('en-IN')}`}
                    >
                      M2 ({effectiveTotalAmount > 0 ? Math.round((m2Amount / effectiveTotalAmount) * 100) : 0}%)
                    </div>
                  )}

                  {milestoneCount === 3 && m3Amount > 0 && (
                    <div
                      style={{ width: `${effectiveTotalAmount > 0 ? Math.max(10, Math.min(100, (m3Amount / effectiveTotalAmount) * 100)) : 0}%` }}
                      className="h-full bg-sky-400 rounded flex items-center justify-center text-[9px] font-bold text-stone-950 font-mono transition-all"
                      title={`Milestone 3: ₹${m3Amount.toLocaleString('en-IN')}`}
                    >
                      M3 ({effectiveTotalAmount > 0 ? Math.round((m3Amount / effectiveTotalAmount) * 100) : 0}%)
                    </div>
                  )}
                </div>

                {/* Milestone Nodes Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-medium">M1: Pay Now (₹{m1Amount.toLocaleString('en-IN')})</span>
                  </div>

                  {milestoneCount >= 2 && (
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="font-medium">
                        M2: Due {m2Date} (₹{m2Amount.toLocaleString('en-IN')})
                      </span>
                    </div>
                  )}

                  {milestoneCount === 3 && (
                    <div className="flex items-center gap-1.5 text-sky-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      <span className="font-medium">
                        M3: Due {m3Date} (₹{m3Amount.toLocaleString('en-IN')})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* INDIVIDUAL MILESTONE INPUT CARDS */}
              <div className="space-y-3">
                
                {/* MILESTONE 1 CARD */}
                <div className="p-3.5 rounded-xl bg-stone-950 border border-emerald-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                        Milestone 1 · Advance Token
                      </span>
                      <span className="text-[11px] text-emerald-400/80 font-medium hidden sm:inline">
                        (Payable Today at Step 2 to Lock Date)
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">
                      ₹{m1Amount.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-stone-400 font-normal">
                        ({effectiveTotalAmount > 0 ? Math.round((m1Amount / effectiveTotalAmount) * 100) : 100}%)
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                    <div className="sm:col-span-6">
                      <label className="text-[10px] text-stone-400 block mb-1">
                        Milestone 1 Deliverable / Description
                      </label>
                      <input
                        type="text"
                        value={m1Title}
                        onChange={(e) => {
                          setM1Title(e.target.value);
                          setMilestonePreset('custom');
                        }}
                        className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                        placeholder="e.g. Booking Advance Token to Lock Event Date"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-stone-400">Payment Date</label>
                        <button
                          type="button"
                          onClick={() => setM1Date(new Date().toISOString().split('T')[0])}
                          className="text-[9px] text-amber-300 hover:underline"
                        >
                          Today
                        </button>
                      </div>
                      <input
                        type="date"
                        value={m1Date}
                        onChange={(e) => setM1Date(e.target.value)}
                        className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-stone-400 block mb-1">Milestone Amount (₹)</label>
                      <input
                        type="number"
                        min="500"
                        value={m1Amount}
                        onChange={(e) => {
                          setM1Amount(Math.max(0, parseFloat(e.target.value) || 0));
                          setMilestonePreset('custom');
                        }}
                        className="w-full p-2 rounded-lg bg-stone-900 border border-emerald-500/50 text-emerald-400 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* MILESTONE 2 CARD */}
                {milestoneCount >= 2 && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
                          {milestoneCount === 2 ? 'Milestone 2 · Final Balance' : 'Milestone 2 · Mid-Way / Trial Session'}
                        </span>
                        <span className="text-[11px] text-amber-300/80 font-medium hidden sm:inline">
                          {milestoneCount === 2 ? '(Due on wedding ceremony day)' : '(Consultation & draping trial)'}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">
                        ₹{m2Amount.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-stone-400 font-normal">
                          ({effectiveTotalAmount > 0 ? Math.round((m2Amount / effectiveTotalAmount) * 100) : 0}%)
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                      <div className="sm:col-span-6">
                        <label className="text-[10px] text-stone-400 block mb-1">
                          Milestone 2 Deliverable / Service Name
                        </label>
                        <input
                          type="text"
                          value={m2Title}
                          onChange={(e) => {
                            setM2Title(e.target.value);
                            setMilestonePreset('custom');
                          }}
                          className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                          placeholder={milestoneCount === 2 ? "Final Wedding Settlement" : "Pre-Bridal Consultation & Hair Draping Trial"}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-stone-400">Scheduled Due Date</label>
                          {milestoneCount === 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                try {
                                  const d = new Date(bookingDate);
                                  d.setDate(d.getDate() - 7);
                                  setM2Date(d.toISOString().split('T')[0]);
                                } catch {}
                              }}
                              className="text-[9px] text-amber-300 hover:underline"
                            >
                              -7 Days
                            </button>
                          )}
                        </div>
                        <input
                          type="date"
                          value={m2Date}
                          onChange={(e) => setM2Date(e.target.value)}
                          className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-stone-400 block mb-1">Milestone Amount (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={m2Amount}
                          onChange={(e) => {
                            setM2Amount(Math.max(0, parseFloat(e.target.value) || 0));
                            setMilestonePreset('custom');
                          }}
                          className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MILESTONE 3 CARD */}
                {milestoneCount === 3 && (
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-sky-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/80">
                          Milestone 3 · Wedding Day Settlement
                        </span>
                        <span className="text-[11px] text-sky-300/80 font-medium hidden sm:inline">
                          (Final clearance before bridal departure)
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">
                        ₹{m3Amount.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-stone-400 font-normal">
                          ({effectiveTotalAmount > 0 ? Math.round((m3Amount / effectiveTotalAmount) * 100) : 0}%)
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                      <div className="sm:col-span-6">
                        <label className="text-[10px] text-stone-400 block mb-1">
                          Milestone 3 Deliverable / Final Service
                        </label>
                        <input
                          type="text"
                          value={m3Title}
                          onChange={(e) => {
                            setM3Title(e.target.value);
                            setMilestonePreset('custom');
                          }}
                          className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                          placeholder="Final Makeover Settlement on Wedding Day"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-stone-400">Wedding Due Date</label>
                          <button
                            type="button"
                            onClick={() => setM3Date(bookingDate)}
                            className="text-[9px] text-sky-300 hover:underline"
                          >
                            Wedding
                          </button>
                        </div>
                        <input
                          type="date"
                          value={m3Date}
                          onChange={(e) => setM3Date(e.target.value)}
                          className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-stone-400 block mb-1">Milestone Amount (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={m3Amount}
                          onChange={(e) => {
                            setM3Amount(Math.max(0, parseFloat(e.target.value) || 0));
                            setMilestonePreset('custom');
                          }}
                          className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-sky-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* LIVE RECONCILIATION & AUTO-BALANCE FOOTER */}
              <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs transition-colors ${
                isMilestonesBalanced
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isMilestonesBalanced ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-mono">
                    Allocated: ₹{currentMilestonesSum.toLocaleString('en-IN')} / ₹{effectiveTotalAmount.toLocaleString('en-IN')}
                    {isMilestonesBalanced ? (
                      <span className="text-emerald-400 ml-1.5 font-sans font-medium text-[11px]">
                        (Balanced 100% across {milestoneCount} {milestoneCount === 1 ? 'part' : 'milestones'})
                      </span>
                    ) : (
                      <span className="text-amber-300 ml-1.5 font-sans font-medium text-[11px]">
                        (Discrepancy: {milestoneDiscrepancy > 0 ? `₹${milestoneDiscrepancy.toLocaleString('en-IN')} unallocated` : `₹${Math.abs(milestoneDiscrepancy).toLocaleString('en-IN')} over-allocated`})
                      </span>
                    )}
                  </span>
                </div>

                {!isMilestonesBalanced && (
                  <button
                    type="button"
                    onClick={handleAutoBalance}
                    className="py-1 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Auto-Balance Milestones
                  </button>
                )}
              </div>

            </div>

            {/* Advance Token Notice Strip */}
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-300 font-semibold block uppercase tracking-wider">
                  Milestone 1 Token Required to Lock Date
                </span>
                <span className="text-xs text-stone-300">
                  Full Fee: ₹{effectiveTotalAmount.toLocaleString('en-IN')} (Remaining balance ₹{Math.max(0, effectiveTotalAmount - m1Amount).toLocaleString('en-IN')} scheduled across milestones)
                </span>
              </div>
              <span className="font-mono text-2xl font-bold text-amber-300">
                ₹{m1Amount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Proceed to Advance Payment (Milestone 1: ₹{m1Amount.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Real Payment Gateway Simulation for Part 1 Advance Token */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            
            {/* Booking & Milestone Summary Box */}
            <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Reserved Service / Package:</span>
                <span className="text-white font-semibold">{effectiveServiceName}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Master Stylist:</span>
                <span className="text-white font-medium">{currentArtist.name}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Event Date & Slot:</span>
                <span className="text-white font-mono">{bookingDate} at {bookingTime}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Total Package Price:</span>
                <span className="text-white font-mono font-bold">₹{effectiveTotalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Milestone breakdown preview */}
              <div className="pt-2 border-t border-stone-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>• Milestone 1 (Paying Now via Gateway):</span>
                  <span className="font-mono">₹{m1Amount.toLocaleString('en-IN')} (Due {m1Date})</span>
                </div>
                {milestoneCount >= 2 && m2Amount > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>• Milestone 2 (Scheduled):</span>
                    <span className="font-mono">₹{m2Amount.toLocaleString('en-IN')} (Due {m2Date})</span>
                  </div>
                )}
                {milestoneCount === 3 && m3Amount > 0 && (
                  <div className="flex justify-between text-sky-400">
                    <span>• Milestone 3 (Scheduled):</span>
                    <span className="font-mono">₹{m3Amount.toLocaleString('en-IN')} (Due {m3Date})</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-stone-400 pt-2 border-t border-stone-800 font-semibold">
                <span className="text-amber-300">Milestone 1 Token Payable Right Now:</span>
                <span className="font-mono text-lg text-amber-300">₹{m1Amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                Choose Instant Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    paymentMethod === 'upi'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-900 text-stone-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span className="text-xs block">UPI / QR Code</span>
                  <span className="text-[10px] text-stone-500">GPay, PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-900 text-stone-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span className="text-xs block">Cards</span>
                  <span className="text-[10px] text-stone-500">Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    paymentMethod === 'netbanking'
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200 font-semibold'
                      : 'border-stone-800 bg-stone-900 text-stone-400'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <span className="text-xs block">NetBanking</span>
                  <span className="text-[10px] text-stone-500">HDFC, ICICI, SBI</span>
                </button>
              </div>
            </div>

            {/* UPI Option */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center shrink-0">
                    <QrCode className="w-20 h-20 text-stone-950" />
                  </div>
                  <div className="space-y-1 text-xs text-stone-300">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                      Scan QR with Any UPI App
                    </span>
                    <p className="text-stone-400">
                      Scan via Google Pay, PhonePe, Paytm, or BHIM.
                    </p>
                    <p className="font-mono text-[11px] text-stone-200 bg-stone-950 px-2 py-1 rounded inline-block">
                      UPI ID: deepikasharma.bbk@icici
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Or enter your VPA / UPI ID (e.g. mobile@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="flex-1 p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Card Option */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NetBanking Option */}
            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2">
                <label className="text-xs text-stone-400">Select NetBanking Institution</label>
                <select className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400">
                  <option>HDFC Bank Corporate & Retail</option>
                  <option>ICICI Bank Infinity</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleSimulatePayment}
                className="flex-1 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Part 1 Token Payment...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay Milestone 1 (₹{m1Amount.toLocaleString('en-IN')}) & Lock Date</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Verified Digital Booking Voucher & Milestone Installment Receipt */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
            
            {/* Success Check Banner */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Wedding Date Confirmed!
              </h3>
              <p className="text-xs text-stone-300">
                Your advance payment of ₹{m1Amount.toLocaleString('en-IN')} has been acknowledged by Deepika Sharma Studio (Behind Akash Palace, Lakhpedabagh, Barabanki).
              </p>
            </div>

            {/* Printable Digital Receipt Card */}
            <div id="booking-receipt" className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 text-xs">
              
              {/* Studio Master Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 bg-stone-950 shrink-0">
                    <img src={STUDIO_LOGO} alt="Deepika Sharma Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-serif-luxury text-base font-bold text-amber-200 block">
                      {STUDIO_INFO.name}
                    </span>
                    <span className="text-[10px] text-stone-400">{STUDIO_INFO.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Booking ID</span>
                  <span className="font-mono text-sm font-bold text-amber-300">{confirmedBookingId}</span>
                </div>
              </div>

              {/* Client & Service Grid */}
              <div className="grid grid-cols-2 gap-3 text-stone-300">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Bride Name</span>
                  <span className="font-medium text-white">{clientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Contact Phone</span>
                  <span className="font-mono">{clientPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Reserved Look / Service</span>
                  <span className="font-medium text-white">{effectiveServiceName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Master Stylist</span>
                  <span className="text-white">{currentArtist.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Event Date</span>
                  <span className="font-mono text-white">{bookingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Slot Timing</span>
                  <span className="font-mono text-white">{bookingTime}</span>
                </div>
              </div>

              {/* MILESTONE PAYMENT SCHEDULE TABLE */}
              <div className="pt-3 border-t border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Milestone Payment Installment Schedule</span>
                  </span>
                  <span className="font-mono text-stone-400">{savedPartPayments.length} Milestone Plan</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-stone-800">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                      <tr>
                        <th className="p-2">Milestone</th>
                        <th className="p-2">Installment Description</th>
                        <th className="p-2">Scheduled Due Date</th>
                        <th className="p-2 text-right">Amount</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 font-sans">
                      {savedPartPayments.map((part) => (
                        <tr key={part.id} className="hover:bg-stone-800/40">
                          <td className="p-2 font-mono font-bold text-amber-300">
                            Milestone {part.partNumber}
                          </td>
                          <td className="p-2 font-medium text-stone-200">
                            {part.title}
                          </td>
                          <td className="p-2 font-mono text-stone-400">
                            {part.date}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-white tabular-nums">
                            ₹{part.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 text-center">
                            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                              part.status === 'paid'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                                : 'bg-amber-950 text-amber-300 border border-amber-800/80'
                            }`}>
                              {part.status === 'paid' ? 'Paid ✓' : 'Due ⏳'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Calculations */}
              <div className="pt-2 border-t border-stone-800 space-y-1.5 font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Total Booking Package Fee:</span>
                  <span>₹{effectiveTotalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Milestone 1 Advance Token Received:</span>
                  <span>- ₹{m1Amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-amber-300 font-bold text-sm pt-1 border-t border-stone-800">
                  <span>Total Balance Pending (Scheduled Milestones):</span>
                  <span>₹{Math.max(0, effectiveTotalAmount - m1Amount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-stone-500 flex items-center justify-between">
                <span>Milestone 1 Gateway Ref: {transactionRef}</span>
                <span className="text-emerald-400">● Digitally Signed & Locked</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Save Voucher</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeBookingModal();
                  openClientPortal(clientPhone);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>View in Client Portal</span>
              </button>

              <button
                type="button"
                onClick={closeBookingModal}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
