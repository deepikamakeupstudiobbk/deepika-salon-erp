import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  X,
  Bell,
  Send,
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  Sparkles,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { PushNotificationItem } from '../types';

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationsModalOpen,
    closeNotificationsModal,
    notifications,
    sendPushNotification,
    bookings,
    clients
  } = useStudio();

  const [selectedClientName, setSelectedClientName] = useState<string>(bookings[0]?.clientName || '');
  const [selectedClientPhone, setSelectedClientPhone] = useState<string>(bookings[0]?.phone || '');
  const [reminderType, setReminderType] = useState<PushNotificationItem['type']>('reminder');
  const [customMessage, setCustomMessage] = useState<string>('');

  if (!isNotificationsModalOpen) return null;

  const reminderTemplates = {
    reminder: 'Namaste! Friendly reminder of your bridal styling appointment tomorrow. Our artist team will be ready with sanitized brushes and 4K airbrush setup.',
    prep: 'Dear Bride, your wedding day approaches! Please hydrate with 3L water, cleanse gently tonight, and keep your lehenga/saree ironed on-site.',
    payment: 'Reminder: Balance payment of your bridal booking is due upon makeover completion. Online UPI / Card / Cash accepted.',
    booking: 'Your bridal session has been confirmed in our studio ledger. Looking forward to making you glow!'
  };

  const handleSelectClient = (name: string) => {
    setSelectedClientName(name);
    const foundBk = bookings.find(b => b.clientName === name);
    if (foundBk) setSelectedClientPhone(foundBk.phone);
  };

  const handleDispatchNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientName || !selectedClientPhone) {
      alert('Please specify a client name and contact number');
      return;
    }

    const titleMap = {
      reminder: 'Upcoming Appointment & Venue Timing Reminder',
      prep: 'Pre-Bridal Skincare & Draping Checklist',
      payment: 'Balance Payment Due Reminder',
      booking: 'Booking Update & Artist Allotment'
    };

    sendPushNotification({
      title: titleMap[reminderType],
      message: customMessage || reminderTemplates[reminderType],
      type: reminderType,
      scheduledFor: 'Immediate Dispatch (Live Push)',
      targetClientName: selectedClientName,
      targetClientPhone: selectedClientPhone
    });

    setCustomMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
              <Bell className="w-3.5 h-3.5" />
              <span>Studio Automation Suite</span>
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-white mt-0.5">
              Client Push Notifications & Appointment Reminders
            </h2>
          </div>

          <button
            onClick={closeNotificationsModal}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Dispatcher Form */}
          <form onSubmit={handleDispatchNotification} className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-4">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
              Send Live Push & SMS/WhatsApp Notification to Bride
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-stone-400">Select Client / Bride</label>
                <select
                  value={selectedClientName}
                  onChange={(e) => handleSelectClient(e.target.value)}
                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.clientName}>
                      {b.clientName} ({b.date} · {b.serviceName.slice(0, 20)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-stone-400">Reminder Template</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="w-full p-2 rounded bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="reminder">24h Upcoming Appointment Reminder</option>
                  <option value="prep">Pre-Bridal Skin Prep & Draping Advisory</option>
                  <option value="payment">Balance Payment Reminder</option>
                  <option value="booking">Booking Confirmation Notice</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-stone-400">Notification Message (Pre-filled from template or edit)</label>
              <textarea
                rows={2}
                value={customMessage || reminderTemplates[reminderType]}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-2.5 rounded bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400 font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recipient: <strong className="text-stone-200">{selectedClientPhone}</strong></span>
              </span>

              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Reminder</span>
              </button>
            </div>
          </form>

          {/* Activity Stream of Sent & Scheduled Reminders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider text-stone-300">
                Recent Notification Log ({notifications.length})
              </span>
              <span>Real-time Cloud Queue</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl bg-stone-900 border border-stone-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        · {n.targetClientName} ({n.targetClientPhone})
                      </span>
                    </div>
                    <p className="text-stone-300 text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-mono block mb-1">
                      {n.status === 'sent' ? 'Dispatched' : 'Scheduled'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {n.sentAt || n.scheduledFor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
