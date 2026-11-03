import React, { useState, useMemo } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  X,
  Shield,
  ShieldAlert,
  Users,
  Calendar,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Cloud,
  FileSpreadsheet,
  Download,
  Trash2,
  Plus,
  Phone,
  Mail,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  EyeOff,
  Image,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Sliders,
  Receipt,
  LogOut,
  KeyRound,
  UserCheck,
  UserPlus,
  Building2,
  Check,
  Printer,
  FileText,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Booking, Employee, ClientProfile, FinancialExpense, Lead, PartPayment, PaymentMethod } from '../../types';
import { STUDIO_INFO, STUDIO_LOGO } from '../../data/initialData';
import { QuarterlyAnalytics, QuarterlyRevenueMiniChart, SixMonthBookingRevenueBarChart } from './QuarterlyAnalytics';
import { LeadsFunnelChart } from './LeadsFunnelChart';

export const ERPModal: React.FC = () => {
  const {
    isERPModalOpen,
    closeERPModal,
    openBookingModal,
    session,
    ownerCredentials,
    loginAsOwner,
    loginAsEmployee,
    logoutToGuest,
    updateOwnerCredentials,
    updateEmployeeCredentials,
    bookings,
    deleteBooking,
    updateBookingStatus,
    markBookingBalancePaid,
    addPartPayment,
    leads,
    updateLeadStatus,
    employees,
    addEmployee,
    deleteEmployee,
    updateEmployeePermissions,
    updateEmployeeDetails,
    clients,
    addClientPhoto,
    deleteClientPhoto,
    updateClientNotes,
    expenses,
    addExpense,
    deleteExpense,
    gdriveSync,
    triggerGDriveSync,
    exportBackupJSON,
    exportClientReportCSV,
    exportLeadsReportCSV,
    showToast
  } = useStudio();

  // ERP Login Gateway State (when session.role === 'client')
  const [loginRole, setLoginRole] = useState<'owner' | 'employee'>('owner');
  const [ownerUsername, setOwnerUsername] = useState('admin');
  const [ownerPassword, setOwnerPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Employee Login State
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employees[1]?.id || 'emp-2');
  const [employeePassword, setEmployeePassword] = useState('');
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ERP Dashboard State (once authenticated)
  const isOwner = session.role === 'owner';
  const isEmployee = session.role === 'employee';
  const isAuthenticated = isOwner || isEmployee;
  const currentStaff = isEmployee ? employees.find(e => e.id === session.employeeId) : null;

  // Active Tab: 'financials' | 'bookings' | 'leads' | 'clients' | 'employees' | 'cloud_backup'
  const [activeTab, setActiveTab] = useState<string>('financials');

  // Search & Filter state for Bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);

  // Leads CRM search & filter
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');

  // Client CRM search & filter
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients[0]?.id || null);

  // New Client Photo State (Owner Only)
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('Final Bridal Look');

  // New Expense State (Owner Only)
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<FinancialExpense['category']>('cosmetics_purchase');
  const [expenseVendor, setExpenseVendor] = useState('Nykaa Pro / Authorized Distributor');
  const [expenseMethod, setExpenseMethod] = useState('Corporate Card');

  // Part-wise Payment System States (matching indianengdks.github.io/erp concept)
  const [selectedBookingForParts, setSelectedBookingForParts] = useState<Booking | null>(null);
  const [newPartTitle, setNewPartTitle] = useState('Part 2: Pre-wedding / Trial Installment');
  const [newPartAmount, setNewPartAmount] = useState('');
  const [newPartDate, setNewPartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newPartMethod, setNewPartMethod] = useState<PaymentMethod>('upi');
  const [newPartTransId, setNewPartTransId] = useState('');
  const [newPartReceivedBy, setNewPartReceivedBy] = useState('Deepika Sharma (Owner)');
  const [newPartNotes, setNewPartNotes] = useState('');
  const [receiptVoucherBooking, setReceiptVoucherBooking] = useState<Booking | null>(null);
  const [receiptVoucherPart, setReceiptVoucherPart] = useState<PartPayment | null>(null);

  // User ID & Password Management States (Owner Only)
  const [editOwnerUsername, setEditOwnerUsername] = useState(ownerCredentials.username);
  const [editOwnerEmail, setEditOwnerEmail] = useState(ownerCredentials.email);
  const [editOwnerPassword, setEditOwnerPassword] = useState(ownerCredentials.password);
  const [editOwnerConfirmPassword, setEditOwnerConfirmPassword] = useState(ownerCredentials.password);
  const [selectedEmpForEdit, setSelectedEmpForEdit] = useState<Employee | null>(null);
  const [editEmpEmail, setEditEmpEmail] = useState('');
  const [editEmpPassword, setEditEmpPassword] = useState('');
  const [editEmpConfirmPassword, setEditEmpConfirmPassword] = useState('');

  // New Staff Management State (Owner Only)
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Senior Bridal Makeup & Hair Artist');
  const [newStaffPhone, setNewStaffPhone] = useState('+91 95804 94058');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('staff@123');
  const [newStaffConfirmPassword, setNewStaffConfirmPassword] = useState('staff@123');
  const [showNewStaffPassword, setShowNewStaffPassword] = useState(false);
  const [showNewStaffConfirmPassword, setShowNewStaffConfirmPassword] = useState(false);
  const [newStaffSpecialty, setNewStaffSpecialty] = useState('HD Bridal Base & Dupatta Draping');
  const [newStaffSalary, setNewStaffSalary] = useState('22000');
  const [newStaffCommission, setNewStaffCommission] = useState('10');
  const [revealedPasswordEmpId, setRevealedPasswordEmpId] = useState<string | null>(null);
  const [managingPasswordEmpId, setManagingPasswordEmpId] = useState<string | null>(null);
  const [quickEditPassword, setQuickEditPassword] = useState('');
  const [quickEditConfirmPassword, setQuickEditConfirmPassword] = useState('');
  const [showQuickEditPassword, setShowQuickEditPassword] = useState(false);

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) {
      showToast('Please fill in employee name and phone number.');
      return;
    }
    if (newStaffPassword.trim() !== newStaffConfirmPassword.trim()) {
      showToast('Passwords do not match! Please check Set Password and Confirm Password.');
      return;
    }
    if (!newStaffPassword.trim()) {
      showToast('Please enter a password for the staff member.');
      return;
    }
    const cleanEmail = newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '')}@deepikastudio.in`;
    const cleanPassword = newStaffPassword.trim();
    addEmployee({
      name: newStaffName.trim(),
      role: newStaffRole.trim() || 'Senior Bridal Stylist',
      phone: newStaffPhone.trim(),
      email: cleanEmail,
      avatar: '/src/assets/images/reception_glam_1793361571725.jpg',
      specialty: newStaffSpecialty.trim() || 'Bridal Artistry & Styling',
      monthlySalary: parseFloat(newStaffSalary) || 20000,
      commissionRate: parseFloat(newStaffCommission) || 10,
      assignedBookingsCount: 0,
      socialHandle: '@deepikasharmamakeupstudio',
      instagramUrl: 'https://instagram.com/deepikasharmamakeupstudio',
      active: true,
      pin: cleanPassword,
      password: cleanPassword,
      permissions: {
        canViewClients: true,
        canViewPhones: true,
        canManageBookings: true,
        canAccessERP: false,
        canManagePhotos: false
      }
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPassword('staff@123');
    setNewStaffConfirmPassword('staff@123');
    setIsAddingStaff(false);
    showToast(`Staff member "${newStaffName.trim()}" added with login password "${cleanPassword}"!`);
  };

  // Handle Owner Login
  const handleOwnerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAsOwner(ownerPassword, ownerUsername);
    if (success) {
      setActiveTab('financials');
    } else {
      setLoginError(`Authentication failed. Please verify your Owner Username/Email or Password.`);
    }
  };

  // Handle Employee Login
  const handleEmployeeLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const selectedEmp = employees.find(emp => emp.id === selectedEmployeeId);
    const passToUse = employeePassword.trim() || selectedEmp?.password || selectedEmp?.pin || 'staff@123';
    const success = loginAsEmployee(selectedEmployeeId, passToUse);
    if (success) {
      setActiveTab('bookings');
    } else {
      setLoginError(`Authentication failed for ${selectedEmp?.name || 'staff'}. Check your password or click 'Auto-Fill Password' below.`);
    }
  };

  // Financial Calculations (Owner Metrics)
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'fully_paid' ? b.totalAmount : b.advancePaid), 0);
  const totalAdvanceCollected = bookings.reduce((sum, b) => sum + b.advancePaid, 0);
  const totalBalancePending = bookings.reduce((sum, b) => sum + b.balanceDue, 0);

  // Month-over-Month (MoM) Growth Metric vs Previous Month
  const { currentMonthRevenue, prevMonthRevenue, momGrowthPct, momGrowthDelta } = useMemo(() => {
    // Baseline historical revenue for previous month (September 2026: ₹2,26,000)
    const basePrev = 226000;
    // Current month base (October 2026: ₹2,98,000)
    const baseCurr = 298000;

    // Dynamic booking revenue additions for current month vs previous month
    const liveCurr = bookings
      .filter(b => (b.createdAt && b.createdAt.startsWith('2026-10')) || (b.date && b.date.startsWith('2026-10')))
      .reduce((sum, b) => sum + (b.paymentStatus === 'fully_paid' ? b.totalAmount : b.advancePaid), 0);

    const livePrev = bookings
      .filter(b => (b.createdAt && b.createdAt.startsWith('2026-09')) || (b.date && b.date.startsWith('2026-09')))
      .reduce((sum, b) => sum + (b.paymentStatus === 'fully_paid' ? b.totalAmount : b.advancePaid), 0);

    const curr = baseCurr + liveCurr;
    const prev = basePrev + livePrev;
    const delta = curr - prev;
    const pct = prev > 0 ? (delta / prev) * 100 : 0;

    return {
      currentMonthRevenue: curr,
      prevMonthRevenue: prev,
      momGrowthPct: pct,
      momGrowthDelta: delta
    };
  }, [bookings]);
  
  const totalCosmeticsPurchase = expenses
    .filter(e => e.category === 'cosmetics_purchase' || e.category === 'equipment')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalStaffSalaries = expenses
    .filter(e => e.category === 'salary')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalStudioRentAndBills = expenses
    .filter(e => e.category === 'studio_rent' || e.category === 'utilities' || e.category === 'marketing')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpensesAll = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netMonthlyProfit = totalRevenue - totalExpensesAll;

  // Regular Customers vs First-Time
  const regularCustomersCount = clients.filter(c => c.clientType === 'regular_vip' || c.totalBookings > 1).length;
  const totalClientsCount = clients.length;
  const regularClientRatio = totalClientsCount > 0 ? Math.round((regularCustomersCount / totalClientsCount) * 100) : 0;

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                          b.artistName.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === 'all' || b.bookingStatus === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    addExpense({
      date: new Date().toISOString().split('T')[0],
      category: expenseCategory,
      title: expenseTitle,
      amount: parseFloat(expenseAmount),
      vendorOrStaff: expenseVendor,
      paymentMethod: expenseMethod
    });
    setExpenseTitle('');
    setExpenseAmount('');
    setIsAddingExpense(false);
  };

  const handleUploadPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newPhotoUrl || !newPhotoTitle) return;
    addClientPhoto(selectedClient.id, {
      url: newPhotoUrl,
      title: newPhotoTitle,
      category: newPhotoCategory,
      date: new Date().toISOString().split('T')[0],
      verifiedConsent: true
    });
    setNewPhotoUrl('');
    setNewPhotoTitle('');
  };

  if (!isERPModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* 1. SECURE ERP LOGIN SCREEN (Matching indianengdks.github.io/erp concept) */}
      {!isAuthenticated ? (
        <div className="relative w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-800 text-center relative">
            <button
              onClick={closeERPModal}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800/60 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 mx-auto mb-3 shadow-xl bg-stone-900">
              <img src={STUDIO_LOGO} alt="Deepika Sharma Monogram Logo" className="w-full h-full object-cover" />
            </div>

            <h2 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
              {STUDIO_INFO.shortName}
            </h2>
            <p className="text-xs text-amber-300 uppercase tracking-widest font-medium mt-0.5">
              Enterprise Salon ERP Portal
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              {STUDIO_INFO.landmark}, {STUDIO_INFO.city}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-stone-900 border-b border-stone-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setLoginRole('owner'); setLoginError(''); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                loginRole === 'owner'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Studio Owner (Admin)</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginRole('employee'); setLoginError(''); }}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                loginRole === 'employee'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Staff Employee</span>
            </button>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="mx-6 mt-4 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Owner Login Form */}
          {loginRole === 'owner' && (
            <form onSubmit={handleOwnerLoginSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-300">
                  Owner Username / Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={ownerUsername}
                    onChange={(e) => setOwnerUsername(e.target.value)}
                    placeholder="admin or engdksmegasoft@gmail.com"
                    className="w-full pl-9 p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-300">
                  Master Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-amber-400"
                  />
                  <span>Keep signed in</span>
                </label>
                <span className="text-[11px] text-amber-300/80">Full Rights Control</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all"
              >
                Sign In to Owner ERP
              </button>

              <div className="pt-2 border-t border-stone-800/80 text-center">
                <p className="text-[11px] text-stone-400">
                  Quick Access: Owner password is <strong className="text-amber-200">admin</strong> or <strong className="text-amber-200">admin123</strong>
                </p>
              </div>
            </form>
          )}

          {/* Employee Login Form */}
          {loginRole === 'employee' && (() => {
            const currentSelectedStaff = employees.find(e => e.id === selectedEmployeeId) || employees.find(e => e.id !== 'emp-1') || employees[0];
            const activeStaffPassword = currentSelectedStaff?.password || currentSelectedStaff?.pin || 'staff@123';

            return (
              <form onSubmit={handleEmployeeLoginSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-300">
                    Select Your Staff Identity
                  </label>
                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => {
                      setSelectedEmployeeId(e.target.value);
                      setLoginError('');
                    }}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {employees.filter(e => e.id !== 'emp-1').map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-stone-300">
                      Staff Login Password
                    </label>
                    {currentSelectedStaff && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmployeePassword(activeStaffPassword);
                          setLoginError('');
                        }}
                        className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold underline cursor-pointer"
                      >
                        Auto-Fill Password
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type={showEmployeePassword ? 'text' : 'password'}
                      required
                      value={employeePassword}
                      onChange={(e) => setEmployeePassword(e.target.value)}
                      placeholder="Enter staff login password"
                      className="w-full pl-9 pr-9 p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                    >
                      {showEmployeePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Active Staff Credentials Card with One-Click Access */}
                <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="font-semibold text-amber-300 text-[11px] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Configured Staff Credentials</span>
                    </span>
                    <span className="text-[10px] text-stone-400">Direct Staff Access</span>
                  </div>

                  {currentSelectedStaff && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-lg bg-stone-950 border border-stone-800 text-[11px] font-mono">
                      <div>
                        <span className="text-stone-400">Staff: </span>
                        <strong className="text-white font-sans">{currentSelectedStaff.name}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400">Password:</span>
                        <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold">
                          {activeStaffPassword}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmployeePassword(activeStaffPassword);
                            setLoginError('');
                          }}
                          className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-sans font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-1 text-[10px] text-stone-400 space-y-1">
                    <span className="text-stone-500 block">Available Staff Members (Click to select & login):</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {employees.filter(e => e.id !== 'emp-1').map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            setSelectedEmployeeId(emp.id);
                            setEmployeePassword(emp.password || emp.pin || 'staff@123');
                            setLoginError('');
                          }}
                          className={`px-2 py-1 rounded border text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                            emp.id === selectedEmployeeId
                              ? 'border-amber-400 bg-amber-950/50 text-amber-200'
                              : 'border-stone-800 bg-stone-950 hover:border-stone-700 text-stone-300'
                          }`}
                        >
                          <span>{emp.name}:</span>
                          <strong className="text-emerald-400">{emp.password || emp.pin || 'staff@123'}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Log In as Staff Member
                </button>
              </form>
            );
          })()}

        </div>
      ) : (

        /* 2. AUTHENTICATED MASTER SALON ERP DASHBOARD */
        <div className="relative w-full max-w-7xl h-[92vh] bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
          
          {/* Top Header */}
          <div className="px-6 py-4 bg-stone-900 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-400/80 shadow-md shrink-0 bg-stone-900">
                <img src={STUDIO_LOGO} alt="Deepika Sharma Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif-luxury text-xl font-bold text-white leading-none">
                    {STUDIO_INFO.shortName} ERP Management
                  </h2>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    isOwner ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}>
                    {isOwner ? 'Master Owner (Deepika Sharma)' : `Staff Scoped: ${session.name}`}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {STUDIO_INFO.landmark}, {STUDIO_INFO.city} · Contact: {STUDIO_INFO.phone}
                </p>
              </div>
            </div>

            {/* Logout and Close Buttons */}
            <div className="flex items-center gap-3">
              
              <button
                onClick={logoutToGuest}
                className="px-3 py-1.5 text-xs rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-300 text-stone-300 border border-stone-700 hover:border-rose-700/60 flex items-center gap-1.5 transition-colors"
                title="Log out of ERP and return to public website"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={closeERPModal}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800/80 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Navigation Tabs Bar */}
          <div className="px-6 py-2.5 bg-stone-950 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
            
            {/* Owner Only: Financial Overview & Profit Ledger */}
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'financials'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Financial Overview</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1 py-0.5 rounded font-mono font-bold">RECHARTS</span>
              {!isOwner && <Lock className="w-3 h-3 text-rose-400" />}
            </button>

            {/* Visual Analytics & Performance Trends (Recharts) */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Quarterly Analytics & Trends</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1 py-0.5 rounded font-mono font-bold">RECHARTS</span>
            </button>

            {/* Bookings Tracker */}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'bookings'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bookings & Payments ({bookings.length})</span>
            </button>

            {/* CRM Leads */}
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'leads'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Inquiries Pipeline ({leads.length})</span>
            </button>

            {/* Clients CRM & Regular Customers */}
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'clients'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clients & Photo Vault</span>
            </button>

            {/* Team & Staff Permissions (RBAC) */}
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'employees'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff & Access Rights (RBAC)</span>
              {!isOwner && <Lock className="w-3 h-3 text-rose-400" />}
            </button>

            {/* Cloud Storage & Google Drive Sync */}
            <button
              onClick={() => setActiveTab('cloud_backup')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'cloud_backup'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Google Drive & GitHub Vault</span>
              {!isOwner && <Lock className="w-3 h-3 text-rose-400" />}
            </button>

            {/* Owner Security: User ID & Passwords Manager */}
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'credentials'
                  ? 'bg-amber-400 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>User ID & Passwords</span>
              {!isOwner && <Lock className="w-3 h-3 text-rose-400" />}
            </button>

          </div>

          {/* Tab Content Viewport */}
          <div className="flex-1 overflow-y-auto p-6 bg-stone-950 text-stone-100">
            
            {/* TAB 1: FINANCIALS & PROFIT/LOSS LEDGER (Owner Exclusive!) */}
            {activeTab === 'financials' && (
              <div>
                {!isOwner ? (
                  <div className="p-12 text-center space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white">
                      Owner Confidential Module
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Financial profit/loss ledgers, product purchases, and staff payroll are confidential and restricted strictly to Studio Owner Deepika Sharma.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    
                    {/* KPI Financial Metric Strip (6 Columns with MoM Growth) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      
                      {/* Total Bookings Revenue */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                          Total Bookings Revenue
                        </span>
                        <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums block mt-1">
                          ₹{totalRevenue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-500 block mt-1">
                          Advance: ₹{totalAdvanceCollected.toLocaleString('en-IN')} · Due: ₹{totalBalancePending.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* MoM Revenue Growth Summary Card */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-500/40 relative overflow-hidden group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
                            MoM Revenue Growth
                          </span>
                          <span className={`p-1 rounded-md ${momGrowthPct >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {momGrowthPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className={`font-mono text-2xl font-bold tabular-nums ${momGrowthPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {momGrowthPct >= 0 ? `+${momGrowthPct.toFixed(1)}%` : `${momGrowthPct.toFixed(1)}%`}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">MoM</span>
                        </div>
                        <span className="text-[10px] text-stone-400 block mt-1">
                          vs Prev (₹{(prevMonthRevenue / 1000).toFixed(0)}k) · <strong className="text-emerald-300 font-mono font-medium">{momGrowthDelta >= 0 ? `+₹${Math.round(momGrowthDelta).toLocaleString('en-IN')}` : `-₹${Math.abs(Math.round(momGrowthDelta)).toLocaleString('en-IN')}`}</strong>
                        </span>
                      </div>

                      {/* Cosmetic Purchases (MAC, Huda, Dyson) */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                          Cosmetics Purchase
                        </span>
                        <span className="font-mono text-2xl font-bold text-rose-400 tabular-nums block mt-1">
                          ₹{totalCosmeticsPurchase.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-500 block mt-1">
                          Charlotte Tilbury, MAC & Kryolan
                        </span>
                      </div>

                      {/* Staff Salaries */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                          Staff Salary Month
                        </span>
                        <span className="font-mono text-2xl font-bold text-amber-300 tabular-nums block mt-1">
                          ₹{totalStaffSalaries.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-500 block mt-1">
                          4 Staff Members Payroll
                        </span>
                      </div>

                      {/* Studio Overhead & Rent */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
                          Studio Rent & Bills
                        </span>
                        <span className="font-mono text-2xl font-bold text-stone-300 tabular-nums block mt-1">
                          ₹{totalStudioRentAndBills.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-500 block mt-1">
                          Lakhpedabagh Rent + Utilities
                        </span>
                      </div>

                      {/* Net Monthly Profit */}
                      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-stone-900 border border-amber-500/40">
                        <span className="text-[10px] uppercase tracking-wider text-amber-300 block font-bold">
                          Net Monthly Profit
                        </span>
                        <span className={`font-mono text-2xl font-bold tabular-nums block mt-1 ${netMonthlyProfit >= 0 ? 'text-amber-200' : 'text-rose-400'}`}>
                          ₹{netMonthlyProfit.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-amber-400/80 block mt-1">
                          Margin: ~{totalRevenue > 0 ? Math.round((netMonthlyProfit / totalRevenue) * 100) : 0}% Net
                        </span>
                      </div>

                    </div>

                    {/* Six-Month Booking Revenue Bar Chart (Recharts) */}
                    <SixMonthBookingRevenueBarChart
                      bookings={bookings}
                      onExpandAnalytics={() => setActiveTab('analytics')}
                    />

                    {/* Add New Expense Form & Action */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-serif-luxury text-lg font-bold text-white">
                            Purchases & Studio Expense Ledger
                          </h3>
                          <p className="text-xs text-stone-400">
                            Log cosmetic inventory purchases, studio commercial rent, academy supplies, and salary disbursements.
                          </p>
                        </div>

                        <button
                          onClick={() => setIsAddingExpense(!isAddingExpense)}
                          className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Log Purchase / Expense</span>
                        </button>
                      </div>

                      {isAddingExpense && (
                        <form onSubmit={handleAddExpenseSubmit} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="Purchase Description (e.g. Kryolan Derma Color Palette & MAC Fix+)"
                              value={expenseTitle}
                              onChange={(e) => setExpenseTitle(e.target.value)}
                              className="sm:col-span-2 p-2 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                            />
                            <input
                              type="number"
                              required
                              placeholder="Amount in ₹"
                              value={expenseAmount}
                              onChange={(e) => setExpenseAmount(e.target.value)}
                              className="p-2 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs font-mono focus:outline-none focus:border-amber-400"
                            />
                            <select
                              value={expenseCategory}
                              onChange={(e) => setExpenseCategory(e.target.value as any)}
                              className="p-2 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                            >
                              <option value="cosmetics_purchase">Cosmetics Purchase</option>
                              <option value="equipment">Studio Equipment</option>
                              <option value="studio_rent">Studio Rent</option>
                              <option value="salary">Staff Salary</option>
                              <option value="utilities">Electricity & Bills</option>
                              <option value="marketing">Social Marketing</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Vendor (e.g. Nykaa Pro / Sephora)"
                                value={expenseVendor}
                                onChange={(e) => setExpenseVendor(e.target.value)}
                                className="p-1.5 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs w-48"
                              />
                              <input
                                type="text"
                                placeholder="Method (e.g. Corporate Card / UPI)"
                                value={expenseMethod}
                                onChange={(e) => setExpenseMethod(e.target.value)}
                                className="p-1.5 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs w-40"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsAddingExpense(false)}
                                className="px-3 py-1.5 rounded text-xs text-stone-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded text-xs font-semibold"
                              >
                                Save Entry
                              </button>
                            </div>
                          </div>
                        </form>
                      )}

                      {/* Expenses Table */}
                      <div className="overflow-x-auto rounded-xl border border-stone-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                            <tr>
                              <th className="p-3">Date</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Description</th>
                              <th className="p-3">Vendor / Payee</th>
                              <th className="p-3">Payment Method</th>
                              <th className="p-3 text-right">Amount (₹)</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/60 font-sans">
                            {expenses.map((exp) => (
                              <tr key={exp.id} className="hover:bg-stone-900/50">
                                <td className="p-3 font-mono text-stone-400">{exp.date}</td>
                                <td className="p-3">
                                  <span className="text-[10px] font-medium uppercase tracking-wider text-amber-300 bg-stone-950 px-2 py-0.5 rounded">
                                    {exp.category.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="p-3 font-medium text-white">{exp.title}</td>
                                <td className="p-3 text-stone-300">{exp.vendorOrStaff}</td>
                                <td className="p-3 text-stone-400">{exp.paymentMethod}</td>
                                <td className="p-3 text-right font-mono font-bold text-rose-300 tabular-nums">
                                  -₹{exp.amount.toLocaleString('en-IN')}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => deleteExpense(exp.id)}
                                    className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                                    title="Delete Expense"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB: QUARTERLY VISUAL ANALYTICS (RECHARTS) */}
            {activeTab === 'analytics' && (
              <QuarterlyAnalytics
                bookings={bookings}
                leads={leads}
                expenses={expenses}
                clients={clients}
                isOwner={isOwner}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* TAB 2: BOOKINGS & PAYMENTS REGISTRY */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Search by bride name or ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full pl-9 p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openBookingModal('custom_manual')}
                      className="py-2 px-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      title="Create booking with custom package and 3-part installment plan"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ New Booking (Custom / 3-Part Plan)</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-400">Status:</span>
                      <select
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value)}
                        className="p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">All Bookings ({bookings.length})</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                      <tr>
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Bride / Client</th>
                        <th className="p-3">Date & Slot</th>
                        <th className="p-3">Service & Stylist</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Part Payments (Installments)</th>
                        <th className="p-3 text-right">Advance Paid</th>
                        <th className="p-3 text-right">Balance Due</th>
                        <th className="p-3">Booking Status</th>
                        <th className="p-3 text-center">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {filteredBookings.map((bk: Booking) => (
                        <tr key={bk.id} className="hover:bg-stone-900/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-amber-300">
                            {bk.id}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-white block">{bk.clientName}</span>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {isOwner || currentStaff?.permissions?.canViewPhones ? bk.phone : 'Protected (+91 ••••• ••••)'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-stone-300">
                            <div>{bk.date}</div>
                            <div className="text-[11px] text-stone-500">{bk.timeSlot}</div>
                          </td>
                          <td className="p-3">
                            <span className="text-white block font-medium">{bk.serviceName}</span>
                            <span className="text-[11px] text-amber-400">Stylist: {bk.artistName}</span>
                          </td>
                          <td className="p-3 text-stone-300">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                              {bk.locationType}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1 items-start">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {(bk.partPayments || []).map((part, idx) => (
                                  <span
                                    key={part.id || idx}
                                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                      part.status === 'paid'
                                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                                        : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                                    }`}
                                    title={`${part.title}: ₹${part.amount.toLocaleString()} (${part.status}) - Date: ${part.date}`}
                                  >
                                    P{part.partNumber}: ₹{part.amount >= 1000 ? `${(part.amount / 1000).toFixed(0)}k` : part.amount} {part.status === 'paid' ? '✓' : '⏳'}
                                  </span>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBookingForParts(bk);
                                  setNewPartTitle(`Part ${(bk.partPayments?.length || 1) + 1}: Event Settlement`);
                                  setNewPartAmount(bk.balanceDue > 0 ? bk.balanceDue.toString() : '');
                                  setNewPartDate(new Date().toISOString().split('T')[0]);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline mt-0.5"
                              >
                                <Receipt className="w-3 h-3 text-amber-400" />
                                <span>Part-wise Ledger ({bk.partPayments?.length || 1})</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400 tabular-nums">
                            ₹{bk.advancePaid.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right font-mono tabular-nums">
                            {bk.balanceDue > 0 ? (
                              <span className="text-rose-400 font-bold">₹{bk.balanceDue.toLocaleString('en-IN')}</span>
                            ) : (
                              <span className="text-emerald-400">Fully Paid</span>
                            )}
                          </td>
                          <td className="p-3">
                            <select
                              value={bk.bookingStatus}
                              disabled={!isOwner && !currentStaff?.permissions?.canManageBookings}
                              onChange={(e) => updateBookingStatus(bk.id, e.target.value as any)}
                              className="p-1 rounded bg-stone-950 border border-stone-700 text-stone-200 text-[11px] font-medium disabled:opacity-50"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {bk.balanceDue > 0 && (isOwner || currentStaff?.permissions?.canManageBookings) && (
                                <button
                                  type="button"
                                  onClick={() => markBookingBalancePaid(bk.id)}
                                  className="px-2 py-1 text-[10px] font-semibold bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded transition-colors whitespace-nowrap"
                                  title="Mark remaining balance fully received"
                                >
                                  Collect
                                </button>
                              )}
                              {isOwner ? (
                                deletingBookingId === bk.id ? (
                                  <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-rose-500/80 animate-in fade-in">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteBooking(bk.id, true);
                                        setDeletingBookingId(null);
                                      }}
                                      className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingBookingId(null)}
                                      className="px-1.5 py-0.5 text-stone-400 hover:text-white text-[10px] cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setDeletingBookingId(bk.id)}
                                    className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-950/60 rounded-lg border border-transparent hover:border-rose-800/60 transition-colors cursor-pointer"
                                    title="Remove Booking & Payments Record (Owner Only)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )
                              ) : (
                                <span title="Booking removal restricted to Studio Owner" className="p-1 text-stone-600 opacity-40 cursor-not-allowed">
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MODAL: PART-WISE PAYMENT & INSTALLMENT LEDGER (Matching indianengdks.github.io/erp) */}
                {selectedBookingForParts && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                      
                      {/* Header */}
                      <div className="px-6 py-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif-luxury text-lg font-bold text-white">
                                Part-Wise Payment Ledger · Booking #{selectedBookingForParts.id}
                              </h3>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                selectedBookingForParts.paymentStatus === 'fully_paid'
                                  ? 'bg-emerald-400 text-stone-950'
                                  : 'bg-amber-400 text-stone-950'
                              }`}>
                                {selectedBookingForParts.paymentStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-stone-400 mt-0.5">
                              Client: <strong className="text-stone-200">{selectedBookingForParts.clientName}</strong> · Phone: <span className="font-mono">{selectedBookingForParts.phone}</span> · Service: <span className="text-amber-300">{selectedBookingForParts.serviceName}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedBookingForParts(null)}
                          className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Financial Status Banner */}
                      <div className="px-6 py-3 bg-stone-900/40 border-b border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                          <span className="text-[10px] uppercase text-stone-500 block">Total Package Fee</span>
                          <span className="font-mono text-sm font-bold text-white">₹{selectedBookingForParts.totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                          <span className="text-[10px] uppercase text-stone-500 block">Total Collected Parts</span>
                          <span className="font-mono text-sm font-bold text-emerald-400">₹{selectedBookingForParts.advancePaid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                          <span className="text-[10px] uppercase text-stone-500 block">Remaining Due</span>
                          <span className={`font-mono text-sm font-bold ${selectedBookingForParts.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            ₹{selectedBookingForParts.balanceDue.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800">
                          <span className="text-[10px] uppercase text-stone-500 block">Event Date</span>
                          <span className="font-mono text-xs font-semibold text-amber-200">{selectedBookingForParts.date} ({selectedBookingForParts.timeSlot})</span>
                        </div>
                      </div>

                      {/* Content Scroll Area */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* Recorded Installments Table */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                              Part Payment Installment Schedule ({selectedBookingForParts.partPayments?.length || 0} Parts Recorded)
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              Concept: indianengdks.github.io/erp
                            </span>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-900/60">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-stone-950 text-stone-400 border-b border-stone-800">
                                <tr>
                                  <th className="p-2.5">Part #</th>
                                  <th className="p-2.5">Installment Title</th>
                                  <th className="p-2.5">Service</th>
                                  <th className="p-2.5">Payment Date</th>
                                  <th className="p-2.5 text-right">Amount (₹)</th>
                                  <th className="p-2.5">Method</th>
                                  <th className="p-2.5">Txn / Ref ID</th>
                                  <th className="p-2.5">Received By</th>
                                  <th className="p-2.5">Status</th>
                                  <th className="p-2.5 text-center">Receipt</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-800/60 font-sans">
                                {(selectedBookingForParts.partPayments || []).map((part: PartPayment) => (
                                  <tr key={part.id} className="hover:bg-stone-900/80">
                                    <td className="p-2.5 font-mono font-bold text-amber-300">
                                      Part {part.partNumber}
                                    </td>
                                    <td className="p-2.5 font-medium text-white">
                                      {part.title}
                                    </td>
                                    <td className="p-2.5 text-stone-300">
                                      {part.serviceName}
                                    </td>
                                    <td className="p-2.5 font-mono text-stone-400">
                                      {part.date}
                                    </td>
                                    <td className="p-2.5 text-right font-mono font-bold text-emerald-400 tabular-nums">
                                      ₹{part.amount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-2.5">
                                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
                                        {part.paymentMethod}
                                      </span>
                                    </td>
                                    <td className="p-2.5 font-mono text-[11px] text-stone-400">
                                      {part.transactionId}
                                    </td>
                                    <td className="p-2.5 text-stone-300">
                                      {part.receivedBy}
                                    </td>
                                    <td className="p-2.5">
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                        part.status === 'paid'
                                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                          : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                                      }`}>
                                        {part.status === 'paid' ? 'Paid ✓' : 'Pending ⏳'}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setReceiptVoucherBooking(selectedBookingForParts);
                                          setReceiptVoucherPart(part);
                                        }}
                                        className="p-1 rounded bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 border border-stone-700 transition-colors"
                                        title="Print Installment Payment Voucher"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Form: Record New Part Payment */}
                        {(isOwner || currentStaff?.permissions?.canManageBookings) && (
                          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4 text-amber-400" />
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                  Record Next Part Payment / Installment
                                </h4>
                              </div>
                              <span className="text-[11px] text-stone-400">
                                Will automatically adjust balance due & update client ledger
                              </span>
                            </div>

                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const amt = parseFloat(newPartAmount);
                                if (isNaN(amt) || amt <= 0) {
                                  showToast('Please enter a valid part payment amount');
                                  return;
                                }
                                const partNum = (selectedBookingForParts.partPayments?.length || 1) + 1;
                                addPartPayment(selectedBookingForParts.id, {
                                  partNumber: partNum,
                                  title: newPartTitle || `Part ${partNum}: Installment`,
                                  serviceName: selectedBookingForParts.serviceName,
                                  date: newPartDate,
                                  amount: amt,
                                  paymentMethod: newPartMethod,
                                  transactionId: newPartTransId || `UPI-${Date.now().toString().slice(-6)}`,
                                  receivedBy: newPartReceivedBy || 'Deepika Sharma (Owner)',
                                  status: 'paid',
                                  notes: newPartNotes
                                });

                                // Update local preview
                                setSelectedBookingForParts(prev => prev ? {
                                  ...prev,
                                  advancePaid: prev.advancePaid + amt,
                                  balanceDue: Math.max(0, prev.balanceDue - amt),
                                  paymentStatus: (prev.balanceDue - amt <= 0) ? 'fully_paid' : 'partially_paid',
                                  partPayments: [
                                    ...(prev.partPayments || []),
                                    {
                                      id: `PP-${Date.now().toString().slice(-6)}`,
                                      partNumber: partNum,
                                      title: newPartTitle || `Part ${partNum}: Installment`,
                                      serviceName: prev.serviceName,
                                      date: newPartDate,
                                      amount: amt,
                                      paymentMethod: newPartMethod,
                                      transactionId: newPartTransId || `UPI-${Date.now().toString().slice(-6)}`,
                                      receivedBy: newPartReceivedBy || 'Deepika Sharma (Owner)',
                                      status: 'paid',
                                      notes: newPartNotes
                                    }
                                  ]
                                } : null);

                                setNewPartAmount('');
                                setNewPartTransId('');
                                setNewPartNotes('');
                              }}
                              className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                            >
                              <div className="space-y-1">
                                <label className="text-stone-400 font-medium">Part Title / Installment Name</label>
                                <input
                                  type="text"
                                  required
                                  value={newPartTitle}
                                  onChange={(e) => setNewPartTitle(e.target.value)}
                                  placeholder="e.g. Part 2: Pre-wedding / Trial Installment"
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-stone-400 font-medium">Payment Date</label>
                                <input
                                  type="date"
                                  required
                                  value={newPartDate}
                                  onChange={(e) => setNewPartDate(e.target.value)}
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-stone-400 font-medium">Amount Received (₹)</label>
                                <input
                                  type="number"
                                  required
                                  min="100"
                                  placeholder={selectedBookingForParts.balanceDue > 0 ? selectedBookingForParts.balanceDue.toString() : '5000'}
                                  value={newPartAmount}
                                  onChange={(e) => setNewPartAmount(e.target.value)}
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-stone-400 font-medium">Payment Method</label>
                                <select
                                  value={newPartMethod}
                                  onChange={(e) => setNewPartMethod(e.target.value as PaymentMethod)}
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
                                >
                                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                                  <option value="cash">Cash Settlement</option>
                                  <option value="card">Card Swipe (POS)</option>
                                  <option value="netbanking">Net Banking (NEFT/IMPS)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-stone-400 font-medium">Transaction / UTR / Cash Slip Ref</label>
                                <input
                                  type="text"
                                  placeholder="e.g. UPI-9580494058"
                                  value={newPartTransId}
                                  onChange={(e) => setNewPartTransId(e.target.value)}
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-stone-400 font-medium">Received By (Staff / Owner)</label>
                                <input
                                  type="text"
                                  value={newPartReceivedBy}
                                  onChange={(e) => setNewPartReceivedBy(e.target.value)}
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-stone-400 font-medium">Notes / Receipt Remarks</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Received at Studio trial; client satisfied with eye glam."
                                  value={newPartNotes}
                                  onChange={(e) => setNewPartNotes(e.target.value)}
                                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="flex items-end">
                                <button
                                  type="submit"
                                  className="w-full py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider rounded-lg shadow transition-all"
                                >
                                  Save Part Payment
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                      </div>

                      {/* Modal Footer */}
                      <div className="px-6 py-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400 font-mono">
                          Auto-saved to LocalStorage & Ready for GDrive / GitHub Export
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForParts(null)}
                          className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                        >
                          Close Ledger
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: LEADS CRM PIPELINE & CSV EXPORT */}
            {activeTab === 'leads' && (() => {
              const filteredLeads = leads.filter(ld => {
                const matchesStatus = leadStatusFilter === 'all' || ld.status === leadStatusFilter;
                const q = leadSearch.toLowerCase().trim();
                const matchesSearch = !q ||
                  ld.name.toLowerCase().includes(q) ||
                  ld.phone.toLowerCase().includes(q) ||
                  ld.venueCity.toLowerCase().includes(q) ||
                  ld.serviceInterest.toLowerCase().includes(q) ||
                  ld.id.toLowerCase().includes(q);
                return matchesStatus && matchesSearch;
              });

              const convertedCount = leads.filter(l => l.status === 'converted').length;
              const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;

              return (
                <div className="space-y-6">
                  {/* Leads Header & Action Toolbar */}
                  <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <TrendingUp className="w-4 h-4" />
                          </span>
                          <h3 className="font-serif-luxury text-xl font-bold text-white">
                            Customer Leads CRM & Inquiry Pipeline
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px] uppercase font-mono tracking-wider">
                            Active CRM
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          Track wedding availability inquiries, bridal trials, and export customer data for external sales reporting.
                        </p>
                      </div>

                      {/* Export CSV & Quick Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => exportLeadsReportCSV(leadStatusFilter)}
                          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                          title="Export all customer lead records into a CSV file for Excel/Sheets reporting"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-stone-950" />
                          <span>Export Leads CSV</span>
                          <span className="px-1.5 py-0.5 bg-stone-950/20 rounded text-[10px] font-mono">
                            {filteredLeads.length}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-800">
                      {/* Search Input */}
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={leadSearch}
                          onChange={(e) => setLeadSearch(e.target.value)}
                          placeholder="Search bride name, phone, city..."
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                        />
                        {leadSearch && (
                          <button
                            type="button"
                            onClick={() => setLeadSearch('')}
                            className="absolute right-2.5 top-2 text-stone-500 hover:text-white text-xs cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Status Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-[11px] pb-1 sm:pb-0">
                        {[
                          { key: 'all', label: 'All Inquiries', count: leads.length },
                          { key: 'new', label: 'New', count: leads.filter(l => l.status === 'new').length },
                          { key: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
                          { key: 'trial_booked', label: 'Trial Booked', count: leads.filter(l => l.status === 'trial_booked').length },
                          { key: 'converted', label: 'Converted', count: leads.filter(l => l.status === 'converted').length },
                          { key: 'lost', label: 'Lost', count: leads.filter(l => l.status === 'lost').length }
                        ].map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setLeadStatusFilter(tab.key)}
                            className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium ${
                              leadStatusFilter === tab.key
                                ? 'bg-amber-400 text-stone-950 font-bold'
                                : 'bg-stone-950 hover:bg-stone-800 text-stone-400 border border-stone-800'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span className="ml-1 font-mono text-[10px] opacity-80">({tab.count})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[10px] uppercase text-stone-500 font-semibold block">Total Inquiries</span>
                      <span className="font-mono text-lg font-bold text-white block mt-0.5">{leads.length} Brides</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Across Barabanki & Lucknow</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[10px] uppercase text-stone-500 font-semibold block">Trial Consultations</span>
                      <span className="font-mono text-lg font-bold text-amber-300 block mt-0.5">
                        {leads.filter(l => l.status === 'trial_booked').length} Scheduled
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">Studio look trials</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                      <span className="text-[10px] uppercase text-stone-500 font-semibold block">Converted to Bookings</span>
                      <span className="font-mono text-lg font-bold text-emerald-400 block mt-0.5">{convertedCount} Brides</span>
                      <span className="text-[10px] text-emerald-400/80 block mt-0.5">{conversionRate}% conversion efficiency</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-stone-500 font-semibold block">CSV Reporting</span>
                        <span className="text-xs font-bold text-amber-200 block mt-0.5">Excel / Sheets Ready</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">Includes full contact details</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => exportLeadsReportCSV('all')}
                        className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                        title="Download complete leads CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Funnel Chart: Tracking Initial Inquiry to Confirmed Booking Conversion */}
                  <LeadsFunnelChart
                    leads={leads}
                    bookings={bookings}
                    activeStatusFilter={leadStatusFilter}
                    onSelectStatusFilter={(status) => setLeadStatusFilter(status)}
                  />

                  {/* Kanban Pipeline Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['new', 'contacted', 'trial_booked', 'converted'].map((statusKey) => {
                      const statusLeads = filteredLeads.filter(l => l.status === statusKey);
                      return (
                        <div key={statusKey} className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
                              {statusKey.replace('_', ' ')}
                            </span>
                            <span className="font-mono text-xs text-stone-400 font-bold bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                              {statusLeads.length}
                            </span>
                          </div>

                          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                            {statusLeads.length === 0 ? (
                              <div className="p-4 text-center text-[11px] text-stone-500 italic bg-stone-950/40 rounded-lg border border-dashed border-stone-800">
                                No leads under {statusKey.replace('_', ' ')}
                              </div>
                            ) : (
                              statusLeads.map((ld: Lead) => (
                                <div key={ld.id} className="p-3 rounded-lg bg-stone-950 border border-stone-800/80 space-y-2 text-xs hover:border-amber-500/40 transition-colors">
                                  <div className="flex items-start justify-between">
                                    <span className="font-bold text-white block">{ld.name}</span>
                                    <span className="font-mono text-[10px] text-stone-500">{ld.id}</span>
                                  </div>

                                  <div className="text-[11px] text-stone-400 space-y-0.5">
                                    <div>Date: <strong className="text-stone-200">{ld.weddingDate}</strong></div>
                                    <div>Venue: <strong className="text-stone-200">{ld.venueCity}</strong></div>
                                    <div className="text-amber-200/90 font-medium">{ld.serviceInterest}</div>
                                  </div>

                                  <p className="text-[11px] text-stone-400 italic bg-stone-900/60 p-1.5 rounded">
                                    "{ld.notes}"
                                  </p>

                                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                                    <a
                                      href={`https://wa.me/${ld.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ld.name)},%20this%20is%20Deepika%20Sharma%20Makeup%20Studio%20regarding%20your%20inquiry.`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                                    >
                                      WhatsApp Bride →
                                    </a>

                                    <select
                                      value={ld.status}
                                      onChange={(e) => updateLeadStatus(ld.id, e.target.value as any)}
                                      className="p-1 rounded bg-stone-900 border border-stone-700 text-stone-200 text-[10px]"
                                    >
                                      <option value="new">New</option>
                                      <option value="contacted">Contacted</option>
                                      <option value="trial_booked">Trial Booked</option>
                                      <option value="converted">Converted</option>
                                      <option value="lost">Lost</option>
                                    </select>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })()}

            {/* TAB 4: CLIENT PROFILES & PHOTO VAULT (Image rights strictly for owner as requested!) */}
            {activeTab === 'clients' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Clients Directory Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-lg font-bold text-white">
                        Client Records & Regulars
                      </h3>
                      <p className="text-[11px] text-stone-400">
                        Regular VIPs: <strong className="text-amber-300">{regularCustomersCount}</strong> ({regularClientRatio}% retention)
                      </p>
                    </div>

                    <button
                      onClick={exportClientReportCSV}
                      className="py-1 px-2.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1 border border-stone-700 transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                    {clients.map((cl) => {
                      const isSelected = cl.id === selectedClient?.id;
                      return (
                        <div
                          key={cl.id}
                          onClick={() => setSelectedClientId(cl.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-950/20'
                              : 'border-stone-800 bg-stone-900 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-xs">{cl.name}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              cl.clientType === 'regular_vip' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-stone-800 text-stone-400'
                            }`}>
                              {cl.clientType === 'regular_vip' ? 'Regular VIP' : 'Bride'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2">
                            <span>Total Bookings: <strong className="text-white font-mono">{cl.totalBookings}</strong></span>
                            <span>Spent: <strong className="text-emerald-400 font-mono">₹{cl.totalSpent.toLocaleString('en-IN')}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Client Profile Details & Photo Vault */}
                <div className="lg:col-span-7 space-y-6">
                  {selectedClient ? (
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-6">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between pb-4 border-b border-stone-800">
                        <div>
                          <h3 className="font-serif-luxury text-2xl font-bold text-white">
                            {selectedClient.name}
                          </h3>
                          <p className="text-xs text-stone-400 font-mono mt-0.5">
                            {isOwner || currentStaff?.permissions?.canViewPhones ? selectedClient.phone : 'Protected (+91 ••••• ••••)'} · {selectedClient.email}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Lifetime Spend</span>
                          <span className="font-mono text-xl font-bold text-emerald-400">
                            ₹{selectedClient.totalSpent.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Skin Profile Attributes */}
                      <div className="grid grid-cols-3 gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800/80">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase block">Skin Type</span>
                          <span className="text-stone-200 font-medium">{selectedClient.skinType}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase block">Undertone</span>
                          <span className="text-stone-200 font-medium">{selectedClient.undertone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase block">Allergies / Notes</span>
                          <span className="text-rose-300 font-medium">{selectedClient.allergies}</span>
                        </div>
                      </div>

                      {/* Photo Vault Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
                              <Image className="w-4 h-4 text-amber-400" />
                              <span>Client Makeover Photo Vault</span>
                            </h4>
                            <p className="text-[11px] text-stone-400">
                              Upload & remove rights restricted strictly to Studio Owner Deepika Sharma.
                            </p>
                          </div>

                          {!isOwner && (
                            <span className="text-[10px] text-rose-400 flex items-center gap-1 bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40">
                              <Lock className="w-3 h-3" />
                              <span>Owner Photo Lock</span>
                            </span>
                          )}
                        </div>

                        {/* Photo Upload Form (Owner Exclusive) */}
                        {isOwner && (
                          <form onSubmit={handleUploadPhotoSubmit} className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                              Owner Quick Upload: Add New Makeover Photo
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                required
                                placeholder="Image URL or Path (/src/assets/...)"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                className="p-1.5 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs sm:col-span-2"
                              />
                              <input
                                type="text"
                                required
                                placeholder="Look Title (e.g. Wedding Pheras Look)"
                                value={newPhotoTitle}
                                onChange={(e) => setNewPhotoTitle(e.target.value)}
                                className="p-1.5 rounded bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                type="submit"
                                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded text-xs font-semibold"
                              >
                                Save to Client Vault
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Client Photos Gallery */}
                        {selectedClient.photos.length === 0 ? (
                          <div className="p-8 text-center text-xs text-stone-500 bg-stone-950 rounded-xl border border-stone-800/60">
                            No makeover photos archived for this client yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {selectedClient.photos.map((photo) => (
                              <div key={photo.id} className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 group h-36">
                                <img
                                  src={photo.url}
                                  alt={photo.title}
                                  className="w-full h-full object-cover object-top"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-2 inset-x-2 text-[10px] text-white">
                                  <span className="font-semibold block truncate">{photo.title}</span>
                                  <span className="text-stone-400 font-mono">{photo.date}</span>
                                </div>

                                {/* Owner Delete Button */}
                                {isOwner && (
                                  <button
                                    onClick={() => deleteClientPhoto(selectedClient.id, photo.id)}
                                    className="absolute top-2 right-2 p-1 bg-stone-900/80 hover:bg-rose-600 text-stone-300 hover:text-white rounded transition-colors"
                                    title="Owner: Remove photo from vault"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      </div>

                    </div>
                  ) : (
                    <div className="p-12 text-center text-stone-500">
                      Select a client from the directory to view details.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 5: TEAM & EMPLOYEE ACCESS RIGHTS (RBAC - Owner Exclusive) */}
            {activeTab === 'employees' && (
              <div>
                {!isOwner ? (
                  <div className="p-12 text-center space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white">
                      Access Rights Control (Owner Only)
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Only Studio Owner Deepika Sharma can modify employee PIN credentials, salaries, and data permissions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-serif-luxury text-xl font-bold text-white">
                          Employee Directory & Access Rights (RBAC)
                        </h3>
                        <p className="text-xs text-stone-400">
                          Configure individual staff credentials, monthly base salaries, commission cuts, and toggle what data each employee can see.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingStaff(!isAddingStaff)}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow flex items-center gap-2 self-start sm:self-auto"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{isAddingStaff ? 'Cancel Form' : '+ Add New Artist / Stylist'}</span>
                      </button>
                    </div>

                    {/* OWNER ONLY: ADD ARTIST INLINE FORM */}
                    {isAddingStaff && (
                      <form onSubmit={handleAddStaffSubmit} className="p-5 rounded-2xl bg-stone-900 border border-amber-500/40 space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-amber-400" />
                            <span>Add New Bridal Artist / Stylist Profile</span>
                          </span>
                          <span className="text-[10px] text-stone-400">Owner Authorization Verified</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="text-[11px] text-stone-300 block mb-1">Full Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Ananya Mishra"
                              value={newStaffName}
                              onChange={(e) => setNewStaffName(e.target.value)}
                              className="w-full p-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-stone-300 block mb-1">Role / Designation *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Senior Bridal Makeup Artist"
                              value={newStaffRole}
                              onChange={(e) => setNewStaffRole(e.target.value)}
                              className="w-full p-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-stone-300 block mb-1">Contact Phone *</label>
                            <input
                              type="tel"
                              required
                              placeholder="+91 95804 94058"
                              value={newStaffPhone}
                              onChange={(e) => setNewStaffPhone(e.target.value)}
                              className="w-full p-2 rounded-lg bg-stone-950 border border-stone-700 text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                          <div className="sm:col-span-2">
                            <label className="text-[11px] text-stone-300 block mb-1">Specialty</label>
                            <input
                              type="text"
                              placeholder="HD Airbrush & Traditional Saree Draping"
                              value={newStaffSpecialty}
                              onChange={(e) => setNewStaffSpecialty(e.target.value)}
                              className="w-full p-2 rounded-lg bg-stone-950 border border-stone-700 text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-300 block mb-1">Base Salary (₹)</label>
                            <input
                              type="number"
                              value={newStaffSalary}
                              onChange={(e) => setNewStaffSalary(e.target.value)}
                              className="w-full p-2 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-300 block mb-1">Commission Cut (%)</label>
                            <input
                              type="number"
                              value={newStaffCommission}
                              onChange={(e) => setNewStaffCommission(e.target.value)}
                              className="w-full p-2 rounded-lg bg-stone-950 border border-stone-700 text-emerald-400 font-mono"
                            />
                          </div>
                        </div>

                        {/* STAFF PORTAL LOGIN CREDENTIALS & PASSWORD (USER REQUIREMENT) */}
                        <div className="p-3.5 rounded-xl bg-stone-950/80 border border-amber-500/30 space-y-3">
                          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                              <span>Set Employee Login Credentials & Password</span>
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">Owner Authorization</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="text-[11px] text-stone-300 block mb-1">Staff Login Email / User ID</label>
                              <input
                                type="email"
                                placeholder={newStaffName ? `${newStaffName.toLowerCase().replace(/\s+/g, '')}@deepikastudio.in` : 'staff@deepikastudio.in'}
                                value={newStaffEmail}
                                onChange={(e) => setNewStaffEmail(e.target.value)}
                                className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 font-mono text-xs focus:border-amber-400"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-stone-300 block mb-1">
                                Set Staff Password *
                              </label>
                              <div className="relative">
                                <input
                                  type={showNewStaffPassword ? 'text' : 'password'}
                                  required
                                  placeholder="e.g. naima@123"
                                  value={newStaffPassword}
                                  onChange={(e) => setNewStaffPassword(e.target.value)}
                                  className="w-full p-2 pr-8 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 font-mono text-xs focus:border-amber-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewStaffPassword(!showNewStaffPassword)}
                                  className="absolute right-2.5 top-2 text-stone-400 hover:text-white"
                                >
                                  {showNewStaffPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-stone-300 block mb-1">
                                Confirm Password *
                              </label>
                              <div className="relative">
                                <input
                                  type={showNewStaffConfirmPassword ? 'text' : 'password'}
                                  required
                                  placeholder="Repeat password"
                                  value={newStaffConfirmPassword}
                                  onChange={(e) => setNewStaffConfirmPassword(e.target.value)}
                                  className="w-full p-2 pr-8 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 font-mono text-xs focus:border-amber-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewStaffConfirmPassword(!showNewStaffConfirmPassword)}
                                  className="absolute right-2.5 top-2 text-stone-400 hover:text-white"
                                >
                                  {showNewStaffConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingStaff(false)}
                            className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold uppercase tracking-wider shadow"
                          >
                            Save Artist to Studio Roster
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-4">
                      {employees.map((emp: Employee) => (
                        <div
                          key={emp.id}
                          className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-serif-luxury text-lg font-bold text-white">
                                    {emp.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                                    <span className="text-[10px] text-stone-400 font-sans">Password:</span>
                                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                                      {revealedPasswordEmpId === emp.id ? (emp.password || emp.pin) : '••••••••'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setRevealedPasswordEmpId(revealedPasswordEmpId === emp.id ? null : emp.id)}
                                      className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                                      title="Reveal / Hide Password"
                                    >
                                      {revealedPasswordEmpId === emp.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-stone-400 mt-0.5">
                                  {emp.role} · Login: <strong className="text-amber-200/90 font-mono">{emp.email}</strong> · Phone: <strong className="text-stone-300">{emp.phone}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
                              <div>
                                <span className="text-[10px] text-stone-500 block uppercase">Base Salary</span>
                                <span className="font-bold text-amber-200">₹{emp.monthlySalary.toLocaleString('en-IN')}/mo</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-500 block uppercase">Commission</span>
                                <span className="font-bold text-emerald-400">{emp.commissionRate}%</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-stone-500 block uppercase">Assigned</span>
                                <span className="font-bold text-stone-200">{emp.assignedBookingsCount} Brides</span>
                              </div>

                              {/* Owner Manage Password Button */}
                              {isOwner && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (managingPasswordEmpId === emp.id) {
                                      setManagingPasswordEmpId(null);
                                    } else {
                                      setManagingPasswordEmpId(emp.id);
                                      setQuickEditPassword(emp.password || emp.pin || 'staff@123');
                                      setQuickEditConfirmPassword(emp.password || emp.pin || 'staff@123');
                                    }
                                  }}
                                  className={`px-2.5 py-1 text-[11px] rounded-lg border flex items-center gap-1 transition-all cursor-pointer font-semibold ${
                                    managingPasswordEmpId === emp.id
                                      ? 'bg-amber-400 text-stone-950 border-amber-400'
                                      : 'bg-stone-950 hover:bg-stone-800 text-amber-300 border-stone-800 hover:border-amber-400/50'
                                  }`}
                                  title="Change staff login password"
                                >
                                  <KeyRound className="w-3.5 h-3.5" />
                                  <span>{managingPasswordEmpId === emp.id ? 'Close' : 'Change Password'}</span>
                                </button>
                              )}

                              {/* Owner Delete Stylist Button */}
                              {isOwner && !emp.role.toLowerCase().includes('founder') && !emp.name.toLowerCase().includes('deepika') && (
                                deletingEmployeeId === emp.id ? (
                                  <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-rose-500/80 ml-2 animate-in fade-in">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteEmployee(emp.id, true);
                                        setDeletingEmployeeId(null);
                                      }}
                                      className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      Confirm Remove
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingEmployeeId(null)}
                                      className="px-1.5 py-1 text-stone-400 hover:text-white text-[10px] cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setDeletingEmployeeId(emp.id)}
                                    className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-950/60 rounded border border-stone-800 hover:border-rose-800 transition-colors ml-2 cursor-pointer"
                                    title="Owner Access: Remove Stylist from Roster"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          {/* INLINE PASSWORD MANAGER DRAWER */}
                          {managingPasswordEmpId === emp.id && (
                            <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/40 space-y-3 animate-in fade-in duration-150">
                              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Manage & Change Staff Password: {emp.name}</span>
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">Owner Access Control</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <label className="text-[11px] text-stone-400 block mb-1">Staff Login User ID / Email</label>
                                  <input
                                    type="email"
                                    value={emp.email}
                                    disabled
                                    className="w-full p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 font-mono text-xs cursor-not-allowed"
                                  />
                                </div>

                                <div>
                                  <label className="text-[11px] text-stone-300 block mb-1">Set New Password *</label>
                                  <div className="relative">
                                    <input
                                      type={showQuickEditPassword ? 'text' : 'password'}
                                      required
                                      value={quickEditPassword}
                                      onChange={(e) => setQuickEditPassword(e.target.value)}
                                      placeholder="e.g. newpass@123"
                                      className="w-full p-2 pr-8 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 font-mono text-xs focus:border-amber-400"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowQuickEditPassword(!showQuickEditPassword)}
                                      className="absolute right-2.5 top-2 text-stone-400 hover:text-white cursor-pointer"
                                    >
                                      {showQuickEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[11px] text-stone-300 block mb-1">Confirm New Password *</label>
                                  <input
                                    type="text"
                                    required
                                    value={quickEditConfirmPassword}
                                    onChange={(e) => setQuickEditConfirmPassword(e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 font-mono text-xs focus:border-amber-400"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setManagingPasswordEmpId(null)}
                                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (quickEditPassword.trim() !== quickEditConfirmPassword.trim()) {
                                      showToast('Passwords do not match! Please check confirm password.');
                                      return;
                                    }
                                    if (!quickEditPassword.trim()) {
                                      showToast('Please enter a valid password.');
                                      return;
                                    }
                                    updateEmployeeCredentials(emp.id, emp.email, quickEditPassword.trim());
                                    setManagingPasswordEmpId(null);
                                    showToast(`Staff password for "${emp.name}" updated successfully!`);
                                  }}
                                  className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-lg shadow cursor-pointer"
                                >
                                  Update Staff Password
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Granular Permission Toggles (The user's key requirement!) */}
                          <div className="pt-3 border-t border-stone-800 space-y-2">
                            <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider block">
                              Access Rights Control for {emp.name}:
                            </span>

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                              <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={emp.permissions.canViewClients}
                                  onChange={(e) => updateEmployeePermissions(emp.id, {
                                    ...emp.permissions,
                                    canViewClients: e.target.checked
                                  })}
                                  className="rounded text-amber-400"
                                />
                                <span className="text-stone-300">View Clients</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={emp.permissions.canViewPhones}
                                  onChange={(e) => updateEmployeePermissions(emp.id, {
                                    ...emp.permissions,
                                    canViewPhones: e.target.checked
                                  })}
                                  className="rounded text-amber-400"
                                />
                                <span className="text-stone-300">View Phone Nos</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={emp.permissions.canManageBookings}
                                  onChange={(e) => updateEmployeePermissions(emp.id, {
                                    ...emp.permissions,
                                    canManageBookings: e.target.checked
                                  })}
                                  className="rounded text-amber-400"
                                />
                                <span className="text-stone-300">Edit Bookings</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={emp.permissions.canAccessERP}
                                  onChange={(e) => updateEmployeePermissions(emp.id, {
                                    ...emp.permissions,
                                    canAccessERP: e.target.checked
                                  })}
                                  className="rounded text-amber-400"
                                />
                                <span className="text-stone-300">Access ERP Ledger</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={emp.permissions.canManagePhotos}
                                  onChange={(e) => updateEmployeePermissions(emp.id, {
                                    ...emp.permissions,
                                    canManagePhotos: e.target.checked
                                  })}
                                  className="rounded text-amber-400"
                                />
                                <span className="text-stone-300">Manage Photos</span>
                              </label>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 6: GOOGLE DRIVE & GITHUB BACKUP SYNC HUB */}
            {activeTab === 'cloud_backup' && (
              <div>
                {!isOwner ? (
                  <div className="p-12 text-center space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white">
                      Cloud Backup Restricted
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Database export and Google Drive synchronization can only be initiated by Studio Owner Deepika Sharma.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Sync Action Header */}
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Google Drive & GitHub Vault Status: Active</span>
                        </div>
                        <h3 className="font-serif-luxury text-2xl font-bold text-white">
                          Cloud Data Backup & Photo Archive Hub
                        </h3>
                        <p className="text-xs text-stone-400 mt-1 max-w-xl">
                          All booking registries, client records, and financial receipts are backed up safely to Google Drive and GitHub repository.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={triggerGDriveSync}
                          disabled={gdriveSync.status === 'syncing'}
                          className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl shadow flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${gdriveSync.status === 'syncing' ? 'animate-spin' : ''}`} />
                          <span>{gdriveSync.status === 'syncing' ? 'Syncing to Drive...' : 'Sync to GDrive Now'}</span>
                        </button>

                        <button
                          onClick={() => exportLeadsReportCSV('all')}
                          className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-xl border border-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                          title="Export all customer lead records into a CSV file"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Export Leads (CSV)</span>
                        </button>

                        <button
                          onClick={exportBackupJSON}
                          className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold uppercase tracking-wider rounded-xl border border-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download GitHub Backup (JSON)</span>
                        </button>
                      </div>
                    </div>

                    {/* Sync Details Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1">
                        <span className="text-[10px] uppercase text-stone-500">Last Synced Timestamp</span>
                        <span className="font-mono text-sm font-semibold text-white block">{gdriveSync.lastSyncedAt}</span>
                        <span className="text-[10px] text-emerald-400">● Real-time mirror</span>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1">
                        <span className="text-[10px] uppercase text-stone-500">Total Synced Files</span>
                        <span className="font-mono text-sm font-semibold text-amber-300 block">{gdriveSync.syncedFilesCount} Records & Photos</span>
                        <span className="text-[10px] text-stone-400">Stored in encrypted GDrive folder</span>
                      </div>

                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1">
                        <span className="text-[10px] uppercase text-stone-500">Cloud Target Folder</span>
                        <span className="font-mono text-xs font-semibold text-stone-200 block truncate">/GDrive/DeepikaSharma_Studio_Barabanki/</span>
                        <span className="text-[10px] text-stone-400">Linked to: engdksmegasoft@gmail.com</span>
                      </div>
                    </div>

                    {/* Cloud Folders Breakdown */}
                    <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 text-xs">
                      <span className="font-semibold text-stone-200 uppercase tracking-wider block">
                        Google Drive Monitored Folders:
                      </span>
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
                          <span className="font-mono text-stone-300">📁 /GDrive/DeepikaSharma_BBK/Bookings_And_Receipts/</span>
                          <span className="text-emerald-400 text-[10px] font-mono">100% Synced</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
                          <span className="font-mono text-stone-300">📁 /GDrive/DeepikaSharma_BBK/Financial_Ledger_And_Salaries/</span>
                          <span className="text-emerald-400 text-[10px] font-mono">100% Synced</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between">
                          <span className="font-mono text-stone-300">📁 /GDrive/DeepikaSharma_BBK/Client_Makeover_Photos_Vault/</span>
                          <span className="text-emerald-400 text-[10px] font-mono">100% Synced</span>
                        </div>
                      </div>
                    </div>

                    {/* GitHub Deployment & Live Hosting Card (indianengdks.github.io) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white uppercase tracking-wider block">
                              GitHub Pages Deployment & Live Hosting
                            </span>
                            <span className="text-[11px] text-amber-300 font-mono">
                              Target: https://indianengdks.github.io/
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                          base: './' Configured
                        </span>
                      </div>

                      <p className="text-stone-300 leading-relaxed">
                        This studio platform is fully optimized for zero-server static hosting on GitHub Pages. The Vite build output resolves relative assets automatically, and all bookings, part-wise payments, and credentials persist in your browser’s LocalStorage.
                      </p>

                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                        <span className="text-[11px] font-mono text-stone-400 block font-semibold">
                          Quick Git Commands to Publish Live:
                        </span>
                        <pre className="p-2.5 rounded bg-stone-900 text-amber-200 font-mono text-[11px] overflow-x-auto leading-relaxed select-all">
{`git add .
git commit -m "Deploy Deepika Sharma Makeup Studio & Academy with Salon ERP"
git push origin main`}
                        </pre>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB 7: USER ID & PASSWORD MANAGER (Owner Exclusive) */}
            {activeTab === 'credentials' && (
              <div>
                {!isOwner ? (
                  <div className="p-12 text-center space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white">
                      Security Access Restricted
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Only Studio Owner Deepika Sharma can modify Master ERP credentials and employee access PINs.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* Section 1: Owner Master Credentials */}
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <KeyRound className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-serif-luxury text-lg font-bold text-white">
                              Owner User ID & Master Password Management
                            </h3>
                            <p className="text-xs text-stone-400">
                              You have full rights to change your login User ID (email/username) and master security password.
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-500 block uppercase font-mono">Last Updated</span>
                          <span className="text-xs text-amber-300 font-mono">
                            {new Date(ownerCredentials.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (editOwnerPassword !== editOwnerConfirmPassword) {
                            showToast('Passwords do not match! Please check confirm password.');
                            return;
                          }
                          updateOwnerCredentials(editOwnerUsername, editOwnerEmail, editOwnerPassword);
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <label className="text-stone-300 font-medium">Owner Username / User ID</label>
                          <input
                            type="text"
                            required
                            value={editOwnerUsername}
                            onChange={(e) => setEditOwnerUsername(e.target.value)}
                            placeholder="admin"
                            className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-stone-300 font-medium">Owner Recovery Email</label>
                          <input
                            type="email"
                            required
                            value={editOwnerEmail}
                            onChange={(e) => setEditOwnerEmail(e.target.value)}
                            placeholder="engdksmegasoft@gmail.com"
                            className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-stone-300 font-medium">New Master Password</label>
                          <input
                            type="password"
                            required
                            value={editOwnerPassword}
                            onChange={(e) => setEditOwnerPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-stone-300 font-medium">Confirm Password</label>
                          <input
                            type="password"
                            required
                            value={editOwnerConfirmPassword}
                            onChange={(e) => setEditOwnerConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] text-stone-400">
                            Active Owner Login: User: <strong className="text-amber-300 font-mono">{ownerCredentials.username}</strong> · Email: <strong className="text-amber-300 font-mono">{ownerCredentials.email}</strong>
                          </span>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider rounded-xl shadow transition-all"
                          >
                            Save Owner Credentials
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Section 2: Employee User IDs & Access PINs */}
                    <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-stone-800 text-stone-300 border border-stone-700">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-serif-luxury text-lg font-bold text-white">
                              Employee User IDs & Login Password Configuration
                            </h3>
                            <p className="text-xs text-stone-400">
                              Define custom login emails and secure login passwords for your team members to control their access rights.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-stone-400">
                          Total Staff: <strong className="text-white">{employees.length}</strong>
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-900 text-stone-400 border-b border-stone-800">
                            <tr>
                              <th className="p-3">Staff Member</th>
                              <th className="p-3">Staff ID</th>
                              <th className="p-3">Login User ID / Email</th>
                              <th className="p-3">Staff Password</th>
                              <th className="p-3">Role & Specialty</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800 font-sans">
                            {employees.map((emp) => (
                              <tr key={emp.id} className="hover:bg-stone-900/50">
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover border border-amber-500/40" />
                                    <div>
                                      <span className="font-semibold text-white block">{emp.name}</span>
                                      <span className="text-[11px] text-stone-400">{emp.phone}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 font-mono font-bold text-amber-300">
                                  {emp.id}
                                </td>
                                <td className="p-3 font-mono text-stone-200">
                                  {emp.email}
                                </td>
                                <td className="p-3 font-mono">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-emerald-300 font-bold">
                                      {revealedPasswordEmpId === emp.id ? (emp.password || emp.pin) : '••••••••'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setRevealedPasswordEmpId(revealedPasswordEmpId === emp.id ? null : emp.id)}
                                      className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                                      title="Show / Hide Password"
                                    >
                                      {revealedPasswordEmpId === emp.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </td>
                                <td className="p-3 text-stone-300">
                                  <div>{emp.role}</div>
                                  <div className="text-[10px] text-stone-500">{emp.specialty}</div>
                                </td>
                                <td className="p-3">
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                                    Active
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedEmpForEdit(emp);
                                      setEditEmpEmail(emp.email);
                                      setEditEmpPassword(emp.password || emp.pin || 'staff@123');
                                      setEditEmpConfirmPassword(emp.password || emp.pin || 'staff@123');
                                    }}
                                    className="px-2.5 py-1 text-xs rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 transition-colors cursor-pointer"
                                  >
                                    Change Password
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Edit Employee Credentials Inline Form */}
                      {selectedEmpForEdit && (
                        <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/40 space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Updating Login Password for: {selectedEmpForEdit.name} ({selectedEmpForEdit.id})
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedEmpForEdit(null)}
                              className="text-stone-400 hover:text-white text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                            <div className="space-y-1">
                              <label className="text-stone-400">Employee Login Email / User ID</label>
                              <input
                                type="email"
                                value={editEmpEmail}
                                onChange={(e) => setEditEmpEmail(e.target.value)}
                                className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-white font-mono focus:border-amber-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-stone-400">Set New Password *</label>
                              <input
                                type="text"
                                required
                                value={editEmpPassword}
                                onChange={(e) => setEditEmpPassword(e.target.value)}
                                placeholder="e.g. naima@123"
                                className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-emerald-300 font-mono font-bold focus:border-amber-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-stone-400">Confirm Password *</label>
                              <input
                                type="text"
                                required
                                value={editEmpConfirmPassword}
                                onChange={(e) => setEditEmpConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                className="w-full p-2 rounded bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold focus:border-amber-400"
                              />
                            </div>

                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => {
                                  if (editEmpPassword.trim() !== editEmpConfirmPassword.trim()) {
                                    showToast('Passwords do not match! Please verify both password fields.');
                                    return;
                                  }
                                  if (!editEmpPassword.trim()) {
                                    showToast('Please enter a valid password for staff login.');
                                    return;
                                  }
                                  updateEmployeeCredentials(selectedEmpForEdit.id, editEmpEmail, editEmpPassword.trim());
                                  setSelectedEmpForEdit(null);
                                }}
                                className="w-full py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase rounded cursor-pointer shadow"
                              >
                                Save Password
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

      {/* PRINTABLE INSTALLMENT RECEIPT VOUCHER MODAL */}
      {receiptVoucherPart && receiptVoucherBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Voucher Header with Logo */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400/80 bg-stone-950 shadow">
                  <img src={STUDIO_LOGO} alt="Deepika Sharma Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white uppercase tracking-wider">
                    {STUDIO_INFO.shortName}
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    Official Part-wise Payment Receipt Voucher
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {STUDIO_INFO.landmark}, {STUDIO_INFO.city} · Helpline: {STUDIO_INFO.phone}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setReceiptVoucherPart(null);
                  setReceiptVoucherBooking(null);
                }}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Meta */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Voucher Ref ID</span>
                <span className="font-mono font-bold text-amber-300">RCV-{receiptVoucherPart.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Booking ID</span>
                <span className="font-mono text-white">{receiptVoucherBooking.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Client Name</span>
                <span className="font-semibold text-white">{receiptVoucherBooking.clientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Contact Phone</span>
                <span className="font-mono text-stone-300">{receiptVoucherBooking.phone}</span>
              </div>
            </div>

            {/* Installment Payment Details */}
            <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="font-semibold text-white text-sm">{receiptVoucherPart.title}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                  {receiptVoucherPart.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-300">
                <div>
                  <span className="text-stone-500 block text-[10px]">Service Applied:</span>
                  <span className="font-medium text-white">{receiptVoucherPart.serviceName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Payment Date:</span>
                  <span className="font-mono text-white">{receiptVoucherPart.date}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Payment Mode:</span>
                  <span className="uppercase font-semibold text-amber-300">{receiptVoucherPart.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Transaction / Ref:</span>
                  <span className="font-mono text-stone-300">{receiptVoucherPart.transactionId}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Received By:</span>
                  <span>{receiptVoucherPart.receivedBy}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Remarks:</span>
                  <span>{receiptVoucherPart.notes || 'Verified installment entry'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-sm">
                <span className="font-bold text-stone-300">Amount Paid in this Part:</span>
                <span className="font-mono font-bold text-emerald-400 text-lg">
                  ₹{receiptVoucherPart.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Account Ledger Balance */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-950 text-xs text-stone-400">
              <div>
                <span>Total Package: <strong>₹{receiptVoucherBooking.totalAmount.toLocaleString('en-IN')}</strong></span>
              </div>
              <div>
                <span>Balance Remaining: <strong className={receiptVoucherBooking.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}>₹{receiptVoucherBooking.balanceDue.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-stone-500 font-mono">
                Concept: indianengdks.github.io/erp
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold uppercase rounded-lg shadow flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptVoucherPart(null);
                    setReceiptVoucherBooking(null);
                  }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
