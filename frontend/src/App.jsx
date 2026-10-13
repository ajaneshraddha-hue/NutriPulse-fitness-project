import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerPortal from './components/CustomerPortal';
import AdminPortal from './components/AdminPortal';
import WhatsAppAgentWidget from './components/WhatsAppAgentWidget';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

export default function App() {
  const [activePortal, setActivePortal] = useState('customer'); // 'customer' or 'admin'
  const [gymsList, setGymsList] = useState([]);
  const [currentGym, setCurrentGym] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [nutritionProfile, setNutritionProfile] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  
  // Auth Modal State
  const [authModal, setAuthModal] = useState({ open: false, mode: 'customer-login' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Fetch Gyms
      const gymRes = await fetch('/api/admin/gyms');
      const gymData = await gymRes.json();
      const gyms = gymData.gyms || [];
      setGymsList(gyms);

      const initialGym = gyms[0] || null;
      setCurrentGym(initialGym);

      // Fetch Default Customer
      const custRes = await fetch('/api/nutrition/today?customerId=1');
      const custData = await custRes.json();
      if (custData.customer) {
        setCurrentCustomer(custData.customer);
        setNutritionProfile(custData.profile);
        if (custData.gym) setCurrentGym(custData.gym);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch active gym
  const handleSwitchGym = async (gymId) => {
    const selected = gymsList.find(g => g.id === gymId);
    if (selected) {
      setCurrentGym(selected);
      try {
        await fetch('/api/customer/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentCustomer?.id || 1,
            gym_id: gymId
          })
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Admin Profile Update
  const handleAdminUpdate = async (updatedGym) => {
    try {
      const res = await fetch('/api/admin/gyms');
      const data = await res.json();
      setGymsList(data.gyms || []);
      setCurrentGym(updatedGym);
    } catch (err) {
      console.error(err);
    }
  };

  // Customer Profile Update
  const handleCustomerUpdate = (updatedCustomer, gym, profile) => {
    setCurrentCustomer(updatedCustomer);
    if (gym) setCurrentGym(gym);
    if (profile) setNutritionProfile(profile);
  };

  // Auth Success Handler
  const handleLoginSuccess = (userType, customer, gym, profile, token) => {
    if (userType === 'customer') {
      setCurrentCustomer(customer);
      if (gym) setCurrentGym(gym);
      if (profile) setNutritionProfile(profile);
      setActivePortal('customer');
    } else if (userType === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminToken(token);
      if (gym) setCurrentGym(gym);
      setActivePortal('admin');
    }
  };

  // Customer Logout
  const handleLogoutCustomer = () => {
    setCurrentCustomer(null);
    setNutritionProfile(null);
  };

  // Admin Logout
  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminToken(null);
    setActivePortal('customer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-sm text-slate-300">Loading NutriPulse AI Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        currentGym={currentGym}
        gymsList={gymsList}
        onSwitchGym={handleSwitchGym}
        customer={currentCustomer}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutCustomer={handleLogoutCustomer}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenAuthModal={(mode) => setAuthModal({ open: true, mode })}
      />

      {/* Main Body */}
      <main className="flex-1">
        {activePortal === 'customer' ? (
          <CustomerPortal
            customer={currentCustomer}
            gym={currentGym}
            gymsList={gymsList}
            onSwitchGym={handleSwitchGym}
            onUpdateCustomer={handleCustomerUpdate}
            onOpenAuthModal={(mode) => setAuthModal({ open: true, mode })}
          />
        ) : (
          isAdminLoggedIn ? (
            <AdminPortal
              currentAdmin={currentGym}
              onAdminUpdate={handleAdminUpdate}
              onSwitchToCustomer={() => setActivePortal('customer')}
              onLogoutAdmin={handleLogoutAdmin}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg">
              <h2 className="text-xl font-black text-slate-900">Restricted Admin Portal</h2>
              <p className="text-xs text-slate-500 mt-2 mb-6">
                You must authenticate with enterprise admin credentials to access this management console.
              </p>
              <button
                onClick={() => setAuthModal({ open: true, mode: 'admin-login' })}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Sign In as Admin
              </button>
            </div>
          )
        )}
      </main>

      {/* WhatsApp AI Agent Widget (Visible on Customer Portal) */}
      {activePortal === 'customer' && (
        <WhatsAppAgentWidget
          gym={currentGym}
          customer={currentCustomer}
          profile={nutritionProfile}
        />
      )}

      {/* Modern Footer with Discreet Admin Gateway */}
      <Footer
        onOpenAdminLogin={() => setAuthModal({ open: true, mode: 'admin-login' })}
      />

      {/* Unified Authentication Modal */}
      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        gymsList={gymsList}
        onClose={() => setAuthModal({ open: false, mode: 'customer-login' })}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
