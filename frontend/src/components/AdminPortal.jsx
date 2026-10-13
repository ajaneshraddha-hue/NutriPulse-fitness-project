import React, { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  Image,
  Sparkles,
  Save,
  CheckCircle,
  Users,
  Dumbbell,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  Eye,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Send,
  MessageSquare,
  LogOut,
  Copy
} from 'lucide-react';

export default function AdminPortal({
  currentAdmin,
  onAdminUpdate,
  onSwitchToCustomer,
  onLogoutAdmin
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'members', 'templates', 'register'
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [members, setMembers] = useState([]);
  const [copiedTemplate, setCopiedTemplate] = useState('');

  // Form state for current admin profile edit
  const [profileForm, setProfileForm] = useState({
    id: currentAdmin?.id || 1,
    gym_name: currentAdmin?.gym_name || '',
    logo_url: currentAdmin?.logo_url || '',
    whatsapp_number: currentAdmin?.whatsapp_number || '',
    address: currentAdmin?.address || '',
    city: currentAdmin?.city || '',
    tagline: currentAdmin?.tagline || '',
    ai_coach_name: currentAdmin?.ai_coach_name || '',
    ai_greeting: currentAdmin?.ai_greeting || ''
  });

  // Preset Logos
  const presetLogos = [
    { label: 'Gold / Elite Gym', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80' },
    { label: 'Iron & Crossfit', url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&auto=format&fit=crop&q=80' },
    { label: 'Modern Wellness', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&auto=format&fit=crop&q=80' },
    { label: 'Athletic Studio', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80' }
  ];

  useEffect(() => {
    if (currentAdmin) {
      setProfileForm({
        id: currentAdmin.id,
        gym_name: currentAdmin.gym_name || '',
        logo_url: currentAdmin.logo_url || '',
        whatsapp_number: currentAdmin.whatsapp_number || '',
        address: currentAdmin.address || '',
        city: currentAdmin.city || '',
        tagline: currentAdmin.tagline || '',
        ai_coach_name: currentAdmin.ai_coach_name || '',
        ai_greeting: currentAdmin.ai_greeting || ''
      });
      fetchMembers(currentAdmin.id);
    }
  }, [currentAdmin]);

  const fetchMembers = async (adminId) => {
    try {
      const res = await fetch(`/api/admin/members?adminId=${adminId}`);
      const data = await res.json();
      if (data.members) setMembers(data.members);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();

      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Club settings and WhatsApp configuration updated in database!' });
        if (onAdminUpdate) onAdminUpdate(data.admin);
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to update.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server connection error.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(key);
    setTimeout(() => setCopiedTemplate(''), 2500);
  };

  const cleanPhone = (profileForm.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
  const testWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${profileForm.ai_coach_name || profileForm.gym_name + ' Coach'}! Testing WhatsApp AI integration for ${profileForm.gym_name}.`)}`;

  // Quick outreach templates
  const broadcastTemplates = [
    {
      key: 'weight',
      title: 'Weekly Weight & Progress Check-In',
      message: `Namaste from ${profileForm.gym_name}! 🏋️‍♂️ Time for our weekly weigh-in. Please log your current morning weight in the portal so your NutriPulse AI Coach can recalibrate your calorie targets for the week ahead!`
    },
    {
      key: 'hydration',
      title: 'Afternoon Hydration & Protein Nudge',
      message: `Quick reminder from ${profileForm.ai_coach_name || 'Coach'}: Midday metabolism slowdown? Drink 500ml water and grab a handful of roasted makhana or Greek curd with nuts to stay steady!`
    },
    {
      key: 'restaurant',
      title: 'Weekend Dining-Out Strategy',
      message: `Planning dinner out tonight? Remember the ${profileForm.gym_name} strategy: Pick dry tandoori items (Paneer or Chicken Tikka) and plain Phulka over Butter Naan to preserve your deficit!`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-emerald-400 rounded-md uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Partner Admin Gateway</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Enterprise Isolation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {profileForm.gym_name || 'Partner Management Console'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure your brand identity, address, WhatsApp AI coach number, and monitor client adherence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchToCustomer}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition"
          >
            <Eye className="w-4 h-4" />
            <span>Open Member Portal View</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl transition border border-slate-200"
            title="Lock & Exit Admin Console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out Admin</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMsg.text && (
        <div
          className={`mt-4 p-4 rounded-xl flex items-center justify-between text-sm ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg({ type: '', text: '' })}
            className="text-xs font-semibold underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3.5 text-sm font-semibold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Club Setup & WhatsApp Config</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 px-3.5 text-sm font-semibold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'members'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Enrolled Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-3.5 text-sm font-semibold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'templates'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Broadcast Templates</span>
        </button>
      </div>

      {/* TAB 1: EDIT CLUB & WHATSAPP SETTINGS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Identity & WhatsApp AI Number Configuration</span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Saved directly to the SQLite database. Updates immediately reflect on your members' WhatsApp Coach button.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Fitness Center / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.gym_name}
                    onChange={e => setProfileForm({ ...profileForm, gym_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    WhatsApp AI Coach Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.whatsapp_number}
                    onChange={e => setProfileForm({ ...profileForm, whatsapp_number: e.target.value })}
                    placeholder="+91 98801 23456"
                    className="w-full px-3 py-2 border border-emerald-300 bg-emerald-50/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Brand Logo Image URL
                </label>
                <input
                  type="url"
                  value={profileForm.logo_url}
                  onChange={e => setProfileForm({ ...profileForm, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-500">Preset logo:</span>
                  {presetLogos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, logo_url: p.url })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Full Physical Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.address}
                    onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    WhatsApp AI Coach Persona
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    AI Coach Name (Shown to Members)
                  </label>
                  <input
                    type="text"
                    value={profileForm.ai_coach_name}
                    onChange={e => setProfileForm({ ...profileForm, ai_coach_name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Welcome Greeting on WhatsApp
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.ai_greeting}
                    onChange={e => setProfileForm({ ...profileForm, ai_greeting: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Club Settings to Database</span>
              </button>
            </form>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Live Member App Preview
              </span>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={profileForm.logo_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80'}
                    alt="Logo"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-base leading-tight truncate">
                      {profileForm.gym_name || 'Fitness Hub'}
                    </h3>
                    <p className="text-xs text-emerald-300 font-medium truncate mt-0.5">
                      {profileForm.tagline}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="truncate">{profileForm.address}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned WhatsApp Coach:</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {profileForm.ai_coach_name || 'AI Coach'}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 block mt-0.5">
                      {profileForm.whatsapp_number}
                    </span>
                  </div>

                  <a
                    href={testWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    <span>Test Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLED MEMBERS */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900">Enrolled Members</h2>
              <p className="text-xs text-slate-500">
                Track client calorie targets, Indian food logs, burned workouts, and daily hydration.
              </p>
            </div>
            <button
              onClick={() => fetchMembers(currentAdmin.id)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Goal & Diet</th>
                  <th className="py-3 px-4">Weight Baseline</th>
                  <th className="py-3 px-4">Daily Target</th>
                  <th className="py-3 px-4">Consumed Today</th>
                  <th className="py-3 px-4">Burned (Workout)</th>
                  <th className="py-3 px-4">Water Today</th>
                  <th className="py-3 px-4">Safety Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No members registered under this partner hub yet.
                    </td>
                  </tr>
                ) : (
                  members.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-slate-400">{member.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-emerald-700">{member.goal}</span>
                        <span className="block text-[11px] text-slate-500">{member.diet_type} ({member.cuisine})</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {member.current_weight} kg <span className="text-slate-400">→ {member.target_weight} kg</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {member.calorie_target || 1850} kcal
                        <span className="block text-[10px] text-slate-400">Protein: {member.protein_target}g</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                          {member.calories_logged_today} kcal
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-rose-600 font-bold">
                        {member.workout_burned_today || 0} kcal
                      </td>
                      <td className="py-3.5 px-4 font-medium text-blue-600">
                        {member.water_logged_today ? (member.water_logged_today / 1000).toFixed(1) : 0} L / {member.water_target || 3.2} L
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          member.safety_flag === 'Green' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {member.safety_flag}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WHATSAPP BROADCAST TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="max-w-4xl space-y-5 mt-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              WhatsApp Broadcast & Member Outreach Templates
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Copy pre-formatted messages to send directly to your members through WhatsApp Business.
            </p>

            <div className="space-y-4">
              {broadcastTemplates.map(t => (
                <div key={t.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{t.title}</span>
                    <button
                      onClick={() => copyToClipboard(t.message, t.key)}
                      className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
                    >
                      {copiedTemplate === t.key ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 font-mono leading-relaxed">
                    {t.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
