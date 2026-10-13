import React from 'react';
import { Sparkles, Shield, Lock, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer({ onOpenAdminLogin }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20">
                NP
              </div>
              <span className="text-base font-black text-white tracking-tight">
                NutriPulse<span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Intelligent nutrition calculation, Indian regional diet planning, and multi-tenant WhatsApp AI coaching. Built with strict safety screening and adaptive daily adjustments.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mifflin-St Jeor TDEE Engine</span>
              </span>
              <span>•</span>
              <span>SQLite Persistent Storage</span>
              <span>•</span>
              <span>WhatsApp Deep-Link Protocol</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-200 transition cursor-pointer">AI Food Scanner (Photo)</li>
              <li className="hover:text-slate-200 transition cursor-pointer">Indian Food Database (50+ Dishes)</li>
              <li className="hover:text-slate-200 transition cursor-pointer">Calorie & Macro Tracker</li>
              <li className="hover:text-slate-200 transition cursor-pointer">Interactive Workout Burn Tracker</li>
              <li className="hover:text-slate-200 transition cursor-pointer">Smart Grocery Shopping List</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Enterprise & Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-200 transition cursor-pointer">Multi-Tenant Club Isolation</li>
              <li className="hover:text-slate-200 transition cursor-pointer">Condition Safety Screening (Green/Yellow/Red)</li>
              <li className="hover:text-slate-200 transition cursor-pointer">Encrypted Session Tokens</li>
              <li className="pt-2">
                {/* Discreet Secure Admin Access Button */}
                <button
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold border border-slate-700 transition"
                  title="Restricted access for club owners & administrators"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Partner Admin Gateway</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} NutriPulse AI. All rights reserved. Professional nutrition & fitness specification.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Medical Advisory Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
