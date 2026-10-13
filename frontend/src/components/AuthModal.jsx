import React, { useState } from 'react';
import {
  User,
  Building2,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'customer-login', // 'customer-login', 'customer-register', 'admin-login', 'admin-register'
  gymsList = [],
  onLoginSuccess
}) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Customer Login Form
  const [custLoginForm, setCustLoginForm] = useState({
    email: 'rahul.sharma@example.com',
    password: 'user123'
  });

  // Customer Multi-step Register Form
  const [step, setStep] = useState(1);
  const [custRegForm, setCustRegForm] = useState({
    name: '',
    email: '',
    password: '',
    gym_id: gymsList[0]?.id || 1,
    phone: '',
    age: 28,
    sex: 'Male',
    height: 175,
    current_weight: 78,
    target_weight: 70,
    waist: 88,
    activity_level: 'Moderate',
    workout_frequency: 4,
    goal: 'Fat-loss',
    diet_type: 'Vegetarian',
    cuisine: 'North Indian',
    allergies: 'None',
    health_condition: 'None'
  });

  // Admin Login Form
  const [adminLoginForm, setAdminLoginForm] = useState({
    email: 'apex@nutripulse.in',
    password: 'admin123'
  });

  // Admin Register Form
  const [adminRegForm, setAdminRegForm] = useState({
    gym_name: '',
    email: '',
    password: '',
    whatsapp_number: '+91 ',
    address: '',
    city: 'Bengaluru',
    logo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
    tagline: 'Elite Science-Backed Performance',
    ai_coach_name: '',
    ai_greeting: ''
  });

  if (!isOpen) return null;

  const generateAdminPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setAdminRegForm(p => ({ ...p, password: pwd }));
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custLoginForm)
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess('customer', data.customer, data.gym, data.profile);
        onClose();
      } else {
        setErrorMsg(data.error || 'Login failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custRegForm)
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess('customer', data.customer, data.gym, data.profile);
        onClose();
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminLoginForm)
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess('admin', null, data.admin, null, data.token);
        onClose();
      } else {
        setErrorMsg(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminRegForm)
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess('admin', null, data.admin, null, data.token);
        onClose();
      } else {
        setErrorMsg(data.error || 'Admin registration failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Portal Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => { setMode('customer-login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode.startsWith('customer')
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Member Portal</span>
          </button>

          <button
            onClick={() => { setMode('admin-login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode.startsWith('admin')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Admin Gateway</span>
          </button>
        </div>

        {/* Error message notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 1. CUSTOMER LOGIN */}
        {/* ------------------------------------------------------------- */}
        {mode === 'customer-login' && (
          <div>
            <div className="mb-5">
              <h3 className="text-xl font-extrabold text-slate-900">Member Sign In</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Access your personalized Indian nutrition plan & WhatsApp coach.
              </p>
            </div>

            <form onSubmit={handleCustomerLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={custLoginForm.email}
                    onChange={e => setCustLoginForm({ ...custLoginForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={custLoginForm.password}
                    onChange={e => setCustLoginForm({ ...custLoginForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>

              <div className="text-center pt-2 text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('customer-register'); setStep(1); setErrorMsg(''); }}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Create Account & Diet Plan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. CUSTOMER REGISTRATION (3-STEP GUIDED ONBOARDING) */}
        {/* ------------------------------------------------------------- */}
        {mode === 'customer-register' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Step {step} of 3
                </span>
                <span className="text-xs text-slate-400">NutriPulse Onboarding</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                {step === 1 && 'Account & Fitness Club'}
                {step === 2 && 'Body Metrics & Baseline'}
                {step === 3 && 'Diet Preference & Health Screen'}
              </h3>
            </div>

            <form onSubmit={step === 3 ? handleCustomerRegister : e => { e.preventDefault(); setStep(s => s + 1); }} className="space-y-3.5 text-xs">
              
              {/* Step 1: Account credentials & Club */}
              {step === 1 && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={custRegForm.name}
                      onChange={e => setCustRegForm({ ...custRegForm, name: e.target.value })}
                      placeholder="e.g. Priya Patel"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={custRegForm.email}
                      onChange={e => setCustRegForm({ ...custRegForm, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={custRegForm.password}
                      onChange={e => setCustRegForm({ ...custRegForm, password: e.target.value })}
                      placeholder="Choose password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Select Partner Fitness Hub *</label>
                    <select
                      value={custRegForm.gym_id}
                      onChange={e => setCustRegForm({ ...custRegForm, gym_id: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                    >
                      {gymsList.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.gym_name} ({g.city} • WhatsApp: {g.whatsapp_number})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Step 2: Body Baseline */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Age</label>
                      <input
                        type="number"
                        value={custRegForm.age}
                        onChange={e => setCustRegForm({ ...custRegForm, age: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Biological Sex</label>
                      <select
                        value={custRegForm.sex}
                        onChange={e => setCustRegForm({ ...custRegForm, sex: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={custRegForm.height}
                        onChange={e => setCustRegForm({ ...custRegForm, height: Number(e.target.value) })}
                        className="w-full px-2.5 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={custRegForm.current_weight}
                        onChange={e => setCustRegForm({ ...custRegForm, current_weight: Number(e.target.value) })}
                        className="w-full px-2.5 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Target (kg)</label>
                      <input
                        type="number"
                        value={custRegForm.target_weight}
                        onChange={e => setCustRegForm({ ...custRegForm, target_weight: Number(e.target.value) })}
                        className="w-full px-2.5 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Activity Level</label>
                      <select
                        value={custRegForm.activity_level}
                        onChange={e => setCustRegForm({ ...custRegForm, activity_level: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="Sedentary / Sitting">Desk Job / Sitting</option>
                        <option value="Light">Lightly Active</option>
                        <option value="Moderate">Moderate Exercise</option>
                        <option value="Very Active">Very Active Athlete</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Workouts / Week</label>
                      <input
                        type="number"
                        value={custRegForm.workout_frequency}
                        onChange={e => setCustRegForm({ ...custRegForm, workout_frequency: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Diet & Health Screen */}
              {step === 3 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Fitness Goal</label>
                      <select
                        value={custRegForm.goal}
                        onChange={e => setCustRegForm({ ...custRegForm, goal: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                      >
                        <option value="Fat-loss">Fat-loss (Deficit)</option>
                        <option value="Muscle-support">Muscle Gain (Hypertrophy)</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Performance">Athletic Performance</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Diet Pattern</label>
                      <select
                        value={custRegForm.diet_type}
                        onChange={e => setCustRegForm({ ...custRegForm, diet_type: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                      >
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-vegetarian">Non-vegetarian</option>
                        <option value="Eggetarian">Eggetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Jain">Jain (No Root Veg)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Cuisine Style</label>
                      <select
                        value={custRegForm.cuisine}
                        onChange={e => setCustRegForm({ ...custRegForm, cuisine: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                      >
                        <option value="North Indian">North Indian (Rotis/Dals)</option>
                        <option value="South Indian">South Indian (Idli/Dosa/Sambar)</option>
                        <option value="Mixed">Mixed Indian</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Allergies (if any)</label>
                      <input
                        type="text"
                        value={custRegForm.allergies}
                        onChange={e => setCustRegForm({ ...custRegForm, allergies: e.target.value })}
                        placeholder="e.g. Peanuts, Gluten, Dairy"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Health Screening Flag (PDF Section 4)</label>
                    <select
                      value={custRegForm.health_condition}
                      onChange={e => setCustRegForm({ ...custRegForm, health_condition: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    >
                      <option value="None">None (General Wellness - Green)</option>
                      <option value="Blood sugar / diabetes">Blood Sugar / Pre-diabetes (Caution - Yellow)</option>
                      <option value="Blood pressure">Blood Pressure / Hypertension (Caution - Yellow)</option>
                      <option value="Thyroid">Thyroid Condition (Caution - Yellow)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="px-3.5 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center gap-1 hover:bg-slate-50 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('customer-login')}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Already have account?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 ml-auto"
                >
                  <span>{step === 3 ? (loading ? 'Creating Plan...' : 'Generate Plan & Finish') : 'Continue'}</span>
                  {step < 3 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. SECURE ADMIN LOGIN (HIDDEN GATEWAY) */}
        {/* ------------------------------------------------------------- */}
        {mode === 'admin-login' && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Partner Admin Access</h3>
                <p className="text-xs text-slate-500">
                  Protected enterprise console for Fitness Hub owners.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={adminLoginForm.email}
                    onChange={e => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })}
                    placeholder="admin@fitnessclub.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={adminLoginForm.password}
                    onChange={e => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                    placeholder="Enter admin password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Open Console'}</span>
              </button>

              <div className="text-center pt-2 text-slate-500">
                Registering a new Fitness Partner Hub?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('admin-register'); setErrorMsg(''); }}
                  className="font-bold text-slate-900 hover:underline"
                >
                  Register Partner Firm
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 4. ADMIN REGISTER (REGISTER NEW ENTERPRISE FIRM) */}
        {/* ------------------------------------------------------------- */}
        {mode === 'admin-register' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Register Partner Fitness Club</h3>
              <p className="text-xs text-slate-500">
                Setup your firm name, logo, address, and unique WhatsApp AI assistant number.
              </p>
            </div>

            <form onSubmit={handleAdminRegister} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fitness Club / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={adminRegForm.gym_name}
                    onChange={e => setAdminRegForm({ ...adminRegForm, gym_name: e.target.value })}
                    placeholder="e.g. Pulse Performance Hub"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp AI Number *</label>
                  <input
                    type="text"
                    required
                    value={adminRegForm.whatsapp_number}
                    onChange={e => setAdminRegForm({ ...adminRegForm, whatsapp_number: e.target.value })}
                    placeholder="+91 99001 22334"
                    className="w-full px-3 py-2 border border-emerald-300 bg-emerald-50/20 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={adminRegForm.email}
                    onChange={e => setAdminRegForm({ ...adminRegForm, email: e.target.value })}
                    placeholder="owner@fitnesshub.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Password *</label>
                    <button
                      type="button"
                      onClick={generateAdminPassword}
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      Generate Key
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={adminRegForm.password}
                    onChange={e => setAdminRegForm({ ...adminRegForm, password: e.target.value })}
                    placeholder="Enter or generate password"
                    className="w-full px-3 py-2 font-mono border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  value={adminRegForm.address}
                  onChange={e => setAdminRegForm({ ...adminRegForm, address: e.target.value })}
                  placeholder="Plot 22, Sector 14, Ring Road"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={adminRegForm.city}
                    onChange={e => setAdminRegForm({ ...adminRegForm, city: e.target.value })}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">AI Coach Bot Name</label>
                  <input
                    type="text"
                    value={adminRegForm.ai_coach_name}
                    onChange={e => setAdminRegForm({ ...adminRegForm, ai_coach_name: e.target.value })}
                    placeholder="e.g. Pulse AI Coach"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode('admin-login')}
                  className="text-slate-600 font-semibold hover:underline"
                >
                  Back to Sign In
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition"
                >
                  {loading ? 'Creating Enterprise Hub...' : 'Register & Save to DB'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
