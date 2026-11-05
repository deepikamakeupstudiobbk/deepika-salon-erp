/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Phone, Instagram, Calendar, Award, Star, ExternalLink, Trash2, ShieldCheck, X, UserPlus, Lock } from 'lucide-react';
import { Employee } from '../types';

export const TeamSection: React.FC = () => {
  const { employees, openBookingModal, session, addEmployee, deleteEmployee, openERPModal, loginAsOwner, showToast } = useStudio();
  const isOwner = session.role === 'owner';

  // Inline delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Quick Owner Auth Modal State
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);
  const [ownerPassInput, setOwnerPassInput] = useState('admin');

  // State for Add Stylist Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Senior Bridal Makeup & Hair Artist');
  const [newPhone, setNewPhone] = useState('+91 95804 94058');
  const [newEmail, setNewEmail] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('HD Bridal Airbrush, Dupatta Pinning & South/North Indian Hair Styling');
  const [newSocialHandle, setNewSocialHandle] = useState('@deepikasharma_team');
  const [newInstagramUrl, setNewInstagramUrl] = useState('https://instagram.com/deepikasharmamakeupstudio');
  const [newAvatar, setNewAvatar] = useState('https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600');
  const [newSalary, setNewSalary] = useState('22000');
  const [newCommission, setNewCommission] = useState('10');
  const [newPassword, setNewPassword] = useState('staff@123');
  const [newConfirmPassword, setNewConfirmPassword] = useState('staff@123');

  const avatarOptions = [
    { label: 'Bridal Makeover', url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600' },
    { label: 'Reception Glam', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=600' },
    { label: 'Haldi Glow', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600' },
    { label: 'Editorial Look', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600' }
  ];

  const handleAddStylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Please provide at least a full name and contact number for the artist.');
      return;
    }

    if (newPassword.trim() !== newConfirmPassword.trim()) {
      showToast('Passwords do not match! Please verify Set Password and Confirm Password.');
      return;
    }

    if (!newPassword.trim()) {
      showToast('Please provide a valid login password for the staff member.');
      return;
    }

    const cleanPass = newPassword.trim();

    addEmployee({
      id: `emp-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Senior Bridal Stylist',
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@deepikastudio.in`,
      avatar: newAvatar,
      specialty: newSpecialty.trim() || 'Bridal Artistry & Styling',
      monthlySalary: parseFloat(newSalary) || 20000,
      commissionRate: parseFloat(newCommission) || 10,
      assignedBookingsCount: 0,
      socialHandle: newSocialHandle.trim() || '@deepikasharmamakeupstudio',
      instagramUrl: newInstagramUrl.trim() || 'https://instagram.com/deepikasharmamakeupstudio',
      active: true,
      pin: cleanPass,
      password: cleanPass,
      permissions: {
        canViewClients: true,
        canViewPhones: true,
        canManageBookings: true,
        canAccessERP: false,
        canManagePhotos: false
      }
    });

    setNewName('');
    setIsAddModalOpen(false);
    showToast(`Successfully added ${newName.trim()} to studio roster!`);
  };

  const handleRequestDelete = (employee: Employee) => {
    if (employee.role.toLowerCase().includes('founder') || employee.name.toLowerCase().includes('deepika')) {
      showToast('Protected: Cannot delete Master Founder & Studio Owner Deepika Sharma.');
      return;
    }
    if (!isOwner) {
      setIsOwnerAuthModalOpen(true);
      return;
    }
    setConfirmDeleteId(employee.id);
  };

  const handleConfirmDelete = (empId: string) => {
    deleteEmployee(empId, true);
    setConfirmDeleteId(null);
    showToast('Stylist successfully removed from roster.');
  };

  const handleQuickOwnerUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = loginAsOwner(ownerPassInput, 'admin');
    if (success) {
      setIsOwnerAuthModalOpen(false);
      showToast('Owner access verified! You can now add and remove stylists.');
    } else {
      showToast('Incorrect master password. Try "admin".');
    }
  };

  return (
    <section id="artists" className="py-16 sm:py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-amber-400 font-medium mb-3">
              <span>Meet The Artisans</span>
              <span aria-hidden="true">·</span>
              <span>Certified International Masters</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-100">
              Our Bridal Artists & Stylists
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-xl font-light">
              Each artist in our studio has undergone rigorous certification in high-definition airbrushing, traditional jewellery setting, and high-pressure bridal ceremony coordination.
            </p>
          </div>

          {/* Owner Control Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isOwner ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner Rights Active</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Add New Artist</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOwnerAuthModalOpen(true)}
                  className="flex items-center gap-2 text-xs text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/50 px-4 py-2.5 rounded-xl transition-all font-semibold cursor-pointer shadow-sm"
                  title="Unlock Owner Controls to add or remove stylists"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner Mode (Add / Remove Stylists)</span>
                </button>
                <button
                  type="button"
                  onClick={openERPModal}
                  className="flex items-center gap-2 text-xs text-stone-400 hover:text-amber-300 bg-stone-900 hover:bg-stone-850 border border-stone-800 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                  title="Open Full Salon ERP"
                >
                  <span>Open ERP</span>
                </button>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-2 text-xs text-stone-400 bg-stone-900 border border-stone-800 px-4 py-2.5 rounded-xl">
              <Award className="w-4 h-4 text-amber-400" />
              <span>London & Mumbai Certified</span>
            </div>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((employee: Employee) => {
            const isFounder = employee.role.toLowerCase().includes('founder') || employee.name.toLowerCase().includes('deepika');

            return (
              <div
                key={employee.id}
                className="flex flex-col justify-between rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 p-5 transition-all duration-300 shadow-lg group relative"
              >
                {/* Owner Delete Stylist Button */}
                {!isFounder && (
                  confirmDeleteId === employee.id ? (
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-stone-950 border border-rose-500/80 p-1.5 rounded-xl shadow-2xl animate-in fade-in zoom-in-95">
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(employee.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Confirm Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 text-stone-400 hover:text-white text-[10px] rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(employee)}
                      className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-stone-950/80 hover:bg-rose-950 text-stone-400 hover:text-rose-300 border border-stone-800 hover:border-rose-700/80 transition-colors cursor-pointer"
                      title={isOwner ? `Owner: Remove ${employee.name}` : `Unlock Owner Access to remove ${employee.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}

                <div className="space-y-4">
                  {/* Avatar */}
                  <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-amber-500 to-rose-400 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-stone-950 border border-amber-400 flex items-center justify-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="text-center space-y-1">
                    <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-amber-200 transition-colors">
                      {employee.name}
                    </h3>
                    <p className="text-xs font-medium text-amber-300">
                      {employee.role}
                    </p>
                    <p className="text-[11px] text-stone-400 leading-snug pt-1">
                      {employee.specialty}
                    </p>
                  </div>

                  {/* Contact & Social Links */}
                  <div className="pt-2 border-t border-stone-800/80 space-y-2 text-xs">
                    <a
                      href={`tel:${employee.phone.replace(/\s+/g, '')}`}
                      className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 hover:bg-stone-950 text-stone-300 hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-mono text-[11px]">{employee.phone}</span>
                      </span>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">Call</span>
                    </a>

                    <a
                      href={employee.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 hover:bg-rose-950/40 text-stone-300 hover:text-rose-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Instagram className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[11px] font-medium">{employee.socialHandle}</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-stone-400" />
                    </a>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-4 mt-4 border-t border-stone-800">
                  <button
                    onClick={() => openBookingModal()}
                    className="w-full py-2.5 px-3 text-xs font-semibold uppercase tracking-wider bg-stone-800 hover:bg-amber-400 text-stone-200 hover:text-stone-950 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book with {employee.name.split(' ')[0]}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ADD STYLIST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white">
                    Add New Bridal Artist / Stylist
                  </h3>
                  <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono">
                    Owner Exclusive Authorization
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-850 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStylistSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="text-[11px] text-stone-300 font-medium block mb-1">
                  Artist Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Mishra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Bridal Makeup Artist"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 95804 94058"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-300 font-medium block mb-1">
                  Artistry Specialty & Expertise
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. HD Airbrush Base, Royal Mathapatti Setting & Saree Draping"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@ananya_makeup_bbk"
                    value={newSocialHandle}
                    onChange={(e) => setNewSocialHandle(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Set Login Password *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ananya@123"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="text-[11px] text-stone-300 font-medium block mb-1.5">
                  Portfolio Avatar Photo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {avatarOptions.map((opt) => (
                    <button
                      key={opt.url}
                      type="button"
                      onClick={() => setNewAvatar(opt.url)}
                      className={`p-1 rounded-xl border text-center transition-all cursor-pointer ${
                        newAvatar === opt.url
                          ? 'border-amber-400 bg-amber-950/40'
                          : 'border-stone-800 bg-stone-900 hover:border-stone-700'
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-14 h-14 rounded-lg object-cover mx-auto" referrerPolicy="no-referrer" />
                      <span className="text-[9px] text-stone-300 block truncate mt-1">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Monthly Base Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-300 font-medium block mb-1">
                    Commission Cut (%)
                  </label>
                  <input
                    type="number"
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
                    className="w-full p-2 rounded-lg bg-stone-900 border border-stone-700 text-emerald-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Confirm & Add Stylist
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* QUICK OWNER AUTH MODAL */}
      {isOwnerAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white">Owner Authorization</h3>
                  <p className="text-[10px] text-amber-400 font-mono">Deepika Sharma Studio Access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOwnerAuthModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-900 hover:bg-stone-850 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Adding and removing bridal stylists from the official studio roster is restricted to Studio Owner <strong>Deepika Sharma</strong>.
            </p>

            <form onSubmit={handleQuickOwnerUnlock} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] text-stone-400 block mb-1">Owner Master Password</label>
                <input
                  type="password"
                  value={ownerPassInput}
                  onChange={(e) => setOwnerPassInput(e.target.value)}
                  placeholder="admin"
                  className="w-full p-2.5 rounded-lg bg-stone-900 border border-stone-700 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">Default super admin password: <span className="font-mono text-amber-300">admin</span></span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOwnerAuthModalOpen(false)}
                  className="px-3 py-2 text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow cursor-pointer"
                >
                  Unlock Owner Rights
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
