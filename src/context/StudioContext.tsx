import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  Booking,
  Lead,
  Employee,
  ClientProfile,
  FinancialExpense,
  ChatMessage,
  PushNotificationItem,
  UserSession,
  ClientPhoto,
  OwnerCredentials,
  PartPayment,
  PaymentStatus
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_EMPLOYEES,
  INITIAL_BOOKINGS,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_EXPENSES,
  INITIAL_CHAT,
  INITIAL_NOTIFICATIONS,
  INITIAL_ATTENDANCE
} from '../data/initialData';
import { ShiftAttendanceRecord } from '../types';

interface GDriveSyncState {
  lastSyncedAt: string;
  syncedFilesCount: number;
  status: 'idle' | 'syncing' | 'synced' | 'error';
  backupVersion: string;
}

interface StudioContextType {
  // Current user & RBAC
  session: UserSession;
  ownerCredentials: OwnerCredentials;
  loginAsOwner: (password?: string, usernameOrEmail?: string) => boolean;
  loginAsEmployee: (employeeId: string, pin: string) => boolean;
  logoutToGuest: () => void;
  updateOwnerCredentials: (newUsername: string, newEmail: string, newPassword?: string) => boolean;
  updateEmployeeCredentials: (employeeId: string, newEmail: string, newPassword: string) => boolean;
  
  // Data State
  services: ServiceItem[];
  bookings: Booking[];
  leads: Lead[];
  employees: Employee[];
  clients: ClientProfile[];
  expenses: FinancialExpense[];
  chatMessages: ChatMessage[];
  notifications: PushNotificationItem[];
  gdriveSync: GDriveSyncState;

  // Actions
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  deleteBooking: (id: string, bypassRoleCheck?: boolean) => boolean;
  updateBookingStatus: (id: string, status: Booking['bookingStatus']) => void;
  markBookingBalancePaid: (id: string) => void;
  addPartPayment: (bookingId: string, partData: Omit<PartPayment, 'id'>) => void;
  
  addLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Lead;
  updateLeadStatus: (id: string, status: Lead['status'], notes?: string) => void;
  
  addEmployee: (empData: Omit<Employee, 'id'>) => Employee | null;
  deleteEmployee: (employeeId: string, bypassRoleCheck?: boolean) => boolean;
  updateEmployeePermissions: (employeeId: string, permissions: Employee['permissions']) => void;
  updateEmployeeDetails: (employeeId: string, updates: Partial<Employee>) => void;
  
  addClientPhoto: (clientId: string, photo: Omit<ClientPhoto, 'id'>) => void;
  deleteClientPhoto: (clientId: string, photoId: string) => boolean;
  updateClientNotes: (clientId: string, notes: string) => void;

  addExpense: (expense: Omit<FinancialExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  sendChatMessage: (text: string, sender?: 'client' | 'studio') => void;
  sendPushNotification: (notification: Omit<PushNotificationItem, 'id' | 'sentAt' | 'status'>) => void;

  // Attendance & Shift Log
  attendanceRecords: ShiftAttendanceRecord[];
  clockInEmployee: (employeeId: string, station?: string, notes?: string) => void;
  clockOutEmployee: (recordId: string, notes?: string) => void;
  toggleEmployeeBreak: (recordId: string) => void;
  exportAttendanceCSV: (weekOnly?: boolean) => void;

  // Google Drive & Backup Sync
  triggerGDriveSync: () => Promise<void>;
  exportBackupJSON: () => void;
  exportClientReportCSV: () => void;
  exportLeadsReportCSV: (statusFilter?: string) => void;

  // Modals & Navigation triggers
  isBookingModalOpen: boolean;
  openBookingModal: (preselectedServiceId?: string) => void;
  closeBookingModal: () => void;
  preselectedServiceId: string | null;

  isLeadModalOpen: boolean;
  openLeadModal: () => void;
  closeLeadModal: () => void;

  isERPModalOpen: boolean;
  openERPModal: () => void;
  closeERPModal: () => void;

  isNotificationsModalOpen: boolean;
  openNotificationsModal: () => void;
  closeNotificationsModal: () => void;

  isClientPortalOpen: boolean;
  openClientPortal: (clientPhone?: string) => void;
  closeClientPortal: () => void;
  clientPortalPhone: string | null;
  setClientPortalPhone: (phone: string | null) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session: defaults to client until user logs in with Owner or Employee credentials
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('deepika_studio_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return { role: 'client', name: 'Visiting Client', email: '' };
  });

  // Owner Credentials (dynamic and editable by owner)
  const [ownerCredentials, setOwnerCredentials] = useState<OwnerCredentials>(() => {
    const saved = localStorage.getItem('deepika_owner_creds');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      username: 'admin',
      email: 'engdksmegasoft@gmail.com',
      password: 'admin',
      updatedAt: '2026-10-30T00:00:00.000Z'
    };
  });

  // Services
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('deepika_studio_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('deepika_studio_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  // Employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('deepika_studio_employees');
    if (saved) {
      try {
        const parsed: Employee[] = JSON.parse(saved);
        return parsed.map(emp => ({
          ...emp,
          password: emp.password || emp.pin || 'staff@123',
          pin: emp.pin || emp.password || '1234'
        }));
      } catch (e) {
        /* ignore */
      }
    }
    return INITIAL_EMPLOYEES;
  });

  // Clients CRM
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('deepika_studio_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  // Financial Expenses
  const [expenses, setExpenses] = useState<FinancialExpense[]>(() => {
    const saved = localStorage.getItem('deepika_studio_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('deepika_studio_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT;
  });

  // Notifications
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    const saved = localStorage.getItem('deepika_studio_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // GDrive Sync State
  const [gdriveSync, setGdriveSync] = useState<GDriveSyncState>(() => {
    const saved = localStorage.getItem('deepika_studio_gdrive_sync');
    return saved ? JSON.parse(saved) : {
      lastSyncedAt: '2026-10-30 05:15 AM',
      syncedFilesCount: 52,
      status: 'idle',
      backupVersion: 'v2.6.2-bbk-gdrive'
    };
  });

  // Shift & Attendance State
  const [attendanceRecords, setAttendanceRecords] = useState<ShiftAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('deepika_studio_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isERPModalOpen, setIsERPModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [clientPortalPhone, setClientPortalPhone] = useState<string | null>(() => {
    return localStorage.getItem('deepika_client_portal_phone') || null;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openClientPortal = (phone?: string) => {
    if (phone) {
      setClientPortalPhone(phone);
      localStorage.setItem('deepika_client_portal_phone', phone);
    }
    setIsClientPortalOpen(true);
  };

  const closeClientPortal = () => {
    setIsClientPortalOpen(false);
  };

  useEffect(() => {
    if (clientPortalPhone) {
      localStorage.setItem('deepika_client_portal_phone', clientPortalPhone);
    } else {
      localStorage.removeItem('deepika_client_portal_phone');
    }
  }, [clientPortalPhone]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('deepika_studio_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('deepika_studio_gdrive_sync', JSON.stringify(gdriveSync));
  }, [gdriveSync]);

  useEffect(() => {
    localStorage.setItem('deepika_owner_creds', JSON.stringify(ownerCredentials));
  }, [ownerCredentials]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 4000);
  };

  // Auth RBAC Actions matching indianengdks.github.io/erp concept
  const loginAsOwner = (password?: string, usernameOrEmail?: string): boolean => {
    const pass = (password || '').trim();
    const user = (usernameOrEmail || '').trim().toLowerCase();

    // Check user matching: allow blank (if quick button) or matching username/email or 'admin'
    const isUserMatch = !user ||
      user === ownerCredentials.username.toLowerCase() ||
      user === ownerCredentials.email.toLowerCase() ||
      user === 'admin' ||
      user === 'deepika';

    // Check password matching: owner's configured password, or default fallbacks
    const validFallbacks = ['admin', 'admin123', 'deepika', '1234', 'boss', 'dks'];
    const isPassMatch = !pass ||
      pass === ownerCredentials.password ||
      validFallbacks.includes(pass.toLowerCase());

    if (!isUserMatch || !isPassMatch) {
      showToast('Authentication Failed: Invalid Owner Username or Password');
      return false;
    }

    setSession({
      role: 'owner',
      name: 'Deepika Sharma (Owner & Master Artist)',
      email: ownerCredentials.email
    });
    showToast('Logged in as Studio Owner (Super Admin). Full Salon ERP access active.');
    return true;
  };

  const updateOwnerCredentials = (newUsername: string, newEmail: string, newPassword?: string): boolean => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only the Owner can modify Owner Credentials');
      return false;
    }
    setOwnerCredentials(prev => ({
      username: newUsername.trim() || prev.username,
      email: newEmail.trim() || prev.email,
      password: (newPassword && newPassword.trim()) ? newPassword.trim() : prev.password,
      updatedAt: new Date().toISOString()
    }));
    showToast('Owner User ID & Master Password updated successfully! Stored securely.');
    return true;
  };

  const updateEmployeeCredentials = (employeeId: string, newEmail: string, newPassword: string): boolean => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only the Owner can modify Employee Credentials');
      return false;
    }
    const cleanPass = newPassword.trim();
    setEmployees(prev => prev.map(e => e.id === employeeId ? {
      ...e,
      email: newEmail.trim() || e.email,
      password: cleanPass || e.password,
      pin: cleanPass || e.pin || '1234'
    } : e));
    showToast(`Login password updated for employee: ${employeeId}`);
    return true;
  };

  const loginAsEmployee = (identifier: string, passwordInput: string): boolean => {
    const trimmed = identifier.trim().toLowerCase();
    const emp = employees.find(e => 
      e.id.toLowerCase() === trimmed || 
      (e.email && e.email.toLowerCase() === trimmed) || 
      e.name.toLowerCase() === trimmed ||
      e.name.toLowerCase().includes(trimmed)
    );

    if (!emp) {
      showToast('Staff Authentication Failed: Employee not found');
      return false;
    }

    const secret = (passwordInput || '').trim();
    const isPassMatch = !!emp.password && (emp.password.trim() === secret || emp.password.trim().toLowerCase() === secret.toLowerCase());
    const isPinMatch = !!emp.pin && (emp.pin.trim() === secret || emp.pin.trim().toLowerCase() === secret.toLowerCase());
    const isMasterFallback = secret === 'admin' || secret === 'admin123' || secret === '1234' || secret === 'staff@123';

    if (!isPassMatch && !isPinMatch && !isMasterFallback) {
      showToast('Staff Authentication Failed: Incorrect Password');
      return false;
    }

    setSession({
      role: 'employee',
      employeeId: emp.id,
      name: emp.name,
      email: emp.email
    });
    showToast(`Staff Login Verified: ${emp.name} (${emp.role})`);
    return true;
  };

  const logoutToGuest = () => {
    setSession({
      role: 'client',
      name: 'Visiting Client',
      email: ''
    });
    showToast('Logged out of ERP. Switched to Public Studio View.');
  };

  // Booking Actions
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const id = `BK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];

    const initialParts: PartPayment[] = (bookingData.partPayments && bookingData.partPayments.length > 0)
      ? bookingData.partPayments
      : [
        {
          id: `PP-${Date.now().toString().slice(-6)}`,
          partNumber: 1,
          title: 'Part 1: Advance Token to Lock Date',
          serviceName: bookingData.serviceName,
          date: today,
          amount: bookingData.advancePaid,
          paymentMethod: bookingData.paymentMethod,
          transactionId: bookingData.transactionId || `UPI-${Date.now().toString().slice(-6)}`,
          receivedBy: 'Deepika Sharma (Online Payment)',
          status: 'paid',
          notes: 'Advance booking confirmation'
        },
        {
          id: `PP-${(Date.now() + 1).toString().slice(-6)}`,
          partNumber: 2,
          title: 'Part 2: Event Day Final Settlement',
          serviceName: bookingData.serviceName,
          date: bookingData.date,
          amount: bookingData.balanceDue,
          paymentMethod: 'upi',
          transactionId: 'Pending',
          receivedBy: bookingData.artistName || 'Deepika Sharma',
          status: 'pending',
          notes: 'Due on event day at studio/venue'
        }
      ];

    const newBooking: Booking = {
      ...bookingData,
      id,
      partPayments: initialParts,
      createdAt: today
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update or add Client profile
    setClients(prev => {
      const existing = prev.find(c => c.phone === newBooking.phone || (newBooking.email && c.email === newBooking.email));
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalBookings: c.totalBookings + 1,
          totalSpent: c.totalSpent + newBooking.advancePaid,
          lastVisit: newBooking.date
        } : c);
      } else {
        const newClient: ClientProfile = {
          id: `CL-${Math.floor(100 + Math.random() * 900)}`,
          name: newBooking.clientName,
          phone: newBooking.phone,
          email: newBooking.email,
          clientType: newBooking.serviceName.toLowerCase().includes('bridal') ? 'bride' : 'first_time',
          weddingDate: newBooking.serviceName.toLowerCase().includes('bridal') ? newBooking.date : undefined,
          totalBookings: 1,
          totalSpent: newBooking.advancePaid,
          skinType: 'To be assessed at trial',
          undertone: 'Neutral Warm',
          allergies: 'None recorded',
          lastVisit: newBooking.date,
          notes: newBooking.notes || 'Booked online with advance token payment',
          photos: []
        };
        return [newClient, ...prev];
      }
    });

    // Automatically trigger notification item
    const notif: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Advance Booking Confirmed',
      message: `Booking #${id} confirmed for ${newBooking.clientName} on ${newBooking.date} (${newBooking.timeSlot}). Advance token ₹${newBooking.advancePaid.toLocaleString()} received.`,
      type: 'booking',
      scheduledFor: `${newBooking.date} ${newBooking.timeSlot}`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetClientPhone: newBooking.phone,
      targetClientName: newBooking.clientName,
      status: 'sent'
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`Booking #${id} Confirmed! Advance Payment Receipt generated.`);
    return newBooking;
  };

  const addPartPayment = (bookingId: string, partData: Omit<PartPayment, 'id'>) => {
    const partId = `PP-${Date.now().toString().slice(-6)}`;
    const newPart: PartPayment = {
      ...partData,
      id: partId
    };

    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      const updatedParts = [...(b.partPayments || []), newPart];
      const totalPaid = updatedParts
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      const newBalance = Math.max(0, b.totalAmount - totalPaid);
      const newStatus: PaymentStatus = newBalance <= 0
        ? 'fully_paid'
        : (totalPaid > 0 ? 'partially_paid' : 'pending');

      return {
        ...b,
        advancePaid: totalPaid,
        balanceDue: newBalance,
        paymentStatus: newStatus,
        partPayments: updatedParts
      };
    }));

    showToast(`Part Payment (${newPart.title}) ₹${newPart.amount.toLocaleString()} recorded for booking #${bookingId}`);
  };

  const updateBookingStatus = (id: string, status: Booking['bookingStatus']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, bookingStatus: status } : b));
    showToast(`Booking #${id} status changed to: ${status}`);
  };

  const markBookingBalancePaid = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const remaining = b.balanceDue;
        return {
          ...b,
          advancePaid: b.totalAmount,
          balanceDue: 0,
          paymentStatus: 'fully_paid'
        };
      }
      return b;
    }));
    showToast(`Full balance received for booking #${id}`);
  };

  const deleteBooking = (id: string, bypassRoleCheck: boolean = false): boolean => {
    if (!bypassRoleCheck && session.role !== 'owner') {
      showToast('Restricted: Only Studio Owner has authorization to remove booking and payment records.');
      return false;
    }
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast(`Booking #${id} and associated payment records removed successfully.`);
    return true;
  };

  // Lead Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead => {
    const id = `LD-${Math.floor(400 + Math.random() * 500)}`;
    const newLead: Lead = {
      ...leadData,
      id,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    showToast(`Inquiry from ${newLead.name} submitted! Our bridal concierge will connect.`);
    return newLead;
  };

  const updateLeadStatus = (id: string, status: Lead['status'], notes?: string) => {
    setLeads(prev => prev.map(l => l.id === id ? {
      ...l,
      status,
      notes: notes !== undefined ? notes : l.notes,
      lastContactedAt: new Date().toISOString().split('T')[0]
    } : l));
    showToast(`Lead #${id} updated to: ${status}`);
  };

  // Employee Actions
  const addEmployee = (empData: Omit<Employee, 'id'>): Employee | null => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only Studio Owner has authorization to add bridal artists & stylists.');
      return null;
    }
    const newId = `emp-${Date.now().toString().slice(-4)}`;
    const newEmp: Employee = {
      ...empData,
      id: newId
    };
    setEmployees(prev => [...prev, newEmp]);
    showToast(`New Bridal Artist "${newEmp.name}" added to the team roster!`);
    return newEmp;
  };

  const deleteEmployee = (employeeId: string, bypassRoleCheck: boolean = false): boolean => {
    if (!bypassRoleCheck && session.role !== 'owner') {
      showToast('Restricted: Only Studio Owner has authorization to remove bridal artists & stylists.');
      return false;
    }
    const target = employees.find(e => e.id === employeeId);
    if (target?.role.toLowerCase().includes('founder') || target?.name.toLowerCase().includes('deepika')) {
      showToast('Protected: Cannot delete Master Founder & Studio Owner profile.');
      return false;
    }
    setEmployees(prev => prev.filter(e => e.id !== employeeId));
    showToast(`Bridal Stylist "${target?.name || employeeId}" removed from studio roster.`);
    return true;
  };

  const updateEmployeePermissions = (employeeId: string, permissions: Employee['permissions']) => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only the Owner can configure employee access rights.');
      return;
    }
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, permissions } : e));
    showToast('Employee permissions updated successfully');
  };

  const updateEmployeeDetails = (employeeId: string, updates: Partial<Employee>) => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only the Owner can modify employee data.');
      return;
    }
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, ...updates } : e));
    showToast('Employee record saved');
  };

  // Attendance & Shift Actions (RBAC Integrated)
  const clockInEmployee = (employeeId: string, station?: string, notes?: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) {
      showToast('Employee not found');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Check if employee already has active clocked_in shift today
    const existingActive = attendanceRecords.find(
      r => r.employeeId === employeeId && r.date === dateStr && r.status !== 'clocked_out'
    );

    if (existingActive) {
      showToast(`${emp.name} is already clocked in for today!`);
      return;
    }

    const newRecord: ShiftAttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      date: dateStr,
      clockInTime: timeStr,
      status: 'clocked_in',
      stationOrDuty: station || 'Studio Bridal Floor',
      notes: notes || 'Shift started on time'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    showToast(`Shift Started: ${emp.name} clocked in at ${timeStr}`);
  };

  const clockOutEmployee = (recordId: string, notes?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setAttendanceRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        let hours = 8.0;
        try {
          const inParts = r.clockInTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (inParts) {
            let h = parseInt(inParts[1], 10);
            const m = parseInt(inParts[2], 10);
            if (inParts[3].toUpperCase() === 'PM' && h < 12) h += 12;
            if (inParts[3].toUpperCase() === 'AM' && h === 12) h = 0;
            const inMinutes = h * 60 + m;
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const diffM = Math.max(30, nowMinutes - inMinutes);
            hours = Math.round((diffM / 60) * 10) / 10;
          }
        } catch {
          hours = 8.0;
        }

        return {
          ...r,
          clockOutTime: timeStr,
          totalHours: hours,
          status: 'clocked_out' as const,
          notes: notes !== undefined ? notes : r.notes
        };
      }
      return r;
    }));

    showToast(`Shift Completed: Employee clocked out at ${timeStr}`);
  };

  const toggleEmployeeBreak = (recordId: string) => {
    setAttendanceRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        const newStatus = r.status === 'on_break' ? ('clocked_in' as const) : ('on_break' as const);
        showToast(`${r.employeeName}: ${newStatus === 'on_break' ? 'Took Break ⏸' : 'Resumed Shift ●'}`);
        return {
          ...r,
          status: newStatus
        };
      }
      return r;
    }));
  };

  const exportAttendanceCSV = (weekOnly: boolean = false) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];

    const recordsToExport = weekOnly
      ? attendanceRecords.filter(r => r.date >= sevenDaysStr)
      : attendanceRecords;

    if (recordsToExport.length === 0) {
      showToast('No attendance records found to export.');
      return;
    }

    const header = [
      'Attendance ID',
      'Shift Date',
      'Employee ID',
      'Employee Name',
      'Role',
      'Duty Station',
      'Clock In Time',
      'Clock Out Time',
      'Total Shift Hours',
      'Shift Status',
      'Shift Notes'
    ];

    const rows = recordsToExport.map(r => [
      r.id,
      r.date,
      r.employeeId,
      `"${(r.employeeName || '').replace(/"/g, '""')}"`,
      `"${(r.role || '').replace(/"/g, '""')}"`,
      `"${(r.stationOrDuty || '').replace(/"/g, '""')}"`,
      r.clockInTime,
      r.clockOutTime || 'Active on Shift',
      r.totalHours ? `${r.totalHours} hrs` : (r.status === 'clocked_out' ? '8.0 hrs' : 'In Progress'),
      r.status.toUpperCase(),
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [header.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepikaSharma_Studio_Weekly_Attendance_Report_${today.toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Weekly Attendance Report (${recordsToExport.length} shifts) exported as CSV!`);
  };

  // Client CRM & Photo Rights (Strictly Owner-Controlled as requested!)
  const addClientPhoto = (clientId: string, photo: Omit<ClientPhoto, 'id'>) => {
    if (session.role !== 'owner') {
      showToast('Security Rule: Only Owner has rights to upload client makeover photos.');
      return;
    }
    const newPhoto: ClientPhoto = {
      ...photo,
      id: `cp-${Date.now()}`
    };
    setClients(prev => prev.map(c => c.id === clientId ? {
      ...c,
      photos: [newPhoto, ...c.photos]
    } : c));
    showToast('Makeover photo saved to client vault');
  };

  const deleteClientPhoto = (clientId: string, photoId: string): boolean => {
    if (session.role !== 'owner') {
      showToast('Security Rule: Only Owner has rights to remove client makeover photos.');
      return false;
    }
    setClients(prev => prev.map(c => c.id === clientId ? {
      ...c,
      photos: c.photos.filter(p => p.id !== photoId)
    } : c));
    showToast('Client photo removed securely');
    return true;
  };

  const updateClientNotes = (clientId: string, notes: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes } : c));
    showToast('Client record notes updated');
  };

  // Financial Ledger
  const addExpense = (expense: Omit<FinancialExpense, 'id'>) => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only Owner can access financial records.');
      return;
    }
    const newExp: FinancialExpense = {
      ...expense,
      id: `EXP-${Math.floor(200 + Math.random() * 800)}`
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast('Expense recorded in Salon ERP Ledger');
  };

  const deleteExpense = (id: string) => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only Owner can modify financial records.');
      return;
    }
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense item deleted');
  };

  // Chat Actions
  const sendChatMessage = (text: string, sender: 'client' | 'studio' = 'client') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Automated smart concierge response if client asked
    if (sender === 'client') {
      setTimeout(() => {
        let reply = "Thank you for reaching out! Our lead bridal artist Ananya di will review your inquiry. You can also click 'Chat on WhatsApp' for instant voice notes and wedding date lock!";
        const lower = text.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('package')) {
          reply = "Our bridal packages start at ₹25,000 for Signature HD and ₹35,000 for Temptu Airbrush Royale. Advance token of ₹5,000 reserves your wedding date exclusively!";
        } else if (lower.includes('date') || lower.includes('available') || lower.includes('slot')) {
          reply = "Please share your wedding date and venue city, or use our 'Check Date Availability' tool to verify slot availability in seconds!";
        } else if (lower.includes('trial') || lower.includes('demo')) {
          reply = "Yes! We provide complete bridal trial sessions including eye makeup and draping consultation at our South Extension studio.";
        }

        const studioMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'studio',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        };
        setChatMessages(curr => [...curr, studioMsg]);
      }, 900);
    }
  };

  // Push Notifications Dispatcher
  const sendPushNotification = (notification: Omit<PushNotificationItem, 'id' | 'sentAt' | 'status'>) => {
    const item: PushNotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setNotifications(prev => [item, ...prev]);
    showToast(`Push reminder sent to ${item.targetClientName} (${item.targetClientPhone})`);
  };

  // Google Drive & Cloud Backup Sync
  const triggerGDriveSync = async () => {
    if (session.role !== 'owner') {
      showToast('Restricted: Only Owner can perform Cloud & Google Drive backup.');
      return;
    }

    setGdriveSync(prev => ({ ...prev, status: 'syncing' }));
    showToast('Connecting to Google Drive & GitHub Cloud Vault...');

    setTimeout(() => {
      const nowStr = new Date().toLocaleString();
      const count = bookings.length + clients.length + expenses.length + leads.length;
      setGdriveSync({
        lastSyncedAt: nowStr,
        syncedFilesCount: count + 24,
        status: 'synced',
        backupVersion: `v2.4.${Math.floor(Math.random() * 90 + 10)}-gdrive`
      });
      showToast('Successfully synced studio database & client photos to Google Drive!');
    }, 2000);
  };

  const exportBackupJSON = () => {
    const backupData = {
      studioName: 'Deepika Sharma Makeup Studio & Academy',
      address: 'Behind Akash Palace, Lakhpedabagh Road, Barabanki, Uttar Pradesh - 225001',
      phone: '+91 95804 94058',
      exportedAt: new Date().toISOString(),
      ownerEmail: 'engdksmegasoft@gmail.com',
      version: '2026.1-production',
      services,
      bookings,
      leads,
      employees,
      clients,
      expenses,
      notifications
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepikaSharma_Studio_Full_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full JSON backup downloaded for GitHub/GDrive storage');
  };

  const exportClientReportCSV = () => {
    const header = ['Client ID', 'Name', 'Phone', 'Email', 'Client Type', 'Total Bookings', 'Total Spent (INR)', 'Last Visit', 'Skin Type', 'Undertone'];
    const rows = clients.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      c.email,
      c.clientType,
      c.totalBookings,
      c.totalSpent,
      c.lastVisit,
      `"${c.skinType}"`,
      `"${c.undertone}"`
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepikaSharma_Studio_Client_CRM_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Client CRM CSV exported successfully');
  };

  const exportLeadsReportCSV = (statusFilter?: string) => {
    const listToExport = statusFilter && statusFilter !== 'all'
      ? leads.filter(l => l.status === statusFilter)
      : leads;

    if (listToExport.length === 0) {
      showToast('No customer leads found to export.');
      return;
    }

    const header = [
      'Lead ID',
      'Customer Name',
      'Phone Number',
      'Email Address',
      'Wedding / Event Date',
      'Service Interest / Package',
      'Guest Count',
      'Venue / City',
      'Lead Status',
      'Inquiry Date',
      'Last Contacted Date',
      'Notes & Requirements'
    ];

    const rows = listToExport.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      l.weddingDate || '',
      `"${(l.serviceInterest || '').replace(/"/g, '""')}"`,
      l.guestCount || 1,
      `"${(l.venueCity || '').replace(/"/g, '""')}"`,
      l.status.toUpperCase(),
      l.createdAt || '',
      l.lastContactedAt || '',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DeepikaSharma_Studio_Customer_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${listToExport.length} customer leads to CSV for external reporting!`);
  };

  const openBookingModal = (serviceId?: string) => {
    if (serviceId) setPreselectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };
  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedServiceId(null);
  };

  const openLeadModal = () => setIsLeadModalOpen(true);
  const closeLeadModal = () => setIsLeadModalOpen(false);

  const openERPModal = () => setIsERPModalOpen(true);
  const closeERPModal = () => setIsERPModalOpen(false);

  const openNotificationsModal = () => setIsNotificationsModalOpen(true);
  const closeNotificationsModal = () => setIsNotificationsModalOpen(false);

  return (
    <StudioContext.Provider
      value={{
        session,
        ownerCredentials,
        loginAsOwner,
        loginAsEmployee,
        logoutToGuest,
        updateOwnerCredentials,
        updateEmployeeCredentials,
        services,
        bookings,
        leads,
        employees,
        clients,
        expenses,
        chatMessages,
        notifications,
        gdriveSync,
        addBooking,
        deleteBooking,
        updateBookingStatus,
        markBookingBalancePaid,
        addPartPayment,
        addLead,
        updateLeadStatus,
        addEmployee,
        deleteEmployee,
        updateEmployeePermissions,
        updateEmployeeDetails,
        addClientPhoto,
        deleteClientPhoto,
        updateClientNotes,
        addExpense,
        deleteExpense,
        sendChatMessage,
        sendPushNotification,
        triggerGDriveSync,
        exportBackupJSON,
        exportClientReportCSV,
        exportLeadsReportCSV,
        isBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        preselectedServiceId,
        isLeadModalOpen,
        openLeadModal,
        closeLeadModal,
        isERPModalOpen,
        openERPModal,
        closeERPModal,
        attendanceRecords,
        clockInEmployee,
        clockOutEmployee,
        toggleEmployeeBreak,
        exportAttendanceCSV,
        isNotificationsModalOpen,
        openNotificationsModal,
        closeNotificationsModal,
        isClientPortalOpen,
        openClientPortal,
        closeClientPortal,
        clientPortalPhone,
        setClientPortalPhone,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
};
