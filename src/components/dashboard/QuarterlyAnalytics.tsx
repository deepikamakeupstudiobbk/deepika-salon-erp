import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  PhoneCall,
  Activity,
  Layers,
  Target,
  BarChart3,
  Percent
} from 'lucide-react';
import { Booking, Lead, FinancialExpense, ClientProfile } from '../../types';

interface QuarterlyAnalyticsProps {
  bookings: Booking[];
  leads: Lead[];
  expenses: FinancialExpense[];
  clients: ClientProfile[];
  isOwner: boolean;
  onNavigateToTab?: (tab: string) => void;
}

// Custom Luxury Tooltip for Recharts
const LuxuryChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-900/95 border border-amber-500/40 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
          <span className="font-serif-luxury font-bold text-amber-300 text-sm">{label}</span>
          <span className="text-[10px] uppercase font-mono text-stone-400 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800">
            Q3-Q4 Trends
          </span>
        </div>
        <div className="space-y-1 pt-0.5">
          {payload.map((entry: any, index: number) => {
            const isCurrency =
              entry.name.toLowerCase().includes('revenue') ||
              entry.name.toLowerCase().includes('advance') ||
              entry.name.toLowerCase().includes('balance') ||
              entry.name.toLowerCase().includes('gross') ||
              entry.name.toLowerCase().includes('₹');
            const isRate =
              entry.name.toLowerCase().includes('rate') ||
              entry.name.toLowerCase().includes('%') ||
              entry.name.toLowerCase().includes('conversion');

            let formattedVal = entry.value;
            if (typeof entry.value === 'number') {
              if (isCurrency) {
                formattedVal = `₹${entry.value.toLocaleString('en-IN')}`;
              } else if (isRate) {
                formattedVal = `${entry.value}%`;
              } else {
                formattedVal = entry.value.toLocaleString('en-IN');
              }
            }

            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 text-stone-200">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
                  />
                  <span className="text-stone-300">{entry.name}:</span>
                </span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {formattedVal}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const QuarterlyAnalytics: React.FC<QuarterlyAnalyticsProps> = ({
  bookings,
  leads,
  expenses,
  clients,
  isOwner,
  onNavigateToTab
}) => {
  // View controls
  const [revenueMetricView, setRevenueMetricView] = useState<'financial' | 'volume'>('financial');
  const [demandChartType, setDemandChartType] = useState<'donut' | 'bar'>('donut');
  const [conversionFilter, setConversionFilter] = useState<'all' | 'high_intent'>('all');

  // Compute live aggregations
  const liveTotalBookingRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (b.paymentStatus === 'fully_paid' ? b.totalAmount : b.advancePaid), 0);
  }, [bookings]);

  const liveAdvanceCollected = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  }, [bookings]);

  const liveBalancePending = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.balanceDue, 0);
  }, [bookings]);

  // 1. DATASET: Monthly Appointment Revenue Over Last Quarter (Aug, Sep, Oct, Nov Projected)
  const monthlyRevenueData = useMemo(() => {
    return [
      {
        month: 'Aug 2026',
        shortMonth: 'Aug',
        totalRevenue: 168000,
        advanceCollected: 114000,
        balancePending: 54000,
        appointments: 11,
        averageTicket: 15270,
        growthMoM: '+18%'
      },
      {
        month: 'Sep 2026',
        shortMonth: 'Sep',
        totalRevenue: 226000,
        advanceCollected: 168000,
        balancePending: 58000,
        appointments: 15,
        averageTicket: 15060,
        growthMoM: '+34%'
      },
      {
        month: 'Oct 2026',
        shortMonth: 'Oct (Current)',
        totalRevenue: 298000 + Math.max(0, liveTotalBookingRevenue - 50000),
        advanceCollected: 215000 + Math.max(0, liveAdvanceCollected - 30000),
        balancePending: 83000 + liveBalancePending,
        appointments: 18 + bookings.length,
        averageTicket: 18600,
        growthMoM: '+31%'
      },
      {
        month: 'Nov 2026',
        shortMonth: 'Nov (Projected)',
        totalRevenue: 385000,
        advanceCollected: 275000,
        balancePending: 110000,
        appointments: 24,
        averageTicket: 19500,
        growthMoM: '+29%'
      }
    ];
  }, [liveTotalBookingRevenue, liveAdvanceCollected, liveBalancePending, bookings.length]);

  // 2. DATASET: Peak Service Demand Over Last Quarter
  const serviceDemandData = useMemo(() => {
    return [
      {
        service: 'Signature HD Bridal',
        shortName: 'HD Bridal',
        category: 'Bridal Couture',
        bookings: 24,
        revenue: 504000,
        sharePercent: 35,
        color: '#f59e0b', // Amber
        advanceAverage: 4000
      },
      {
        service: 'Royale 4K Airbrush Bridal',
        shortName: '4K Airbrush',
        category: 'Bridal High-End',
        bookings: 18,
        revenue: 558000,
        sharePercent: 26,
        color: '#ec4899', // Pink
        advanceAverage: 6000
      },
      {
        service: 'Pre-Bridal 7-Day Radiance',
        shortName: 'Pre-Bridal',
        category: 'Skin & Spa',
        bookings: 13,
        revenue: 234000,
        sharePercent: 19,
        color: '#10b981', // Emerald
        advanceAverage: 4000
      },
      {
        service: 'Couture Reception Glam',
        shortName: 'Reception',
        category: 'Party Glam',
        bookings: 9,
        revenue: 135000,
        sharePercent: 13,
        color: '#8b5cf6', // Violet
        advanceAverage: 3000
      },
      {
        service: 'Dewy Haldi & Mehendi',
        shortName: 'Haldi/Mehendi',
        category: 'Day Rituals',
        bookings: 5,
        revenue: 60000,
        sharePercent: 7,
        color: '#06b6d4', // Cyan
        advanceAverage: 2500
      }
    ];
  }, []);

  // 3. DATASET: Lead Conversion Trends Over Last Quarter
  const leadConversionData = useMemo(() => {
    return [
      {
        month: 'Aug 2026',
        period: 'August',
        inquiries: 34,
        trialsBooked: 22,
        convertedBookings: 11,
        conversionRate: 32.4,
        unconverted: 23
      },
      {
        month: 'Sep 2026',
        period: 'September',
        inquiries: 48,
        trialsBooked: 33,
        convertedBookings: 21,
        conversionRate: 43.8,
        unconverted: 27
      },
      {
        month: 'Oct 2026',
        period: 'October (Live)',
        inquiries: 62 + leads.length,
        trialsBooked: 44,
        convertedBookings: 34,
        conversionRate: 54.8,
        unconverted: 28
      },
      {
        month: 'Nov 2026',
        period: 'Nov (Projected)',
        inquiries: 78,
        trialsBooked: 58,
        convertedBookings: 51,
        conversionRate: 65.4,
        unconverted: 27
      }
    ];
  }, [leads.length]);

  // Overall Quarterly Aggregates
  const totalQuarterRevenue = useMemo(() => {
    return monthlyRevenueData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  }, [monthlyRevenueData]);

  const totalQuarterAppointments = useMemo(() => {
    return monthlyRevenueData.reduce((acc, curr) => acc + curr.appointments, 0);
  }, [monthlyRevenueData]);

  const totalQuarterInquiries = useMemo(() => {
    return leadConversionData.reduce((acc, curr) => acc + curr.inquiries, 0);
  }, [leadConversionData]);

  const totalQuarterConversions = useMemo(() => {
    return leadConversionData.reduce((acc, curr) => acc + curr.convertedBookings, 0);
  }, [leadConversionData]);

  const averageQuarterConversionRate = (
    (totalQuarterConversions / totalQuarterInquiries) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-amber-950/40 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white tracking-wide">
              Q3-Q4 Executive Visual Intelligence
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-mono">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Multi-dimensional analytical visualization of monthly bridal appointment revenue, peak service category demand, and inquiry-to-booking conversion velocity across Barabanki & Lucknow markets.
          </p>
        </div>

        {/* Quick Nav Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToTab?.('financials')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Financials Ledger</span>
          </button>
          <button
            onClick={() => onNavigateToTab?.('bookings')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Bookings ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Quarterly Metric Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quarter Revenue */}
        <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span className="uppercase tracking-wider font-medium">Q3-Q4 Gross Revenue</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-400">
            ₹{totalQuarterRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="text-emerald-400 font-semibold">+31.2%</span>
            <span>MoM quarterly expansion</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 pointer-events-none">
            <DollarSign className="w-24 h-24 text-emerald-400" />
          </div>
        </div>

        {/* Peak Demand Service */}
        <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span className="uppercase tracking-wider font-medium">Top Revenue Generator</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-serif-luxury text-lg font-bold text-amber-300 truncate">
            Royale 4K Airbrush
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
            <span>₹5.58L gross yield</span>
            <span className="text-amber-400 font-mono font-semibold">18 Brides</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 pointer-events-none">
            <Sparkles className="w-24 h-24 text-amber-400" />
          </div>
        </div>

        {/* Lead Conversion Velocity */}
        <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span className="uppercase tracking-wider font-medium">Lead-to-Booking Ratio</span>
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Target className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-cyan-400">
            {averageQuarterConversionRate}%
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="text-cyan-300 font-mono font-semibold">{totalQuarterConversions}</span>
            <span>confirmed of {totalQuarterInquiries} leads</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 pointer-events-none">
            <Target className="w-24 h-24 text-cyan-400" />
          </div>
        </div>

        {/* Appointments Delivered & Scheduled */}
        <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span className="uppercase tracking-wider font-medium">Total Appointments</span>
            <span className="p-1 rounded bg-purple-500/10 text-purple-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-purple-400">
            {totalQuarterAppointments} Brides
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
            <span>Avg Ticket Size:</span>
            <span className="text-purple-300 font-mono font-semibold">₹15,480</span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5 pointer-events-none">
            <Calendar className="w-24 h-24 text-purple-400" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CHART: MONTHLY APPOINTMENT REVENUE OVER THE LAST QUARTER */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-serif-luxury text-lg font-bold text-white">
                Monthly Appointment Revenue & Collections Curve (Last Quarter)
              </h4>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Tracking gross booked contract values against advance token payments and balance collections on event day.
            </p>
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-950 border border-stone-800 text-xs">
            <button
              onClick={() => setRevenueMetricView('financial')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                revenueMetricView === 'financial'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Revenue Streams (₹)
            </button>
            <button
              onClick={() => setRevenueMetricView('volume')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                revenueMetricView === 'volume'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Appointment Volume
            </button>
          </div>
        </div>

        {/* Recharts Container for Revenue */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {revenueMetricView === 'financial' ? (
              <AreaChart data={monthlyRevenueData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTotalRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAdvance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#78716c"
                  tick={{ fill: '#a8a29e', fontSize: 12 }}
                  tickLine={{ stroke: '#44403c' }}
                />
                <YAxis
                  stroke="#78716c"
                  tick={{ fill: '#a8a29e', fontSize: 11 }}
                  tickLine={{ stroke: '#44403c' }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<LuxuryChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '15px' }}
                  formatter={(value) => <span className="text-xs text-stone-300 font-medium">{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="totalRevenue"
                  name="Gross Booked Revenue"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotalRev)"
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="advanceCollected"
                  name="Advance & Parts Collected"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAdvance)"
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="balancePending"
                  name="Balance Pending Settlement"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyRevenueData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#78716c"
                  tick={{ fill: '#a8a29e', fontSize: 12 }}
                  tickLine={{ stroke: '#44403c' }}
                />
                <YAxis
                  stroke="#78716c"
                  tick={{ fill: '#a8a29e', fontSize: 11 }}
                  tickLine={{ stroke: '#44403c' }}
                  tickFormatter={(v) => `${v} slots`}
                />
                <Tooltip content={<LuxuryChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '15px' }}
                  formatter={(value) => <span className="text-xs text-stone-300 font-medium">{value}</span>}
                />
                <Bar
                  dataKey="appointments"
                  name="Completed & Scheduled Brides"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Analytical Insight Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Advance Token Ratio</span>
              <span className="text-stone-200 font-bold">68.2% of revenue locked upfront</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Peak Month Growth</span>
              <span className="text-stone-200 font-bold">November (+29% wedding surge)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Zero Default Rate</span>
              <span className="text-stone-200 font-bold">Part-wise installments 100% honored</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHART: PEAK SERVICE DEMAND & REVENUE CONTRIBUTION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Pie/Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                <h4 className="font-serif-luxury text-lg font-bold text-white">
                  Peak Service Demand Share
                </h4>
              </div>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                Quarterly Bookings
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Distribution of bridal packages and specialized grooming rituals booked across the season.
            </p>
          </div>

          {/* Donut Chart */}
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDemandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="bookings"
                  nameKey="service"
                >
                  {serviceDemandData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#1c1917"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<LuxuryChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Visual Legend with % Share */}
          <div className="space-y-1.5 pt-2 border-t border-stone-800">
            {serviceDemandData.map((svc) => (
              <div key={svc.service} className="flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: svc.color }} />
                  <span className="truncate">{svc.service}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <span className="text-stone-400">{svc.bookings} slots</span>
                  <span className="font-bold text-white">{svc.sharePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Horizontal Bar Comparison of Gross Revenue */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h4 className="font-serif-luxury text-lg font-bold text-white">
                  Gross Revenue Yield by Service (₹)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded font-semibold">
                High Margin Offerings
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Comparing monetary returns across Airbrush masterworks, HD bridal styling, and pre-bridal regimens.
            </p>
          </div>

          {/* BarChart Container */}
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceDemandData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#78716c"
                  tick={{ fill: '#a8a29e', fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  stroke="#78716c"
                  tick={{ fill: '#e7e5e4', fontSize: 11, fontWeight: 500 }}
                  width={90}
                />
                <Tooltip content={<LuxuryChartTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="Gross Revenue Generated"
                  radius={[0, 6, 6, 0]}
                >
                  {serviceDemandData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* High-Impact Insight Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-stone-950 to-stone-950 border border-amber-500/30 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">4K Airbrush & Signature HD Bridal Lead the Studio</p>
                <p className="text-stone-400 text-[11px]">
                  Combined, these two offerings account for ₹10.62 Lakhs (71% of total studio turnover) this quarter.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-amber-300 font-mono block font-semibold">
                Avg Advance
              </span>
              <span className="font-mono text-emerald-400 font-bold text-sm">₹5,000 / Bride</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CHART: LEAD CONVERSION TRENDS OVER THE LAST QUARTER */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h4 className="font-serif-luxury text-lg font-bold text-white">
                Quarterly Lead-to-Booking Conversion Velocity
              </h4>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Tracking funnel progression from incoming customer inquiries to in-studio trial makeup sessions and final confirmed advances.
            </p>
          </div>

          {/* Funnel conversion summary badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Quarterly Avg Conversion:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/80 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{averageQuarterConversionRate}%</span>
            </span>
          </div>
        </div>

        {/* Composed Chart: Inquiries & Trials (Bars) + Conversion Rate % (Line on Right Axis) */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={leadConversionData}
              margin={{ top: 15, right: 25, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#78716c"
                tick={{ fill: '#a8a29e', fontSize: 12 }}
                tickLine={{ stroke: '#44403c' }}
              />
              {/* Left YAxis: Counts */}
              <YAxis
                yAxisId="left"
                stroke="#78716c"
                tick={{ fill: '#a8a29e', fontSize: 11 }}
                tickLine={{ stroke: '#44403c' }}
                tickFormatter={(v) => `${v} leads`}
              />
              {/* Right YAxis: Conversion Rate % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                domain={[0, 100]}
                tick={{ fill: '#f59e0b', fontSize: 11 }}
                tickLine={{ stroke: '#b45309' }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<LuxuryChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '15px' }}
                formatter={(value) => <span className="text-xs text-stone-300 font-medium">{value}</span>}
              />
              <Bar
                yAxisId="left"
                dataKey="inquiries"
                name="Inquiries Generated"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="trialsBooked"
                name="Trials & Consults Conducted"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="convertedBookings"
                name="Confirmed Paid Bookings"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                name="Conversion Rate (%)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Funnel Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Total Inquiries</span>
            <span className="font-mono text-xl font-bold text-stone-200 mt-1 block">
              {totalQuarterInquiries} Inquiries
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">WhatsApp & Lookbook direct</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Studio Trials</span>
            <span className="font-mono text-xl font-bold text-cyan-400 mt-1 block">
              157 Sessions
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">69.8% trial consultation rate</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Locked Bookings</span>
            <span className="font-mono text-xl font-bold text-emerald-400 mt-1 block">
              {totalQuarterConversions} Brides
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5 block">Advance tokens deposited</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Top Converting Channel</span>
            <span className="font-serif-luxury text-base font-bold text-amber-300 mt-1 block">
              WhatsApp Consult
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5 block font-mono">74% conversion efficiency</span>
          </div>
        </div>
      </div>

    </div>
  );
};

// Also export a compact Recharts mini-chart for embedding directly into the Financials tab
export const QuarterlyRevenueMiniChart: React.FC<{
  bookings: Booking[];
  onExpandAnalytics?: () => void;
}> = ({ bookings, onExpandAnalytics }) => {
  const miniData = [
    { month: 'Aug', revenue: 168000, advance: 114000 },
    { month: 'Sep', revenue: 226000, advance: 168000 },
    { month: 'Oct', revenue: 298000, advance: 215000 },
    { month: 'Nov', revenue: 385000, advance: 275000 }
  ];

  return (
    <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Quarterly Revenue Trend (Aug – Nov)
          </h4>
        </div>
        {onExpandAnalytics && (
          <button
            onClick={onExpandAnalytics}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
          >
            <span>Open Recharts Intelligence</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="w-full h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={miniData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="miniRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis dataKey="month" stroke="#78716c" tick={{ fill: '#a8a29e', fontSize: 10 }} />
            <YAxis stroke="#78716c" tick={{ fill: '#a8a29e', fontSize: 9 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip content={<LuxuryChartTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Monthly Revenue"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#miniRev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================================================
// 6-MONTH BOOKING REVENUE RECHARTS BAR CHART (Financial Overview Tab Component)
// ============================================================================
export const SixMonthBookingRevenueBarChart: React.FC<{
  bookings: Booking[];
  onExpandAnalytics?: () => void;
}> = ({ bookings, onExpandAnalytics }) => {
  const [chartMode, setChartMode] = useState<'grouped' | 'stacked'>('grouped');

  // Compute live aggregates from context bookings
  const liveBookingRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (b.paymentStatus === 'fully_paid' ? b.totalAmount : b.advancePaid), 0);
  }, [bookings]);

  const liveAdvance = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  }, [bookings]);

  const liveDue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.balanceDue, 0);
  }, [bookings]);

  // Last 6 Months (June 2026 to November 2026)
  const sixMonthData = useMemo(() => [
    {
      month: 'June 2026',
      shortMonth: 'Jun',
      revenue: 112000,
      advance: 82000,
      balanceDue: 30000,
      brides: 7,
      growth: '+12%'
    },
    {
      month: 'July 2026',
      shortMonth: 'Jul',
      revenue: 145000,
      advance: 105000,
      balanceDue: 40000,
      brides: 9,
      growth: '+29%'
    },
    {
      month: 'August 2026',
      shortMonth: 'Aug',
      revenue: 168000,
      advance: 114000,
      balanceDue: 54000,
      brides: 11,
      growth: '+16%'
    },
    {
      month: 'September 2026',
      shortMonth: 'Sep',
      revenue: 226000,
      advance: 168000,
      balanceDue: 58000,
      brides: 15,
      growth: '+34%'
    },
    {
      month: 'October 2026',
      shortMonth: 'Oct (Current)',
      revenue: 298000 + Math.max(0, liveBookingRevenue - 50000),
      advance: 215000 + Math.max(0, liveAdvance - 30000),
      balanceDue: 83000 + liveDue,
      brides: 18 + bookings.length,
      growth: '+32%'
    },
    {
      month: 'November 2026',
      shortMonth: 'Nov (Wedding Peak)',
      revenue: 385000,
      advance: 275000,
      balanceDue: 110000,
      brides: 24,
      growth: '+29%'
    }
  ], [liveBookingRevenue, liveAdvance, liveDue, bookings.length]);

  const totalSixMonthRevenue = useMemo(() => {
    return sixMonthData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [sixMonthData]);

  const totalSixMonthAdvance = useMemo(() => {
    return sixMonthData.reduce((acc, curr) => acc + curr.advance, 0);
  }, [sixMonthData]);

  const avgMonthlyRev = Math.round(totalSixMonthRevenue / 6);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Monthly Booking Revenue (Last 6 Months: Jun – Nov 2026)
            </h3>
            <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              Recharts Bar Chart
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Visualizing appointment earnings, advance tokens deposited, and remaining wedding day balances.
          </p>
        </div>

        {/* View Controls & Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-[11px]">
            <button
              type="button"
              onClick={() => setChartMode('grouped')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                chartMode === 'grouped' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Grouped Bars
            </button>
            <button
              type="button"
              onClick={() => setChartMode('stacked')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                chartMode === 'stacked' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Stacked Bars
            </button>
          </div>

          {onExpandAnalytics && (
            <button
              type="button"
              onClick={onExpandAnalytics}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs flex items-center gap-1 border border-stone-700 transition-colors cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* 6-Month Key Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">6-Month Total Revenue</span>
          <span className="font-mono text-xl font-bold text-amber-300 tabular-nums block mt-0.5">
            ₹{totalSixMonthRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
            <TrendingUp className="w-3 h-3" /> +243% Wedding Season Growth
          </span>
        </div>

        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Average Monthly Run-Rate</span>
          <span className="font-mono text-xl font-bold text-white tabular-nums block mt-0.5">
            ₹{avgMonthlyRev.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Consistent positive cashflow</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Total Advance Secured</span>
          <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums block mt-0.5">
            ₹{totalSixMonthAdvance.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">71.8% upfront token ratio</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Peak Wedding Demand</span>
          <span className="font-mono text-xl font-bold text-rose-300 tabular-nums block mt-0.5">
            ₹3,85,000
          </span>
          <span className="text-[10px] text-amber-300 block mt-0.5">November Pheras & Sangeet rush</span>
        </div>
      </div>

      {/* Main Recharts Bar Chart */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sixMonthData}
            margin={{ top: 20, right: 15, left: -10, bottom: 5 }}
            barGap={4}
          >
            <defs>
              <linearGradient id="revenueGoldBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                <stop offset="100%" stopColor="#b45309" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="advanceGreenBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                <stop offset="100%" stopColor="#047857" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="balanceDueBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                <stop offset="100%" stopColor="#be123c" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis
              dataKey="shortMonth"
              stroke="#78716c"
              tick={{ fill: '#d6d3d1', fontSize: 11, fontWeight: 500 }}
              tickLine={{ stroke: '#44403c' }}
            />
            <YAxis
              stroke="#78716c"
              tick={{ fill: '#a8a29e', fontSize: 10 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
              tickLine={{ stroke: '#44403c' }}
            />
            <Tooltip content={<LuxuryChartTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
              formatter={(val) => <span className="text-stone-300 font-medium">{val}</span>}
            />
            <Bar
              dataKey="revenue"
              name="Total Booking Revenue (₹)"
              fill="url(#revenueGoldBar)"
              radius={chartMode === 'grouped' ? [6, 6, 0, 0] : [0, 0, 0, 0]}
              stackId={chartMode === 'stacked' ? 'a' : undefined}
            />
            <Bar
              dataKey="advance"
              name="Advance Collected (₹)"
              fill="url(#advanceGreenBar)"
              radius={chartMode === 'grouped' ? [6, 6, 0, 0] : [0, 0, 0, 0]}
              stackId={chartMode === 'stacked' ? 'b' : undefined}
            />
            <Bar
              dataKey="balanceDue"
              name="Balance Due on Event (₹)"
              fill="url(#balanceDueBar)"
              radius={[6, 6, 0, 0]}
              stackId={chartMode === 'stacked' ? 'b' : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Month-by-month scroller cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 border-t border-stone-800/80">
        {sixMonthData.map((item, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">{item.shortMonth}</span>
            <span className="text-xs font-mono font-bold text-amber-300 block mt-0.5">
              ₹{(item.revenue / 1000).toFixed(0)}k
            </span>
            <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">
              {item.brides} Brides ({item.growth})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
