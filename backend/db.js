import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'fitlife.db');

export const db = new DatabaseSync(dbPath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      gym_name TEXT NOT NULL,
      logo_url TEXT,
      whatsapp_number TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      tagline TEXT,
      ai_coach_name TEXT DEFAULT 'NutriPulse AI Coach',
      ai_greeting TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gym_id INTEGER NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      age INTEGER DEFAULT 28,
      sex TEXT DEFAULT 'Male',
      height REAL DEFAULT 175,
      current_weight REAL DEFAULT 78,
      target_weight REAL DEFAULT 70,
      waist REAL DEFAULT 88,
      activity_level TEXT DEFAULT 'Moderate',
      workout_frequency INTEGER DEFAULT 4,
      goal TEXT DEFAULT 'Fat-loss',
      work_type TEXT DEFAULT 'Office / Tech',
      diet_type TEXT DEFAULT 'Vegetarian',
      cuisine TEXT DEFAULT 'North Indian',
      meal_frequency INTEGER DEFAULT 4,
      budget TEXT DEFAULT 'Moderate',
      allergies TEXT DEFAULT 'None',
      health_condition TEXT DEFAULT 'None',
      safety_flag TEXT DEFAULT 'Green',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (gym_id) REFERENCES admins (id)
    );

    CREATE TABLE IF NOT EXISTS nutrition_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER UNIQUE NOT NULL,
      calorie_target INTEGER NOT NULL,
      protein_target INTEGER NOT NULL,
      carb_target INTEGER NOT NULL,
      fat_target INTEGER NOT NULL,
      fiber_target INTEGER NOT NULL,
      water_target REAL NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cuisine TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      diet_type TEXT NOT NULL,
      serving_size TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fat REAL NOT NULL,
      fiber REAL NOT NULL,
      category TEXT NOT NULL,
      image_emoji TEXT DEFAULT '🥗'
    );

    CREATE TABLE IF NOT EXISTS food_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      food_id INTEGER,
      food_name TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      servings REAL DEFAULT 1,
      calories INTEGER NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fat REAL NOT NULL,
      logged_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      amount_ml INTEGER NOT NULL,
      logged_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      workout_type TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      calories_burned INTEGER NOT NULL,
      intensity TEXT DEFAULT 'Moderate',
      logged_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_name TEXT NOT NULL,
      prep_time TEXT NOT NULL,
      cook_time TEXT NOT NULL,
      servings TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      ingredients_json TEXT NOT NULL,
      instructions_json TEXT NOT NULL,
      chef_tip TEXT,
      image_emoji TEXT DEFAULT '🍲'
    );

    CREATE TABLE IF NOT EXISTS ai_chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id)
    );
  `);

  // Check if recipes are populated
  const recipeCount = db.prepare('SELECT COUNT(*) as count FROM recipes').get();
  if (recipeCount.count === 0) {
    seedRecipes();
  }

  // Seed default admin fitness clubs if empty
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  if (adminCount.count === 0) {
    seedInitialData();
  }
}

function seedRecipes() {
  const insertRecipe = db.prepare(`
    INSERT INTO recipes (food_name, prep_time, cook_time, servings, difficulty, ingredients_json, instructions_json, chef_tip, image_emoji)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const recipes = [
    [
      'High-Protein Moong Dal Chilla',
      '15 mins',
      '10 mins',
      '2 chillas',
      'Easy',
      JSON.stringify([
        '1 cup split yellow moong dal (soaked 2 hrs)',
        '1 green chilli & 1-inch ginger piece',
        '1/4 cup finely chopped bell peppers',
        '1/4 cup chopped onions & fresh coriander',
        '1/2 tsp cumin seeds (jeera) & pinch of hing',
        '1 tsp olive oil or cold pressed mustard oil',
        'Pink Himalayan salt to taste'
      ]),
      JSON.stringify([
        'Grind soaked moong dal with ginger, green chilli, and minimal water into a smooth batter.',
        'Stir in finely chopped onions, bell peppers, coriander, cumin, hing, and salt.',
        'Heat a non-stick or cast-iron tawa on medium flame and grease lightly with a few drops of oil.',
        'Pour a ladle of batter and spread gently in circular motion from center outwards.',
        'Cook on medium heat until golden brown, flip and cook the other side for 1-2 minutes.',
        'Serve hot with homemade mint-coriander chutney and 50g low-fat curd.'
      ]),
      'Pair with curd to add probiotics and slow gastric emptying, giving 4+ hours of complete satiety.',
      '🥞'
    ],
    [
      'Paneer Bhurji with Bell Peppers',
      '10 mins',
      '12 mins',
      '1 serving (180g)',
      'Easy',
      JSON.stringify([
        '150g fresh low-fat paneer (crumbled)',
        '1 medium tomato (finely chopped)',
        '1 medium onion (chopped)',
        '1/2 green bell pepper (diced)',
        '1/2 tsp turmeric powder & 1/2 tsp red chilli',
        '1/2 tsp roasted cumin powder & 1/4 tsp garam masala',
        '1 tsp cold-pressed oil & fresh coriander'
      ]),
      JSON.stringify([
        'Heat 1 tsp oil in a pan, add cumin seeds and saute chopped onions until translucent.',
        'Add chopped tomatoes and diced capsicum. Cook on medium flame until soft.',
        'Add turmeric, red chilli powder, cumin powder, and salt. Saute for 1 minute.',
        'Add fresh crumbled paneer and toss gently for 2-3 minutes. Avoid overcooking to keep paneer tender.',
        'Garnish with freshly chopped coriander and a squeeze of fresh lemon juice.'
      ]),
      'Do not saute paneer for more than 3 minutes, otherwise moisture evaporates and texture becomes chewy.',
      '🧀'
    ],
    [
      'Steamed Idli with Drumstick Sambar',
      '20 mins',
      '15 mins',
      '3 idlis + sambar',
      'Moderate',
      JSON.stringify([
        '3 cups fermented idli batter (rice + urad dal 3:1)',
        '1/2 cup toor dal (boiled soft)',
        '1 drumstick (cut into 2-inch pieces) & 1/2 carrot',
        '1 tomato & small piece of tamarind',
        '1 tbsp homemade sambar powder',
        '1/2 tsp mustard seeds, curry leaves & hing'
      ]),
      JSON.stringify([
        'Grease idli plates with 2 drops oil, pour batter into cavities.',
        'Steam in an idli steamer or cooker for 10-12 minutes on high flame.',
        'In a pot, boil vegetables with tamarind water, turmeric, and salt until tender.',
        'Add cooked toor dal and sambar powder. Simmer for 5-7 minutes.',
        'Prepare tadka with mustard seeds, curry leaves, and hing, then pour over boiling sambar.',
        'Unmold hot idlis and serve alongside aromatic sambar.'
      ]),
      'Fermented urad dal creates natural peptides and vitamin B12 precursors with minimal glycemic spike.',
      '🥟'
    ],
    [
      'Yellow Moong Dal Tadka',
      '10 mins',
      '20 mins',
      '2 servings',
      'Easy',
      JSON.stringify([
        '1 cup washed yellow moong dal',
        '2.5 cups water',
        '1/2 tsp turmeric & salt to taste',
        '1 tsp pure desi ghee (for fat-soluble vitamin absorption)',
        '1/2 tsp cumin seeds & 2 garlic cloves (minced)',
        '1 dry red chilli & fresh coriander'
      ]),
      JSON.stringify([
        'Pressure cook moong dal with water, turmeric, and salt for 3 whistles.',
        'Whisk dal lightly to achieve smooth homestyle consistency.',
        'In a small tadka pan, heat 1 tsp ghee. Add cumin seeds and minced garlic until golden.',
        'Add dry red chilli and a pinch of Kashmiri chilli for natural aroma.',
        'Pour hot tadka over boiled dal and immediately cover with lid to trap the flavors for 2 minutes.'
      ]),
      'Adding just 1 tsp ghee dramatically improves absorption of fat-soluble vitamins without excess calories.',
      '🍲'
    ],
    [
      'Sprouts Chaat Salad with Pomegranate',
      '10 mins',
      '5 mins',
      '1 bowl (180g)',
      'Easy',
      JSON.stringify([
        '1 cup sprouted green moong (steamed for 4 mins)',
        '1/4 cup diced cucumber & 1/4 cup diced tomatoes',
        '2 tbsp pomegranate pearls (for antioxidants)',
        '1 tbsp roasted peanuts (crushed)',
        '1/2 tsp chaat masala & pinch of black pepper',
        '1 tbsp freshly squeezed lemon juice'
      ]),
      JSON.stringify([
        'Lightly steam the sprouted moong for 3-4 minutes to soften without killing enzymes.',
        'Transfer sprouts to a large mixing bowl and allow to cool for 5 minutes.',
        'Add diced cucumber, tomatoes, onion, and juicy pomegranate pearls.',
        'Sprinkle chaat masala, roasted jeera powder, pink salt, and black pepper.',
        'Drizzle fresh lemon juice, toss thoroughly, and top with crunchy roasted peanuts.'
      ]),
      'Steaming sprouts for 3 minutes removes anti-nutritional phytic acid while preserving active Vitamin C.',
      '🥗'
    ]
  ];

  for (const r of recipes) {
    insertRecipe.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]);
  }
}

function seedInitialData() {
  const insertAdmin = db.prepare(`
    INSERT INTO admins (email, password, gym_name, logo_url, whatsapp_number, address, city, tagline, ai_coach_name, ai_greeting)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 1. Partner 1: Apex Athletic & Wellness Club
  insertAdmin.run(
    'apex@nutripulse.in',
    'admin123',
    'Apex Athletic & Wellness Club',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
    '+919880123456',
    '#42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    'Bengaluru',
    'Elite Science-Backed Performance & Nutrition',
    'Apex NutriPulse AI Coach',
    'Namaste! I am your Apex NutriPulse AI Coach. Let’s balance your daily macros, optimize hydration, and reach your fitness targets!'
  );

  // 2. Partner 2: IronCore Strength Club
  insertAdmin.run(
    'contact@ironcore.com',
    'admin123',
    'IronCore Strength & Crossfit Arena',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&auto=format&fit=crop&q=80',
    '+919820987654',
    'Plot 18, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    'Mumbai',
    'Functional Strength & Hypertrophy Excellence',
    'IronCore Coach AI',
    'Welcome to IronCore! I am your 24/7 WhatsApp AI Coach. Send me your workout updates, food photos, or swap requests!'
  );

  // 3. Partner 3: Urban Fit Arena
  insertAdmin.run(
    'info@urbanfit.in',
    'admin123',
    'UrbanFit Wellness Arena',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&auto=format&fit=crop&q=80',
    '+919811234567',
    'Building 5B, DLF Cyber City, Phase 2, Gurugram, Haryana 122002',
    'Gurugram',
    'Smarter Nutrition for Busy Professionals',
    'UrbanFit AI Assistant',
    'Hi! Busy schedule? I help you stay on track with smart Indian restaurant choices, travel meals, and quick protein fixes.'
  );

  // Seed default customer
  const insertCustomer = db.prepare(`
    INSERT INTO customers (
      gym_id, email, password, name, phone, age, sex, height, current_weight, target_weight,
      waist, activity_level, workout_frequency, goal, work_type, diet_type, cuisine, meal_frequency,
      budget, allergies, health_condition, safety_flag
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const customerRes = insertCustomer.run(
    1,
    'rahul.sharma@example.com',
    'user123',
    'Rahul Sharma',
    '+919876543210',
    31,
    'Male',
    175,
    82,
    72,
    94,
    'Moderate',
    4,
    'Fat-loss',
    'Office / Tech Worker',
    'Vegetarian',
    'North Indian',
    4,
    'Moderate',
    'None',
    'None',
    'Green'
  );

  const customerId = customerRes.lastInsertRowid;

  // Insert Nutrition Profile for Rahul
  db.prepare(`
    INSERT INTO nutrition_profiles (customer_id, calorie_target, protein_target, carb_target, fat_target, fiber_target, water_target)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(customerId, 1850, 115, 195, 48, 32, 3.2);

  // Seed sample workout for today
  const todayStr = new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO workouts (customer_id, workout_type, duration_minutes, calories_burned, intensity, logged_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(customerId, 'Strength Training (Push Day)', 45, 260, 'Moderate', todayStr);
}
