import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Calendar,
  Percent,
  BarChart3
} from 'lucide-react';
import { Booking, Lead, ServiceItem } from '../../types';

interface FinancialAnalyticsWidgetProps {
  bookings: Booking[];
  leads: Lead[];
  onNavigateToTab?: (tab: string) => void;
}

interface MonthlyDataPoint {
  month: string;
  shortMonth: string;
  revenue: number;
  advanceSecured: number;
  balanceDue: number;
  inquiries: number;
  confirmedBookings: number;
  conversionRate: number; // percentage
  topService: string;
}

export const FinancialAnalyticsWidget: React.FC<FinancialAnalyticsWidgetProps> = ({
  bookings,
  leads,
  onNavigateToTab
}) => {
  // Chart metric visibility toggles
  const [showRevenueLine, setShowRevenueLine] = useState(true);
  const [showAdvanceLine, setShowAdvanceLine] = useState(true);
  const [showConversionLine, setShowConversionLine] = useState(true);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

  // Live dynamic revenue calculation from bookings
  const liveBookingRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + (b.paymentStatus === 'fully_paid' ? b.totalAmount : b.advancePaid), 0);
  }, [bookings]);

  const liveAdvance = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  }, [bookings]);

  const liveDue = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.balanceDue, 0);
  }, [bookings]);

  // 6-Month monthly revenue & conversion data points
  const monthlyData: MonthlyDataPoint[] = useMemo(() => {
    const currentMonthRevenue = 298000 + Math.max(0, liveBookingRevenue - 50000);
    const currentMonthAdvance = 215000 + Math.max(0, liveAdvance - 30000);
    const currentMonthDue = 83000 + liveDue;
    const currentInquiries = 24 + leads.length;
    const currentConfirmed = 18 + bookings.length;
    const currentConversionRate = Math.round((currentConfirmed / currentInquiries) * 100);

    return [
      {
        month: 'June 2026',
        shortMonth: 'Jun',
        revenue: 115000,
        advanceSecured: 80000,
        balanceDue: 35000,
        inquiries: 36,
        confirmedBookings: 8,
        conversionRate: 22,
        topService: 'Signature HD Bridal'
      },
      {
        month: 'July 2026',
        shortMonth: 'Jul',
        revenue: 142000,
        advanceSecured: 102000,
        balanceDue: 40000,
        inquiries: 38,
        confirmedBookings: 10,
        conversionRate: 26,
        topService: 'Royale 4K Airbrush'
      },
      {
        month: 'August 2026',
        shortMonth: 'Aug',
        revenue: 185000,
        advanceSecured: 135000,
        balanceDue: 50000,
        inquiries: 40,
        confirmedBookings: 12,
        conversionRate: 30,
        topService: 'Signature HD Bridal'
      },
      {
        month: 'September 2026',
        shortMonth: 'Sep',
        revenue: 226000,
        advanceSecured: 168000,
        balanceDue: 58000,
        inquiries: 44,
        confirmedBookings: 15,
        conversionRate: 34,
        topService: 'Royale 4K Airbrush'
      },
      {
        month: 'October 2026',
        shortMonth: 'Oct (Current)',
        revenue: currentMonthRevenue,
        advanceSecured: currentMonthAdvance,
        balanceDue: currentMonthDue,
        inquiries: currentInquiries,
        confirmedBookings: currentConfirmed,
        conversionRate: Math.min(65, Math.max(32, currentConversionRate)),
        topService: 'Signature HD Bridal'
      },
      {
        month: 'November 2026',
        shortMonth: 'Nov (Peak)',
        revenue: 385000,
        advanceSecured: 275000,
        balanceDue: 110000,
        inquiries: 54,
        confirmedBookings: 24,
        conversionRate: 44,
        topService: 'Royale 4K Airbrush'
      }
    ];
  }, [liveBookingRevenue, liveAdvance, liveDue, leads.length, bookings.length]);

  // Aggregate metrics
  const totalPeriodRevenue = useMemo(() => {
    return monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  }, [monthlyData]);

  const avgMonthlyRevenue = Math.round(totalPeriodRevenue / monthlyData.length);

  const avgConversionRate = Math.round(
    monthlyData.reduce((sum, m) => sum + m.conversionRate, 0) / monthlyData.length
  );

  // Top-selling services breakdown
  const topServices = useMemo(() => {
    const serviceMap: Record<string, { title: string; count: number; totalRevenue: number; avgTicket: number }> = {};

    // Standard initial volume + dynamic bookings
    const baseServices = [
      { id: 'srv-1', title: 'Signature HD Bridal Makeover', baseCount: 22, baseRevenue: 462000, price: 21000 },
      { id: 'srv-2', title: 'Royale 4K Airbrush Bridal Masterpiece', baseCount: 14, baseRevenue: 434000, price: 31000 },
      { id: 'srv-3', title: 'Couture Reception & Sangeet Glam', baseCount: 12, baseRevenue: 192000, price: 16000 },
      { id: 'srv-4', title: 'Dewy Pastel Haldi & Mehendi Look', baseCount: 9, baseRevenue: 108000, price: 12000 },
      { id: 'srv-6', title: 'Pre-Bridal 7-Day Radiance Ritual', baseCount: 6, baseRevenue: 108000, price: 18000 }
    ];

    baseServices.forEach(s => {
      serviceMap[s.title] = {
        title: s.title,
        count: s.baseCount,
        totalRevenue: s.baseRevenue,
        avgTicket: s.price
      };
    });

    // Add live bookings
    bookings.forEach(b => {
      if (serviceMap[b.serviceName]) {
        serviceMap[b.serviceName].count += 1;
        serviceMap[b.serviceName].totalRevenue += b.totalAmount;
      } else {
        serviceMap[b.serviceName] = {
          title: b.serviceName,
          count: 1,
          totalRevenue: b.totalAmount,
          avgTicket: b.totalAmount
        };
      }
    });

    const list = Object.values(serviceMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
    const sumAll = list.reduce((acc, curr) => acc + curr.totalRevenue, 0);

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      sharePct: sumAll > 0 ? Math.round((item.totalRevenue / sumAll) * 100) : 0
    }));
  }, [bookings]);

  // Luxury Custom Tooltip for Recharts Line Chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyDataPoint = payload[0].payload;
      return (
        <div className="bg-stone-900/95 border border-amber-500/40 p-4 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <span className="font-serif-luxury font-bold text-amber-300 text-sm">
              {data.month}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
              {data.conversionRate}% Conversion
            </span>
          </div>

          <div className="space-y-1 pt-1 text-[11px] font-mono">
            <div className="flex justify-between items-center text-amber-300 font-bold">
              <span>Total Revenue:</span>
              <span>₹{data.revenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400">
              <span>Advance Secured:</span>
              <span>₹{data.advanceSecured.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-stone-400">
              <span>Remaining Balance:</span>
              <span>₹{data.balanceDue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-purple-300 border-t border-stone-800/80 pt-1">
              <span>Lead Conversion:</span>
              <span>{data.confirmedBookings} of {data.inquiries} leads</span>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>Top Performer:</span>
              <span className="font-sans font-medium text-amber-200">{data.topService}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <BarChart3 className="w-4 h-4" />
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Financial & Sales Conversion Analytics
            </h3>
            <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
              Recharts Line Widget
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Tracking monthly booking revenue, lead conversion rates, and revenue contributions of top-selling bridal services.
          </p>
        </div>

        {/* Interactive Line Toggles */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-[11px]">
          <button
            type="button"
            onClick={() => setShowRevenueLine(!showRevenueLine)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 font-medium ${
              showRevenueLine
                ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold shadow'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Gross Revenue</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAdvanceLine(!showAdvanceLine)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 font-medium ${
              showAdvanceLine
                ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-bold shadow'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Advance Tokens</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConversionLine(!showConversionLine)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 font-medium ${
              showConversionLine
                ? 'bg-purple-500 text-white border-purple-400 font-bold shadow'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Conversion Rate %</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">6-Month Total Revenue</span>
          <span className="font-mono text-xl font-bold text-amber-300 block mt-1">
            ₹{totalPeriodRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +235% Wedding Season Surge
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">Average Run-Rate</span>
          <span className="font-mono text-xl font-bold text-white block mt-1">
            ₹{avgMonthlyRevenue.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Consistent cashflow velocity</span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <span className="text-[10px] uppercase font-mono text-purple-300 font-semibold block">Average Lead Conversion</span>
          <span className="font-mono text-xl font-bold text-purple-300 block mt-1">
            {avgConversionRate}%
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Peak at 44% in November</span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">Top Revenue Engine</span>
          <span className="font-serif-luxury text-sm font-bold text-amber-200 block mt-1 truncate">
            {topServices[0]?.title}
          </span>
          <span className="text-[10px] text-amber-400 block mt-0.5">
            {topServices[0]?.sharePct}% of total appointment sales
          </span>
        </div>
      </div>

      {/* Main Recharts Line Chart */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyData}
            margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis
              dataKey="shortMonth"
              stroke="#78716c"
              tick={{ fill: '#d6d3d1', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#44403c' }}
            />
            {/* Left Y-Axis for Revenue (₹) */}
            <YAxis
              yAxisId="left"
              stroke="#78716c"
              tick={{ fill: '#a8a29e', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              axisLine={{ stroke: '#44403c' }}
            />
            {/* Right Y-Axis for Conversion Rate (%) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 60]}
              stroke="#c084fc"
              tick={{ fill: '#c084fc', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => `${val}%`}
              axisLine={{ stroke: '#581c87' }}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
              formatter={(value) => <span className="text-stone-300 font-sans text-xs">{value}</span>}
            />

            {/* Line 1: Gross Monthly Revenue */}
            {showRevenueLine && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Gross Monthly Revenue (₹)"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 4, fill: '#fbbf24', stroke: '#1c1917', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
              />
            )}

            {/* Line 2: Advance Token Secured */}
            {showAdvanceLine && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="advanceSecured"
                name="Advance Tokens Secured (₹)"
                stroke="#34d399"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#34d399', stroke: '#1c1917', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
              />
            )}

            {/* Line 3: Conversion Rate % */}
            {showConversionLine && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                name="Lead-to-Booking Conversion Rate (%)"
                stroke="#c084fc"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#c084fc', stroke: '#1c1917', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#a855f7', stroke: '#fff' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top-Selling Services Breakdown Table & Progress Bars */}
      <div className="space-y-4 pt-3 border-t border-stone-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h4 className="font-serif-luxury text-base font-bold text-white">
              Top-Selling Bridal Services & Package Contribution
            </h4>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Ranked by total booking revenue
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {topServices.map((srv) => (
            <div
              key={srv.title}
              className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    srv.rank === 1
                      ? 'bg-amber-400 text-stone-950'
                      : srv.rank === 2
                      ? 'bg-stone-300 text-stone-950'
                      : 'bg-stone-800 text-stone-300'
                  }`}>
                    #{srv.rank}
                  </span>
                  <strong className="text-white text-xs truncate max-w-[220px]">
                    {srv.title}
                  </strong>
                </div>

                <div className="text-right font-mono">
                  <span className="text-amber-300 font-bold block text-sm">
                    ₹{srv.totalRevenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {srv.count} Brides
                  </span>
                </div>
              </div>

              {/* Progress Bar for Revenue Share */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>Revenue Contribution</span>
                  <strong className="text-emerald-400">{srv.sharePct}% of Total</strong>
                </div>
                <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${srv.sharePct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
