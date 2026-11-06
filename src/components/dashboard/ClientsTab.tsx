import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Camera, Sparkles, User, Phone, Mail, ShieldCheck } from 'lucide-react';

export const ClientsTab: React.FC = () => {
  const { clients, addClientPhoto, showToast } = useStudio();
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  
  // File upload state
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-white">Client Records & Regulars</h2>
          <p className="text-xs text-stone-400">Manage VIP bridal profiles, consultation notes, and photo vaults.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client List */}
        <div className="space-y-2 bg-stone-900 p-4 rounded-2xl border border-stone-800 h-fit">
          <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block px-1">
            Registered Clients ({clients.length})
          </span>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {clients.map((client) => {
              const isSelected = client.id === activeClient?.id;
              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow'
                      : 'bg-stone-950 hover:bg-stone-850 text-stone-200 border-stone-800'
                  }`}
                >
                  <div>
                    <strong className="block text-xs">{client.name}</strong>
                    <span className={`text-[10px] font-mono block ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                      {client.phone}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                    isSelected ? 'bg-stone-950 text-amber-300' : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    {client.category || 'VIP'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Client Details & Photo Vault with File Picker */}
        <div className="lg:col-span-2 space-y-5 bg-stone-900 p-6 rounded-2xl border border-stone-800">
          {activeClient ? (
            <>
              {/* Client Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-white">{activeClient.name}</h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">
                    {activeClient.phone} · {activeClient.email || 'no-email@studio.com'}
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono">
                  <span className="text-[10px] uppercase text-stone-400 block">Lifetime Spend</span>
                  <strong className="text-emerald-400 text-sm font-bold">
                    ₹{(activeClient.totalSpend || 33000).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Skin Profile Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Skin Type</span>
                  <strong className="text-white block mt-0.5">{activeClient.skinType || 'Combination / Sensitive'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Undertone</span>
                  <strong className="text-amber-300 block mt-0.5">{activeClient.undertone || 'Warm Golden'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Allergies / Notes</span>
                  <strong className="text-rose-300 block mt-0.5">{activeClient.allergies || 'Fragrance-free primers only'}</strong>
                </div>
              </div>

              {/* OWNER QUICK UPLOAD SECTION WITH FILE PICKER */}
              <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/40 space-y-3">
                <h4 className="font-serif-luxury text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Owner Quick Upload: Add New Makeover Photo</span>
                </h4>
                <p className="text-[11px] text-stone-400">
                  Select image files directly from your device or Google Drive sync folder.
                </p>

                <div className="space-y-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-stone-300">Choose Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPhotoUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-stone-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-stone-950 hover:file:bg-amber-300 cursor-pointer bg-stone-900 border border-stone-800 rounded-xl p-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-stone-300">Look Title / Description</label>
                    <input
                      type="text"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="e.g. Wedding Pheras Royal Look"
                      className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!photoUrl) {
                        showToast('Please choose an image file first!');
                        return;
                      }
                      addClientPhoto(activeClient.id, {
                        url: photoUrl,
                        title: photoTitle || 'Bridal Vault Look',
                        date: new Date().toISOString().split('T')[0],
                        category: 'Studio Vault',
                        verifiedConsent: true
                      });
                      setPhotoUrl('');
                      setPhotoTitle('');
                      showToast('Makeover photo uploaded successfully to client vault!');
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Save to Client Vault
                  </button>
                </div>
              </div>

              {/* Existing Photos Grid */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block">
                  Archived Makeover Photos ({activeClient.photos?.length || 0})
                </span>
                {(!activeClient.photos || activeClient.photos.length === 0) ? (
                  <div className="p-8 text-center bg-stone-950 rounded-xl border border-stone-800 text-stone-500 text-xs">
                    No makeover photos archived for this client yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeClient.photos.map((photo) => (
                      <div key={photo.id} className="rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                        <img src={photo.url} alt={photo.title} className="w-full h-40 object-cover object-top" />
                        <div className="p-2.5 text-xs">
                          <strong className="text-white block">{photo.title}</strong>
                          <span className="text-[10px] text-stone-400 font-mono">{photo.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-stone-500">Select a client from the list.</div>
          )}
        </div>
      </div>
    </div>
  );
};
