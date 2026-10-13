import React from 'react';
import {
  Sparkles,
  User,
  Building2,
  Phone,
  LogOut,
  LogIn,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  activePortal,
  setActivePortal,
  currentGym,
  gymsList = [],
  onSwitchGym,
  customer,
  isAdminLoggedIn,
  onLogoutCustomer,
  onLogoutAdmin,
  onOpenAuthModal
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActivePortal('customer')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-black text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  NutriPulse<span className="text-emerald-600">AI</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Intelligent Nutrition & WhatsApp AI Coaching
              </p>
            </div>
          </div>

          {/* Active Affiliated Fitness Hub */}
          {currentGym && (
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
              <img
                src={currentGym.logo_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&auto=format&fit=crop&q=80'}
                alt="Partner"
                className="w-7 h-7 rounded-lg object-cover border border-emerald-400"
              />
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">
                  {currentGym.gym_name}
                </span>
                <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5" />
                  <span>{currentGym.whatsapp_number}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Auth & Portals */}
        <div className="flex items-center gap-3">
          
          {/* If Admin is logged in, show Admin switch and Exit Admin */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePortal(activePortal === 'admin' ? 'customer' : 'admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  activePortal === 'admin'
                    ? 'bg-slate-900 text-emerald-400 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{activePortal === 'admin' ? 'Admin Console Active' : 'Switch to Admin'}</span>
              </button>

              <button
                onClick={onLogoutAdmin}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                title="Log Out Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}

          {/* Customer / Member Session Info */}
          {customer ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-2xl">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {customer.name ? customer.name.charAt(0) : 'U'}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 leading-tight">
                    {customer.name}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {customer.goal || 'Fat-loss'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogoutCustomer}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                title="Sign Out Member"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal('customer-login')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
