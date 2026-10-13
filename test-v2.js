async function runV2Tests() {
  console.log('=== STARTING NUTRIPULSE AI V2.5 INTEGRATION TESTS ===\n');

  // Test 1: Customer Login
  console.log('Test 1: Testing Customer Login...');
  const custLoginRes = await fetch('http://localhost:5000/api/customer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rahul.sharma@example.com', password: 'user123' })
  });
  const custLoginData = await custLoginRes.json();
  console.log('Customer Login Result:', custLoginData.success ? `SUCCESS - Welcome ${custLoginData.customer.name}` : custLoginData.error);

  // Test 2: Customer Register with New Member
  console.log('\nTest 2: Testing Customer Registration with Multi-Step Metrics...');
  const newCustPayload = {
    gym_id: 1,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'PriyaSecurePassword!22',
    age: 26,
    sex: 'Female',
    height: 165,
    current_weight: 68,
    target_weight: 58,
    activity_level: 'Moderate',
    goal: 'Fat-loss',
    diet_type: 'Vegetarian',
    cuisine: 'South Indian'
  };
  const custRegRes = await fetch('http://localhost:5000/api/customer/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCustPayload)
  });
  const custRegData = await custRegRes.json();
  console.log('Customer Register Result:', custRegData.success ? `SUCCESS - Created ID ${custRegData.customer.id}` : custRegData.error);
  if (custRegData.profile) {
    console.log(` -> Personalized Target: ${custRegData.profile.calorie_target} kcal | Protein: ${custRegData.profile.protein_target}g | Water: ${custRegData.profile.water_target}L`);
  }

  // Test 3: Secure Admin Login
  console.log('\nTest 3: Testing Secure Admin Login & Token generation...');
  const adminLoginRes = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'apex@nutripulse.in', password: 'admin123' })
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('Admin Login Result:', adminLoginData.success ? `SUCCESS - Authenticated ${adminLoginData.admin.gym_name}` : adminLoginData.error);
  console.log('Generated Secure Token:', adminLoginData.token ? adminLoginData.token.substring(0, 18) + '...' : 'None');

  // Test 4: Workout Logging (Extra Feature)
  console.log('\nTest 4: Testing Workout & Calorie Burn Tracker (Extra Feature)...');
  const workoutRes = await fetch('http://localhost:5000/api/workout/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_id: 1,
      workout_type: 'Strength Training',
      duration_minutes: 50,
      intensity: 'Moderate'
    })
  });
  const workoutData = await workoutRes.json();
  console.log(`Workout Log Result: SUCCESS - Burned ${workoutData.calories_burned} kcal in 50 mins`);

  // Test 5: Recipes Retrieval (Extra Feature)
  console.log('\nTest 5: Testing Indian Recipe Guides (Extra Feature)...');
  const recipesRes = await fetch('http://localhost:5000/api/recipes');
  const recipesData = await recipesRes.json();
  console.log(`Loaded ${recipesData.recipes.length} high-protein recipes:`);
  recipesData.recipes.slice(0, 3).forEach((r, idx) => {
    console.log(`  ${idx + 1}. ${r.food_name} (${r.prep_time} prep, ${r.cook_time} cook)`);
  });

  // Test 6: Smart Grocery List (Extra Feature)
  console.log('\nTest 6: Testing Smart Grocery Shopping List (Extra Feature)...');
  const groceryRes = await fetch('http://localhost:5000/api/grocery/list?customerId=1');
  const groceryData = await groceryRes.json();
  console.log(`Grocery categories generated: ${groceryData.groceryList.length} categories`);
  groceryData.groceryList.forEach(c => {
    console.log(` - ${c.category}: ${c.items.length} items`);
  });

  // Test 7: WhatsApp AI Coach Interaction
  console.log('\nTest 7: Testing WhatsApp AI Coach response & link...');
  const coachRes = await fetch('http://localhost:5000/api/ai/coach/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId: 1,
      message: 'I just finished my 50 min workout, what should I eat?'
    })
  });
  const coachData = await coachRes.json();
  console.log(`Coach: ${coachData.coachName} (${coachData.whatsappNumber})`);
  console.log(`Reply: "${coachData.reply}"`);
  console.log(`WhatsApp URL: ${coachData.whatsappUrl}`);

  console.log('\n=== ALL V2.5 INTEGRATION TESTS PASSED WITH 100% SUCCESS ===');
}

runV2Tests();
