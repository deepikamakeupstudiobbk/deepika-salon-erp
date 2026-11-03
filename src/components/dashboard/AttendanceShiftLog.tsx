import React, { useState, useMemo } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ShiftAttendanceRecord, Employee } from '../../types';
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  FileSpreadsheet,
  Download,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Filter,
  Sparkles,
  MapPin,
  Shield,
  Activity
} from 'lucide-react';

interface AttendanceShiftLogProps {
  isOwner: boolean;
  currentEmployee?: Employee | null;
}

export const AttendanceShiftLog: React.FC<AttendanceShiftLogProps> = ({
  isOwner,
  currentEmployee
}) => {
  const {
    employees,
    attendanceRecords,
    clockInEmployee,
    clockOutEmployee,
    toggleEmployeeBreak,
    exportAttendanceCSV,
    showToast
  } = useStudio();

  // Active filter tab: 'all' | 'today' | 'week'
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'all'>('week');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');

  // Clock In Drawer Form State
  const [selectedStaffToClock, setSelectedStaffToClock] = useState<string>(
    currentEmployee?.id || employees[1]?.id || 'emp-2'
  );
  const [dutyStation, setDutyStation] = useState<string>('Main Bridal Artistry Suite');
  const [shiftNotes, setShiftNotes] = useState<string>('');

  // Current date
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filtered attendance records
  const filteredRecords = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];

    return attendanceRecords.filter((rec) => {
      // Period filter
      if (filterPeriod === 'today' && rec.date !== todayStr) return false;
      if (filterPeriod === 'week' && rec.date < sevenDaysStr) return false;

      // Staff filter
      if (selectedStaffFilter !== 'all' && rec.employeeId !== selectedStaffFilter) return false;

      return true;
    });
  }, [attendanceRecords, filterPeriod, selectedStaffFilter, todayStr]);

  // Current active shift for logged in employee or selected staff
  const staffToCheckId = isOwner ? selectedStaffToClock : (currentEmployee?.id || 'emp-2');
  const activeShift = useMemo(() => {
    return attendanceRecords.find(
      r => r.employeeId === staffToCheckId && r.date === todayStr && r.status !== 'clocked_out'
    );
  }, [attendanceRecords, staffToCheckId, todayStr]);

  // Total active staff clocked in right now
  const currentlyOnShiftCount = useMemo(() => {
    return attendanceRecords.filter(r => r.date === todayStr && r.status === 'clocked_in').length;
  }, [attendanceRecords, todayStr]);

  const currentlyOnBreakCount = useMemo(() => {
    return attendanceRecords.filter(r => r.date === todayStr && r.status === 'on_break').length;
  }, [attendanceRecords, todayStr]);

  // Total hours logged this week across team
  const totalWeeklyHours = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];

    return attendanceRecords
      .filter(r => r.date >= sevenDaysStr)
      .reduce((sum, r) => sum + (r.totalHours || (r.status === 'clocked_out' ? 8.0 : 4.0)), 0);
  }, [attendanceRecords]);

  const handleClockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clockInEmployee(selectedStaffToClock, dutyStation, shiftNotes);
    setShiftNotes('');
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
      
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Staff Attendance & Daily Shift Log
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold px-2 py-0.5 rounded uppercase">
              RBAC Time Tracking
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Real-time biometric shift tracking, break logging, and automated weekly attendance payroll reporting.
          </p>
        </div>

        {/* Action: Export Weekly CSV Report */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => exportAttendanceCSV(filterPeriod === 'week')}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            title="Download weekly staff attendance report as Excel/Sheets CSV summary"
          >
            <FileSpreadsheet className="w-4 h-4 text-stone-950" />
            <span>Export Weekly Attendance (CSV)</span>
            <span className="px-1.5 py-0.2 rounded bg-stone-950/20 text-[10px] font-mono">
              {filteredRecords.length}
            </span>
          </button>
        </div>
      </div>

      {/* Metric Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">Currently On Shift</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <span className="font-mono text-2xl font-bold text-emerald-400 block mt-1">
            {currentlyOnShiftCount} Active
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Studio Artists & Couturiers</span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">On Break</span>
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-mono text-2xl font-bold text-amber-300 block mt-1">
            {currentlyOnBreakCount} Staff
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Tea / Lunch Break</span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">Weekly Shift Hours</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-mono text-2xl font-bold text-white block mt-1">
            {Math.round(totalWeeklyHours)} hrs
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Completed shifts (last 7 days)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">Reporting Period</span>
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <span className="font-mono text-sm font-bold text-stone-200 block mt-1">
            {todayStr}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Today (Live Sync)</span>
        </div>
      </div>

      {/* Interactive Clock-In / Clock-Out Control Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-stone-950 border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-400/20 text-amber-300">
              <Clock className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {isOwner ? 'Owner Shift Console & Staff Clock-In' : `My Shift Desk: ${currentEmployee?.name || 'Staff'}`}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-amber-400">
            Current Studio Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>

        {/* If Active Shift exists */}
        {activeShift ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 border border-emerald-500/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <strong className="text-white text-sm font-bold">
                  {activeShift.employeeName} ({activeShift.role})
                </strong>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  activeShift.status === 'on_break'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {activeShift.status === 'on_break' ? 'On Break ⏸' : 'Active On Shift ●'}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Clocked in at <strong className="text-amber-300 font-mono">{activeShift.clockInTime}</strong> · Duty Station: <strong className="text-white">{activeShift.stationOrDuty}</strong>
              </p>
              {activeShift.notes && (
                <p className="text-[11px] text-stone-400 italic">
                  Notes: "{activeShift.notes}"
                </p>
              )}
            </div>

            {/* Actions: Break & Clock Out */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleEmployeeBreak(activeShift.id)}
                className="px-3 py-2 rounded-lg bg-stone-850 hover:bg-stone-800 text-amber-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{activeShift.status === 'on_break' ? 'Resume Shift' : 'Take Break'}</span>
              </button>

              <button
                type="button"
                onClick={() => clockOutEmployee(activeShift.id)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Clock Out & End Shift</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form to Clock In */
          <form onSubmit={handleClockInSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {isOwner && (
              <div>
                <label className="text-[11px] text-stone-300 block mb-1">Select Employee *</label>
                <select
                  value={selectedStaffToClock}
                  onChange={(e) => setSelectedStaffToClock(e.target.value)}
                  className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-[11px] text-stone-300 block mb-1">Duty Station / Floor *</label>
              <select
                value={dutyStation}
                onChange={(e) => setDutyStation(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Main Bridal Artistry Suite">Main Bridal Artistry Suite</option>
                <option value="Bridal Station 2 (HD Base)">Bridal Station 2 (HD Base)</option>
                <option value="Hair Couture & Saree Draping Bar">Hair Couture & Saree Draping Bar</option>
                <option value="Aesthetics & Hydra-facial Suite">Aesthetics & Hydra-facial Suite</option>
                <option value="Academy Training Floor">Academy Training Floor</option>
                <option value="On-Location Wedding Venue">On-Location Wedding Venue</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-stone-300 block mb-1">Shift Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Assigned to Shalini bridal makeover"
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold uppercase tracking-wider text-xs shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-stone-950" />
                <span>Clock In For Shift</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter and Search Bar for Shift Logs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-[11px]">
          <button
            type="button"
            onClick={() => setFilterPeriod('today')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              filterPeriod === 'today' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Today's Shifts
          </button>
          <button
            type="button"
            onClick={() => setFilterPeriod('week')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              filterPeriod === 'week' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Weekly Summary (Last 7 Days)
          </button>
          <button
            type="button"
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              filterPeriod === 'all' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            All Logs
          </button>
        </div>

        {/* Filter by Staff Member */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Stylists & Artists</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="border border-stone-800 rounded-xl overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] font-mono border-b border-stone-800">
              <tr>
                <th className="p-3">Shift Date</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Duty Station</th>
                <th className="p-3">Clock In</th>
                <th className="p-3">Clock Out</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Status</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-stone-500 italic">
                    No attendance records found for this period.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-stone-850/40 transition-colors">
                    <td className="p-3 font-mono text-stone-300 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      {rec.employeeName}
                    </td>
                    <td className="p-3 text-stone-400 text-[11px] whitespace-nowrap">
                      {rec.role}
                    </td>
                    <td className="p-3 text-amber-200/90 text-[11px] whitespace-nowrap">
                      {rec.stationOrDuty}
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-semibold whitespace-nowrap">
                      {rec.clockInTime}
                    </td>
                    <td className="p-3 font-mono text-stone-300 whitespace-nowrap">
                      {rec.clockOutTime || (
                        <span className="text-amber-400 text-[11px] italic">Active on Shift</span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                      {rec.totalHours ? `${rec.totalHours} hrs` : (rec.status === 'clocked_out' ? '8.0 hrs' : 'In Progress')}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        rec.status === 'clocked_in'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : rec.status === 'on_break'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}>
                        {rec.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-stone-400 max-w-xs truncate">
                      {rec.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
