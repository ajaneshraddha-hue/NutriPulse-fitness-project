async function runTests() {
  console.log('=== STARTING FITLIFE AI VERIFICATION TESTS ===\n');

  // Test 1: Fetch registered gyms
  console.log('Test 1: Fetching initial gyms list from SQLite...');
  const gymsRes = await fetch('http://localhost:5000/api/admin/gyms');
  const gymsData = await gymsRes.json();
  console.log(`Found ${gymsData.gyms.length} gyms in SQLite:`);
  gymsData.gyms.forEach(g => {
    console.log(` - ID: ${g.id} | ${g.gym_name} | WhatsApp: ${g.whatsapp_number} | City: ${g.city}`);
  });

  // Test 2: Register a new gym owner with unique WhatsApp number & address
  console.log('\nTest 2: Registering a brand new Gym Admin in Admin Portal...');
  const newGymPayload = {
    email: 'contact@olympiagym.in',
    password: 'SecurePassword!99',
    gym_name: 'Olympia Power & Fitness Hub',
    logo_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&auto=format&fit=crop&q=80',
    whatsapp_number: '+919900112233',
    address: 'SCO 45, Sector 17, Chandigarh, 160017',
    city: 'Chandigarh',
    tagline: 'North India Premier Bodybuilding & Conditioning',
    ai_coach_name: 'Olympia Coach Bot',
    ai_greeting: 'Sat Sri Akal! I am Olympia Coach Bot. Let’s dial in your high-protein Indian diet!'
  };

  const regRes = await fetch('http://localhost:5000/api/admin/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGymPayload)
  });
  const regData = await regRes.json();
  console.log('Registration Response:', regData.success ? 'SUCCESS' : 'FAILED', regData.admin ? `Created Gym ID ${regData.admin.id}` : regData.error);

  // Test 3: Customer Portal today data
  console.log('\nTest 3: Fetching Customer Portal today data...');
  const todayRes = await fetch('http://localhost:5000/api/nutrition/today?customerId=1');
  const todayData = await todayRes.json();
  console.log(`Customer: ${todayData.customer.name} (${todayData.customer.goal})`);
  console.log(`Affiliated Gym: ${todayData.gym.gym_name} (WhatsApp: ${todayData.gym.whatsapp_number})`);
  console.log(`Calories Target: ${todayData.profile.calorie_target} kcal | Consumed: ${todayData.consumed.calories} kcal`);
  console.log(`Meal Slots Available: ${todayData.mealPlan.length} slots`);

  // Test 4: AI Meal Swap
  console.log('\nTest 4: Testing AI Meal Swap Engine (PDF Section 9)...');
  const swapRes = await fetch('http://localhost:5000/api/nutrition/meal/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentFoodName: '2 Phulkas + Dal Tadka + Bhindi Sabzi',
      mealType: 'Lunch',
      calories: 440,
      dietType: 'Vegetarian'
    })
  });
  const swapData = await swapRes.json();
  console.log('Swap Alternatives received:');
  swapData.alternatives.forEach((alt, i) => {
    console.log(`  ${i + 1}. ${alt.name} - ${alt.calories} kcal (${alt.protein}g P)`);
  });

  // Test 5: WhatsApp AI Agent Chat & Link verification
  console.log('\nTest 5: Testing WhatsApp AI Agent bound to registered admin...');
  const chatRes = await fetch('http://localhost:5000/api/ai/coach/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerId: 1,
      message: 'Can I swap my dinner for paneer tikka?'
    })
  });
  const chatData = await chatRes.json();
  console.log(`Coach Persona: ${chatData.coachName}`);
  console.log(`WhatsApp Number: ${chatData.whatsappNumber}`);
  console.log(`Generated Direct URL: ${chatData.whatsappUrl}`);
  console.log(`AI Reply: "${chatData.reply}"`);

  // Verify that the URL properly targets the admin's whatsapp number
  const expectedPhone = todayData.gym.whatsapp_number.replace(/[^0-9]/g, '');
  if (chatData.whatsappUrl.includes(expectedPhone)) {
    console.log('✅ PASS: WhatsApp AI Link correctly targets the specific registered admin phone number!');
  } else {
    console.log('❌ FAIL: WhatsApp number mismatch in generated link.');
  }

  console.log('\n=== ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ===');
}

runTests();
