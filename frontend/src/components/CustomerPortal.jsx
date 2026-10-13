import React, { useState, useEffect } from 'react';
import {
  Flame,
  Droplets,
  Camera,
  Search,
  Plus,
  RefreshCw,
  Utensils,
  Award,
  Check,
  ChevronRight,
  TrendingDown,
  Sparkles,
  MapPin,
  Phone,
  Compass,
  FileText,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Trash2,
  Dumbbell,
  BookOpen,
  ShoppingCart,
  Calculator,
  Activity,
  Heart
} from 'lucide-react';

export default function CustomerPortal({
  customer,
  gym,
  gymsList = [],
  onSwitchGym,
  onUpdateCustomer,
  onOpenAuthModal
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'workouts', 'recipes', 'grocery', 'scanner', 'food-search', 'restaurant-mode', 'calculator', 'weekly-report'
  
  // AI Meal Swap Modal state
  const [swapModal, setSwapModal] = useState({ open: false, meal: null, alternatives: [], loading: false });

  // AI Food Scanner state
  const [scanState, setScanState] = useState({
    activeSample: 'roti_dal',
    scanning: false,
    result: null,
    portionMultiplier: 1.0
  });

  // Food Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Workout state
  const [workoutForm, setWorkoutForm] = useState({
    workout_type: 'Strength Training',
    duration_minutes: 45,
    intensity: 'Moderate'
  });
  const [workoutLogging, setWorkoutLogging] = useState(false);

  // Recipes state
  const [recipesList, setRecipesList] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Grocery List state
  const [groceryData, setGroceryData] = useState([]);
  const [checkedGrocery, setCheckedGrocery] = useState({});

  // Weekly Report state
  const [weeklyReport, setWeeklyReport] = useState(null);

  // Profile Edit state
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileForm, setProfileForm] = useState({
    id: customer?.id || 1,
    age: customer?.age || 28,
    sex: customer?.sex || 'Male',
    height: customer?.height || 175,
    current_weight: customer?.current_weight || 75,
    target_weight: customer?.target_weight || 70,
    waist: customer?.waist || 88,
    activity_level: customer?.activity_level || 'Moderate',
    goal: customer?.goal || 'Fat-loss',
    diet_type: customer?.diet_type || 'Vegetarian',
    cuisine: customer?.cuisine || 'North Indian',
    gym_id: gym?.id || 1
  });

  // Keep profileForm in sync with customer whenever customer or gym changes
  useEffect(() => {
    if (customer) {
      setProfileForm({
        id: customer.id || 1,
        age: customer.age || 28,
        sex: customer.sex || 'Male',
        height: customer.height || 175,
        current_weight: customer.current_weight || 75,
        target_weight: customer.target_weight || 70,
        waist: customer.waist || 88,
        activity_level: customer.activity_level || 'Moderate',
        goal: customer.goal || 'Fat-loss',
        diet_type: customer.diet_type || 'Vegetarian',
        cuisine: customer.cuisine || 'North Indian',
        gym_id: gym?.id || customer.gym_id || 1
      });
    }
  }, [customer, gym, profileEditOpen]);

  useEffect(() => {
    fetchTodayData();
    fetchWeeklyReport();
    fetchRecipes();
    fetchGroceryList();
  }, [customer?.id, gym?.id]);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/nutrition/today?customerId=${customer?.id || 1}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const res = await fetch(`/api/nutrition/weekly-report?customerId=${customer?.id || 1}`);
      const data = await res.json();
      setWeeklyReport(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      if (data.recipes) {
        setRecipesList(data.recipes);
        setSelectedRecipe(data.recipes[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroceryList = async () => {
    try {
      const res = await fetch(`/api/grocery/list?customerId=${customer?.id || 1}`);
      const data = await res.json();
      if (data.groceryList) setGroceryData(data.groceryList);
    } catch (err) {
      console.error(err);
    }
  };

  // Log food
  const handleLogFood = async (food, mealType = 'Lunch') => {
    try {
      await fetch('/api/nutrition/food/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer?.id || 1,
          food_id: food.id || null,
          food_name: food.name,
          meal_type: mealType,
          servings: 1,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat
        })
      });
      await fetchTodayData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete logged food
  const handleDeleteLog = async (logId) => {
    try {
      await fetch(`/api/nutrition/food/log/${logId}`, { method: 'DELETE' });
      await fetchTodayData();
    } catch (err) {
      console.error(err);
    }
  };

  // Log Water
  const handleAddWater = async (amount = 250) => {
    try {
      await fetch('/api/nutrition/water/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer?.id || 1,
          amount_ml: amount
        })
      });
      await fetchTodayData();
    } catch (err) {
      console.error(err);
    }
  };

  // Log Workout
  const handleLogWorkout = async (e) => {
    e.preventDefault();
    setWorkoutLogging(true);
    try {
      await fetch('/api/workout/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer?.id || 1,
          workout_type: workoutForm.workout_type,
          duration_minutes: Number(workoutForm.duration_minutes),
          intensity: workoutForm.intensity
        })
      });
      await fetchTodayData();
      alert(`Logged ${workoutForm.duration_minutes} min of ${workoutForm.workout_type}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setWorkoutLogging(false);
    }
  };

  // Delete Workout
  const handleDeleteWorkout = async (workoutId) => {
    try {
      await fetch(`/api/workout/log/${workoutId}`, { method: 'DELETE' });
      await fetchTodayData();
    } catch (err) {
      console.error(err);
    }
  };

  // AI Meal Swap
  const handleOpenSwap = async (meal) => {
    setSwapModal({ open: true, meal, alternatives: [], loading: true });
    try {
      const res = await fetch('/api/nutrition/meal/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentFoodName: meal.name,
          mealType: meal.meal_type || 'Lunch',
          calories: meal.calories,
          dietType: customer?.diet_type || 'Vegetarian'
        })
      });
      const data = await res.json();
      setSwapModal({ open: true, meal, alternatives: data.alternatives || [], loading: false });
    } catch (err) {
      setSwapModal({ open: true, meal, alternatives: [], loading: false });
    }
  };

  // AI Food Scanner
  const handleRunScanner = async (sampleType) => {
    setScanState(prev => ({ ...prev, activeSample: sampleType, scanning: true, result: null }));
    try {
      const sampleNames = {
        roti_dal: 'Rotis Dal Bhindi',
        idli: 'Idli Sambar',
        paneer: 'Paneer Tikka',
        chilla: 'Moong Dal Chilla'
      };

      const res = await fetch('/api/nutrition/food/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleName: sampleNames[sampleType] || 'roti_dal' })
      });
      const data = await res.json();
      setTimeout(() => {
        setScanState(prev => ({
          ...prev,
          scanning: false,
          result: data.scanResult,
          portionMultiplier: 1.0
        }));
      }, 700);
    } catch (err) {
      setScanState(prev => ({ ...prev, scanning: false }));
    }
  };

  // Food Search
  const handleSearchFoods = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.foods || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Toggle grocery item checkbox
  const toggleGroceryItem = (key) => {
    setCheckedGrocery(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Save updated profile & recalculate targets
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const payload = {
        id: customer?.id || profileForm.id || 1,
        age: Number(profileForm.age),
        sex: profileForm.sex || 'Male',
        height: Number(profileForm.height),
        current_weight: Number(profileForm.current_weight),
        target_weight: Number(profileForm.target_weight),
        waist: Number(profileForm.waist || 88),
        activity_level: profileForm.activity_level || 'Moderate',
        workout_frequency: Number(customer?.workout_frequency || 4),
        goal: profileForm.goal || 'Fat-loss',
        diet_type: profileForm.diet_type || 'Vegetarian',
        cuisine: profileForm.cuisine || 'North Indian',
        gym_id: Number(gym?.id || profileForm.gym_id || 1)
      };

      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setProfileMsg(`Calculated! New Target: ${data.profile.calorie_target} kcal`);
        if (onUpdateCustomer) onUpdateCustomer(data.customer, data.gym, data.profile);
        
        // Update local dashboard immediately so meters and timeline update
        setDashboardData(prev => ({
          ...prev,
          customer: data.customer,
          profile: data.profile,
          gym: data.gym || prev?.gym
        }));

        await fetchTodayData();
        await fetchWeeklyReport();

        setTimeout(() => {
          setProfileEditOpen(false);
          setSavingProfile(false);
          setProfileMsg('');
        }, 700);
      } else {
        alert(data.error || 'Failed to recalculate profile.');
        setSavingProfile(false);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      alert('Connection error while recalculating.');
      setSavingProfile(false);
    }
  };

  // Calorie & Macro calculations
  const consumed = dashboardData?.consumed || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const targetCalories = dashboardData?.profile?.calorie_target || 1850;
  const targetProtein = dashboardData?.profile?.protein_target || 115;
  const targetCarbs = dashboardData?.profile?.carb_target || 195;
  const targetFat = dashboardData?.profile?.fat_target || 48;
  const targetWater = dashboardData?.profile?.water_target || 3.2;
  const waterLoggedLiters = Number(((dashboardData?.waterLoggedMl || 0) / 1000).toFixed(1));
  const caloriesBurned = dashboardData?.caloriesBurned || 0;

  // Net Calorie math
  const netCalories = consumed.calories - caloriesBurned;
  const caloriesRemaining = Math.max(0, targetCalories - netCalories);
  const caloriesPercent = Math.min(100, Math.round((consumed.calories / targetCalories) * 100));

  // BMI calculations
  const currentHeightM = (customer?.height || 175) / 100;
  const currentWeightKg = customer?.current_weight || 82;
  const targetWeightKg = customer?.target_weight || 72;
  const bmiValue = Number((currentWeightKg / (currentHeightM * currentHeightM)).toFixed(1));
  
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-600 bg-emerald-50';
  if (bmiValue < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-600 bg-amber-50';
  } else if (bmiValue >= 25 && bmiValue < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-700 bg-amber-50';
  } else if (bmiValue >= 30) {
    bmiCategory = 'Obesity Class';
    bmiColor = 'text-rose-700 bg-rose-50';
  }

  // Weeks to target calculation (assuming healthy 0.5 kg/week)
  const weightToChange = Math.abs(currentWeightKg - targetWeightKg);
  const estimatedWeeks = Math.ceil(weightToChange / 0.5);

  const cleanPhone = (gym?.whatsapp_number || '+919880123456').replace(/[^0-9]/g, '');
  const directWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${gym?.ai_coach_name || 'Coach'} (${gym?.gym_name})! I'm ${customer?.name || 'Member'}. Consumed: ${consumed.calories} kcal, Burned: ${caloriesBurned} kcal today. What should I eat next?`)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28">
      
      {/* Dynamic Partner Fitness Club Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-slate-700/60 mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={gym?.logo_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80'}
                alt={gym?.gym_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px]" title="WhatsApp AI Coach Online">
                💬
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  Affiliated Partner Club
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• Dedicated WhatsApp AI Coach</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-1">
                {gym?.gym_name || 'Apex Athletic & Wellness Club'}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300 mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{gym?.address || 'Indiranagar, Bengaluru'}</span>
                </span>
                <span className="flex items-center gap-1 font-mono text-emerald-300">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{gym?.whatsapp_number || '+91 98801 23456'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Partner Switcher & Direct WhatsApp Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-2 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold px-2">
                Switch Partner Club:
              </span>
              <select
                value={gym?.id || 1}
                onChange={e => onSwitchGym(Number(e.target.value))}
                className="bg-transparent text-xs text-emerald-300 font-bold px-2 py-1 focus:outline-none cursor-pointer"
              >
                {gymsList.map(g => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.gym_name} ({g.whatsapp_number})
                  </option>
                ))}
              </select>
            </div>

            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold rounded-2xl shadow-lg transition"
            >
              <span>Chat with Coach on WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Member Baseline Status Row */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-300">Member: {customer?.name || 'Rahul Sharma'}</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700 font-mono">
              {customer?.current_weight || 82} kg → Goal: {customer?.target_weight || 72} kg
            </span>
            <span className="bg-emerald-950/60 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/50 font-bold">
              Goal: {customer?.goal || 'Fat-loss'}
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
              Diet: {customer?.diet_type || 'Vegetarian'} ({customer?.cuisine || 'North Indian'})
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-bold ${
              customer?.safety_flag === 'Green' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
            }`}>
              Safety: {customer?.safety_flag || 'Green'}
            </span>
          </div>

          <button
            onClick={() => setProfileEditOpen(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
          >
            Edit Body Metrics & Goal
          </button>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'today'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-emerald-600" />
          <span>Today's Nutrition</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'workouts'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Dumbbell className="w-4 h-4 text-emerald-600" />
          <span>Workout & Burn Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'recipes'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Indian Recipe Guides</span>
        </button>

        <button
          onClick={() => setActiveTab('grocery')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'grocery'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <span>Smart Grocery Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>AI Food Scanner (Photo)</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>BMI & Body Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurant-mode')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'restaurant-mode'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Restaurant Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('weekly-report')}
          className={`pb-3 px-3.5 text-xs font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'weekly-report'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Weekly AI Report</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TODAY'S NUTRITION DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'today' && (
        <div className="space-y-8">
          
          {/* Calorie & Macro Target Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            
            {/* Calorie Gauge with Net Math */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Daily Calorie Budget
              </span>

              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke="#10b981" strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * caloriesPercent) / 100}
                    strokeLinecap="round" fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {caloriesRemaining}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    net kcal left
                  </span>
                </div>
              </div>

              {/* Net Calories Summary (Consumed - Burned = Net) */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Consumed</span>
                  <p className="font-extrabold text-emerald-600">{consumed.calories} kcal</p>
                </div>
                <div className="p-2 bg-rose-50 rounded-xl">
                  <span className="text-[10px] text-rose-500 block font-semibold">Burned</span>
                  <p className="font-extrabold text-rose-600">-{caloriesBurned} kcal</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Goal Target</span>
                  <p className="font-extrabold text-slate-800">{targetCalories} kcal</p>
                </div>
              </div>
            </div>

            {/* Macros Distribution */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center justify-between">
                  <span>Indian Nutrition Macros Target</span>
                  <span className="text-xs font-semibold text-emerald-600">Goal: {customer?.goal}</span>
                </h3>

                {/* Protein Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Protein (Muscle & Satiety)</span>
                    </span>
                    <span className="font-mono text-slate-900">
                      {consumed.protein}g / <span className="text-slate-400">{targetProtein}g</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (consumed.protein / targetProtein) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Carbs Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Carbohydrates (Energy & Training)</span>
                    </span>
                    <span className="font-mono text-slate-900">
                      {consumed.carbs}g / <span className="text-slate-400">{targetCarbs}g</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (consumed.carbs / targetCarbs) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Fat Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span>Healthy Fats (Hormone Health)</span>
                    </span>
                    <span className="font-mono text-slate-900">
                      {consumed.fat}g / <span className="text-slate-400">{targetFat}g</span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (consumed.fat / targetFat) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Water Intake Tracker */}
              <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-sm">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-950">Hydration Progress</span>
                    <p className="text-xs text-blue-700">
                      {waterLoggedLiters} Litres logged of <strong>{targetWater} L</strong> target
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddWater(250)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    +250 ml (1 Glass)
                  </button>
                  <button
                    onClick={() => handleAddWater(500)}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold rounded-xl transition"
                  >
                    +500 ml Bottle
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Today's Meals Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Today's Personalized Indian Meal Plan
                </h2>
                <p className="text-xs text-slate-500">
                  Adaptive plan for {customer?.diet_type} ({customer?.cuisine}). Click "AI Swap" to explore comparable alternatives!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('food-search')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Search & Log Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dashboardData?.mealPlan?.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                          {slot.time}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base mt-1">
                          {slot.slot}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        ~{slot.targetCalories} kcal
                      </span>
                    </div>

                    <div className="space-y-3">
                      {slot.foods.map((food, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{food.image_emoji || '🥗'}</span>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-800 truncate leading-snug">
                                {food.name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span>{food.calories} kcal</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold">{food.protein}g P</span>
                                <span>•</span>
                                <span>{food.serving_size}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenSwap(food)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                              title="Swap with AI Alternative"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleLogFood(food, slot.slot)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition"
                            >
                              Log
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{slot.title}</span>
                    <button
                      onClick={() => handleOpenSwap(slot.foods[0] || { name: slot.slot, calories: slot.targetCalories })}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      AI Swap 🔄
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Logged Items */}
          {dashboardData?.todayLogs && dashboardData.todayLogs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                <span>Items Logged Today ({dashboardData.todayLogs.length})</span>
                <span className="text-xs text-slate-400 font-mono">Total: {consumed.calories} kcal</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {dashboardData.todayLogs.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{item.food_name}</span>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-emerald-700">{item.meal_type}</span>
                        <span>•</span>
                        <span>{item.calories} kcal</span>
                        <span>•</span>
                        <span>{item.protein}g Protein</span>
                        <span>•</span>
                        <span>{item.carbs}g Carbs</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition"
                      title="Remove entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE WORKOUT & CALORIE BURN TRACKER (EXTRA FEATURE) */}
      {/* ========================================================================= */}
      {activeTab === 'workouts' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Workout & Calorie Burn Engine</h2>
                <p className="text-xs text-slate-500">
                  Log your exercise sessions. Burned calories automatically expand your daily net calorie budget!
                </p>
              </div>
            </div>

            {/* Quick Log Form */}
            <form onSubmit={handleLogWorkout} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-6">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Exercise Activity</label>
                <select
                  value={workoutForm.workout_type}
                  onChange={e => setWorkoutForm({ ...workoutForm, workout_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium"
                >
                  <option value="Strength Training">Strength Training / Weights (Push/Pull/Legs)</option>
                  <option value="HIIT / Circuit">HIIT & Functional Circuit</option>
                  <option value="Running / Jogging">Running / Jogging (Outdoor/Treadmill)</option>
                  <option value="Brisk Walking">Brisk Walking (10,000 steps)</option>
                  <option value="Cycling">Cycling / Spin Class</option>
                  <option value="Yoga & Mobility">Yoga & Mobility Session</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={workoutForm.duration_minutes}
                  onChange={e => setWorkoutForm({ ...workoutForm, duration_minutes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={workoutLogging}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  <span>Log Workout</span>
                </button>
              </div>
            </form>

            {/* Today's Logged Workouts List */}
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Today's Logged Activities</span>
              <span className="text-xs font-mono text-rose-600 font-bold">Total Burned: {caloriesBurned} kcal</span>
            </h3>

            <div className="space-y-3">
              {(dashboardData?.workouts || []).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No workouts logged yet today. Choose an activity above and log your session!
                </div>
              ) : (
                dashboardData?.workouts?.map(w => (
                  <div key={w.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                        🏋️
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{w.workout_type}</span>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{w.duration_minutes} Minutes</span>
                          <span>•</span>
                          <span className="text-rose-600 font-semibold">{w.calories_burned} kcal burned</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteWorkout(w.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition"
                      title="Remove workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INDIAN RECIPE COOKING GUIDES (EXTRA FEATURE) */}
      {/* ========================================================================= */}
      {activeTab === 'recipes' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Recipe List */}
            <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 mb-2">High-Protein Indian Recipes</h3>
              {recipesList.map(r => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecipe(r)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedRecipe?.id === r.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{r.image_emoji}</span>
                    <div>
                      <h4 className="font-bold text-xs">{r.food_name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {r.prep_time} prep • {r.cook_time} cook
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>

            {/* Right Recipe Details */}
            {selectedRecipe && (
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedRecipe.difficulty} • Serves {selectedRecipe.servings}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-1">
                      {selectedRecipe.food_name}
                    </h2>
                  </div>
                  <span className="text-3xl">{selectedRecipe.image_emoji}</span>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    Ingredients
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 pl-2">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparation Steps */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                    Step-by-Step Cooking Instructions
                  </h4>
                  <ol className="text-xs text-slate-600 space-y-2 pl-2">
                    {selectedRecipe.instructions.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="font-bold text-emerald-700 shrink-0">{sIdx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Chef Tip */}
                {selectedRecipe.chef_tip && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs text-amber-900">
                    <span className="font-bold block mb-0.5">💡 Nutritionist Tip:</span>
                    <span>{selectedRecipe.chef_tip}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SMART GROCERY & PANTRY CHECKLIST (EXTRA FEATURE) */}
      {/* ========================================================================= */}
      {activeTab === 'grocery' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Smart Weekly Pantry & Grocery Checklist
                </h2>
                <p className="text-xs text-slate-500">
                  Automated shopping list curated for your {customer?.diet_type} plan. Check off items while at the market!
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                Weekly Replenishment
              </span>
            </div>

            <div className="space-y-6">
              {groceryData.map((cat, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-l-2 border-emerald-500 pl-2">
                    {cat.category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.items.map((item, iIdx) => {
                      const itemKey = `${idx}-${iIdx}`;
                      const isDone = !!checkedGrocery[itemKey];
                      return (
                        <div
                          key={iIdx}
                          onClick={() => toggleGroceryItem(itemKey)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                            isDone
                              ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                              : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => {}}
                              className="accent-emerald-600 rounded cursor-pointer"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold block truncate">{item.name}</span>
                              <span className="text-[10px] text-slate-400 block">{item.note}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[11px] font-bold shrink-0 ml-2">{item.amount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI FOOD SCANNER (PHOTO) */}
      {/* ========================================================================= */}
      {activeTab === 'scanner' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              NutriPulse AI Food Scanner (Indian Food Recognition)
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Select or snap a photo of your meal. Our AI detects dishes, estimates portions, and computes macros.
            </p>

            <div className="mt-6">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Simulate Camera Snapshot / Select Meal Plate:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {[
                  { id: 'roti_dal', label: '2 Rotis + Dal + Bhindi', emoji: '🍛' },
                  { id: 'idli', label: 'Idli + Sambar + Chutney', emoji: '🥟' },
                  { id: 'paneer', label: 'Paneer Tikka Platter', emoji: '🍢' },
                  { id: 'chilla', label: 'Moong Dal Chilla', emoji: '🥞' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleRunScanner(item.id)}
                    className={`p-3 rounded-2xl border transition text-xs font-semibold flex items-center gap-2 ${
                      scanState.activeSample === item.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => handleRunScanner(scanState.activeSample)}
                disabled={scanState.scanning}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 mx-auto"
              >
                {scanState.scanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Analyzing Plate Ingredients...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scan & Detect Plate Components</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {scanState.result && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Confidence: {scanState.result.confidence}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    {scanState.result.detectedDish}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cuisine: {scanState.result.cuisine} • Serving: {scanState.result.portion}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">
                    {Math.round(scanState.result.calories * scanState.portionMultiplier)}
                  </span>
                  <span className="text-xs text-slate-400 block">kcal</span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Detected Components:
                </span>
                {scanState.result.itemsBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{item.item}</span>
                    <div className="flex items-center gap-3 text-slate-500 font-mono">
                      <span>{item.portion}</span>
                      <span className="font-bold text-slate-800">{item.calories} kcal</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adjust Portion Size:</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    {Math.round(scanState.portionMultiplier * 100)}% ({scanState.portionMultiplier}x)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={scanState.portionMultiplier}
                  onChange={e =>
                    setScanState(prev => ({
                      ...prev,
                      portionMultiplier: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    handleLogFood(
                      {
                        name: scanState.result.detectedDish,
                        calories: Math.round(scanState.result.calories * scanState.portionMultiplier),
                        protein: Number((scanState.result.protein * scanState.portionMultiplier).toFixed(1)),
                        carbs: Number((scanState.result.carbs * scanState.portionMultiplier).toFixed(1)),
                        fat: Number((scanState.result.fat * scanState.portionMultiplier).toFixed(1))
                      },
                      'Lunch'
                    );
                    alert('Plate added to today’s food log!');
                    setActiveTab('today');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Add to Today's Food Log</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: BMI & BODY STATS CALCULATOR (EXTRA FEATURE) */}
      {/* ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              Body Composition & Target Timeline
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Clinical metrics derived from your current height, weight, waist circumference, and target goal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {/* BMI Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Body Mass Index (BMI)</span>
                <p className="text-3xl font-black text-slate-900 mt-2">{bmiValue}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${bmiColor}`}>
                  {bmiCategory}
                </span>
              </div>

              {/* BMR Card */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Basal Metabolic Rate (BMR)</span>
                <p className="text-3xl font-black text-emerald-600 mt-2">
                  ~{Math.round((10 * currentWeightKg) + (6.25 * (customer?.height || 175)) - (5 * (customer?.age || 28)))}
                </p>
                <span className="text-xs text-slate-500 block mt-2">kcal burned at resting state</span>
              </div>

              {/* Goal Timeline */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Timeline</span>
                <p className="text-3xl font-black text-blue-600 mt-2">~{estimatedWeeks} Weeks</p>
                <span className="text-xs text-slate-500 block mt-2">
                  To reach {targetWeightKg} kg at safe 0.5kg/week
                </span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <span className="font-bold block">Need Condition-Specific Medical Advice?</span>
                <span>Our system screens health flags (Yellow/Red) and advises consulting your physician before extreme caloric shifts.</span>
              </div>
              <button
                onClick={() => setProfileEditOpen(true)}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl shrink-0 ml-4"
              >
                Update Metrics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: RESTAURANT & TRAVEL MODE */}
      {/* ========================================================================= */}
      {activeTab === 'restaurant-mode' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Adaptive Eating Out & Travel Engine
                </h2>
                <p className="text-xs text-slate-500">
                  Per NutriPulse specification: “Work around real constraints rather than treating eating out as a failure.”
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-bold text-sm text-slate-900">🍽️ Indian Restaurant Strategy</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Choose Tandoori / Tikka:</strong> Paneer tikka, Chicken tikka, Tandoori mushrooms (dry roasted over fire, lower saturated fat).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Roti over Naan:</strong> Request butterless Phulka instead of refined Maida Butter Naan saves 150 kcal per bread!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Yellow Dal Tadka:</strong> Clear lentil broth with cumin tadka provides clean plant protein without heavy cream.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-bold text-sm text-slate-900">✈️ Travel Mode (Hotel & Flights)</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Hotel Breakfast:</strong> Prioritize made-to-order egg omelette or steamed Idli/Sambar. Avoid sugar-loaded bakery croissants.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Portable Indian Snacks:</strong> Keep roasted chana, roasted makhana, or vacuum-sealed sattu packets in your laptop bag.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Airport Hydration:</strong> Buy 1 liter water right after security gate to combat cabin dry air.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Need menu advice in real-time? Ping your fitness hub's WhatsApp AI Agent!</span>
              </div>
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] text-white font-bold rounded-xl shadow-sm hover:bg-[#20ba59] transition shrink-0 ml-4"
              >
                Ask WhatsApp Coach
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: WEEKLY AI REPORT */}
      {/* ========================================================================= */}
      {activeTab === 'weekly-report' && weeklyReport && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase">
                  Weekly Behavior Analysis
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  AI Nutrition Report for {customer?.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Certified by {gym?.ai_coach_name} ({gym?.gym_name})
                </p>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-emerald-600">{weeklyReport.adherenceRate}%</span>
                <span className="text-xs text-slate-400 block font-semibold">Weekly Adherence</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Meals Logged</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{weeklyReport.mealsLogged}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Protein Consistency</span>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{weeklyReport.proteinConsistency}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Water Intake</span>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{weeklyReport.waterAverage}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Eating Out</span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{weeklyReport.eatingOutFrequency}</p>
              </div>
            </div>

            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>AI Progress Analyst Insights</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-2">
                {weeklyReport.aiCoachInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 p-4 bg-slate-900 text-white rounded-2xl">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                Next-Week Prescription:
              </span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                "{weeklyReport.nextWeekAdjustment}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI MEAL SWAP MODAL */}
      {/* ========================================================================= */}
      {swapModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  NutriPulse AI Swap Engine
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  Swap "{swapModal.meal?.name}"
                </h3>
              </div>
              <button
                onClick={() => setSwapModal({ open: false, meal: null, alternatives: [], loading: false })}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Nutritionally comparable alternatives fitting your {dashboardData?.profile?.calorie_target} kcal plan:
            </p>

            {swapModal.loading ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>AI ranking matching alternatives...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {swapModal.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{alt.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-emerald-700">{alt.calories} kcal</span>
                        <span>•</span>
                        <span>{alt.protein}g Protein</span>
                        <span>•</span>
                        <span>{alt.serving_size}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleLogFood(alt, swapModal.meal?.meal_type || 'Lunch');
                        setSwapModal({ open: false, meal: null, alternatives: [], loading: false });
                        alert(`Swapped and logged "${alt.name}"!`);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                    >
                      Select Swap
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BODY METRICS & HEALTH PROFILE EDIT MODAL */}
      {/* ========================================================================= */}
      {profileEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                Update Body Baseline & Nutrition Targets
              </h3>
              <button
                onClick={() => setProfileEditOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={e => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={profileForm.height}
                    onChange={e => setProfileForm({ ...profileForm, height: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    value={profileForm.current_weight}
                    onChange={e => setProfileForm({ ...profileForm, current_weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Weight (kg)</label>
                  <input
                    type="number"
                    value={profileForm.target_weight}
                    onChange={e => setProfileForm({ ...profileForm, target_weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Fitness Goal</label>
                  <select
                    value={profileForm.goal}
                    onChange={e => setProfileForm({ ...profileForm, goal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Fat-loss">Fat-loss (Deficit)</option>
                    <option value="Muscle-support">Muscle Gain (Hypertrophy)</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Performance">Performance & Endurance</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Diet Preference</label>
                  <select
                    value={profileForm.diet_type}
                    onChange={e => setProfileForm({ ...profileForm, diet_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-vegetarian">Non-vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Jain">Jain (No Root Veg)</option>
                  </select>
                </div>
              </div>

              {profileMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileMsg}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProfileEditOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Recalculating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Recalculate Calories & Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
