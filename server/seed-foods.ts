import { drizzle } from "drizzle-orm/mysql2";
import { foods } from "../drizzle/schema";

const sampleFoods = [
  // Proteins
  { name: "Grilled Chicken Breast", calories: 165, protein: "31", carbs: "0", fat: "3.6", servingSize: "100g", category: "protein" },
  { name: "Salmon Fillet", calories: 280, protein: "25", carbs: "0", fat: "17", servingSize: "100g", category: "protein" },
  { name: "Eggs (Large)", calories: 155, protein: "13", carbs: "1.1", fat: "11", servingSize: "1 egg", category: "protein" },
  { name: "Greek Yogurt", calories: 59, protein: "10", carbs: "3.3", fat: "0.4", servingSize: "100g", category: "protein" },
  { name: "Lean Ground Beef", calories: 250, protein: "26", carbs: "0", fat: "15", servingSize: "100g", category: "protein" },
  { name: "Tofu", calories: 76, protein: "8", carbs: "1.9", fat: "4.8", servingSize: "100g", category: "protein" },
  
  // Carbs
  { name: "Brown Rice", calories: 111, protein: "2.6", carbs: "23", fat: "0.9", servingSize: "100g cooked", category: "carbs" },
  { name: "Sweet Potato", calories: 86, protein: "1.6", carbs: "20", fat: "0.1", servingSize: "100g", category: "carbs" },
  { name: "Whole Wheat Bread", calories: 247, protein: "13", carbs: "41", fat: "3.3", servingSize: "1 slice", category: "carbs" },
  { name: "Oatmeal", calories: 150, protein: "5", carbs: "27", fat: "3", servingSize: "40g dry", category: "carbs" },
  { name: "Banana", calories: 89, protein: "1.1", carbs: "23", fat: "0.3", servingSize: "1 medium", category: "carbs" },
  { name: "Quinoa", calories: 120, protein: "4.4", carbs: "21", fat: "1.9", servingSize: "100g cooked", category: "carbs" },
  
  // Vegetables
  { name: "Broccoli", calories: 34, protein: "2.8", carbs: "7", fat: "0.4", servingSize: "100g", category: "vegetable" },
  { name: "Spinach", calories: 23, protein: "2.9", carbs: "3.6", fat: "0.4", servingSize: "100g", category: "vegetable" },
  { name: "Bell Pepper", calories: 31, protein: "1", carbs: "6", fat: "0.3", servingSize: "100g", category: "vegetable" },
  { name: "Carrots", calories: 41, protein: "0.9", carbs: "10", fat: "0.2", servingSize: "100g", category: "vegetable" },
  { name: "Tomato", calories: 18, protein: "0.9", carbs: "3.9", fat: "0.2", servingSize: "100g", category: "vegetable" },
  
  // Fruits
  { name: "Apple", calories: 52, protein: "0.3", carbs: "14", fat: "0.2", servingSize: "1 medium", category: "fruit" },
  { name: "Blueberries", calories: 57, protein: "0.7", carbs: "14", fat: "0.3", servingSize: "100g", category: "fruit" },
  { name: "Orange", calories: 47, protein: "0.9", carbs: "12", fat: "0.3", servingSize: "1 medium", category: "fruit" },
  
  // Snacks
  { name: "Almonds", calories: 579, protein: "21", carbs: "22", fat: "50", servingSize: "100g", category: "snack" },
  { name: "Peanut Butter", calories: 588, protein: "25", carbs: "20", fat: "50", servingSize: "2 tbsp", category: "snack" },
  { name: "Dark Chocolate", calories: 598, protein: "12", carbs: "46", fat: "43", servingSize: "100g", category: "snack" },
];

async function seedFoods() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  console.log("Seeding foods...");
  
  for (const food of sampleFoods) {
    await db.insert(foods).values(food as any);
  }
  
  console.log("✓ Foods seeded successfully");
  process.exit(0);
}

seedFoods().catch((err) => {
  console.error("Error seeding foods:", err);
  process.exit(1);
});
