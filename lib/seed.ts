import { db } from './db'
import { foods, type InsertFood } from './schema'

const seedFoods: InsertFood[] = [
  // ─── Non-Vegetarian ───
  { name: 'Grilled Chicken Breast', calories: 165, proteinG: '31', carbsG: '0', fatG: '3.6', servingSize: '100g', category: 'protein', dietType: 'non_vegetarian' },
  { name: 'Salmon Fillet', calories: 208, proteinG: '20', carbsG: '0', fatG: '13', servingSize: '100g', category: 'protein', dietType: 'non_vegetarian' },
  { name: 'Tandoori Chicken', calories: 237, proteinG: '27', carbsG: '4', fatG: '12', servingSize: '1 piece', category: 'protein', dietType: 'non_vegetarian' },
  { name: 'Chicken Biryani', calories: 620, proteinG: '36', carbsG: '68', fatG: '22', servingSize: '1 plate', category: 'main', dietType: 'non_vegetarian' },
  { name: 'Eggs (2 boiled)', calories: 155, proteinG: '13', carbsG: '1.1', fatG: '11', servingSize: '2 eggs', category: 'protein', dietType: 'non_vegetarian' },
  { name: 'Greek Yogurt Bowl', calories: 386, proteinG: '26', carbsG: '42', fatG: '12', servingSize: '1 bowl', category: 'breakfast', dietType: 'non_vegetarian' },
  { name: 'Caesar Salad with Chicken', calories: 480, proteinG: '38', carbsG: '26', fatG: '22', servingSize: '1 bowl', category: 'main', dietType: 'non_vegetarian' },
  { name: 'Tuna Sandwich', calories: 350, proteinG: '28', carbsG: '32', fatG: '12', servingSize: '1 sandwich', category: 'snack', dietType: 'non_vegetarian' },
  { name: 'Grilled Fish Tacos', calories: 420, proteinG: '30', carbsG: '38', fatG: '16', servingSize: '2 tacos', category: 'main', dietType: 'non_vegetarian' },
  { name: 'Chicken Shawarma Bowl', calories: 520, proteinG: '35', carbsG: '48', fatG: '18', servingSize: '1 bowl', category: 'main', dietType: 'non_vegetarian' },

  // ─── Vegetarian ───
  { name: 'Paneer Tikka', calories: 280, proteinG: '18', carbsG: '8', fatG: '20', servingSize: '100g', category: 'protein', dietType: 'vegetarian' },
  { name: 'Dal Tadka & Roti', calories: 440, proteinG: '22', carbsG: '56', fatG: '14', servingSize: '1 plate', category: 'main', dietType: 'vegetarian' },
  { name: 'Rajma Chawal', calories: 510, proteinG: '18', carbsG: '74', fatG: '12', servingSize: '1 plate', category: 'main', dietType: 'vegetarian' },
  { name: 'Palak Paneer', calories: 310, proteinG: '16', carbsG: '12', fatG: '22', servingSize: '1 cup', category: 'main', dietType: 'vegetarian' },
  { name: 'Masoor Dal & Rice', calories: 390, proteinG: '18', carbsG: '62', fatG: '6', servingSize: '1 plate', category: 'main', dietType: 'vegetarian' },
  { name: 'Idli & Sambar', calories: 290, proteinG: '10', carbsG: '52', fatG: '4', servingSize: '3 idli', category: 'breakfast', dietType: 'vegetarian' },
  { name: 'Poha', calories: 310, proteinG: '8', carbsG: '48', fatG: '10', servingSize: '1 bowl', category: 'breakfast', dietType: 'vegetarian' },
  { name: 'Curd Rice', calories: 280, proteinG: '10', carbsG: '42', fatG: '8', servingSize: '1 bowl', category: 'main', dietType: 'vegetarian' },
  { name: 'Egg Curry & Roti', calories: 420, proteinG: '20', carbsG: '40', fatG: '18', servingSize: '1 plate', category: 'main', dietType: 'vegetarian' },
  { name: 'Paneer Paratha', calories: 350, proteinG: '14', carbsG: '38', fatG: '16', servingSize: '2 paratha', category: 'breakfast', dietType: 'vegetarian' },

  // ─── Vegan ───
  { name: 'Tofu Stir Fry', calories: 220, proteinG: '20', carbsG: '8', fatG: '14', servingSize: '1 cup', category: 'protein', dietType: 'vegan' },
  { name: 'Chickpea Curry (Chana Masala)', calories: 360, proteinG: '14', carbsG: '48', fatG: '12', servingSize: '1 cup', category: 'main', dietType: 'vegan' },
  { name: 'Lentil Soup (Masoor)', calories: 230, proteinG: '18', carbsG: '32', fatG: '4', servingSize: '1 bowl', category: 'soup', dietType: 'vegan' },
  { name: 'Quinoa Buddha Bowl', calories: 420, proteinG: '16', carbsG: '58', fatG: '14', servingSize: '1 bowl', category: 'main', dietType: 'vegan' },
  { name: 'Avocado Toast (Sourdough)', calories: 310, proteinG: '8', carbsG: '34', fatG: '16', servingSize: '2 slices', category: 'breakfast', dietType: 'vegan' },
  { name: 'Smoothie Bowl (Acai)', calories: 290, proteinG: '8', carbsG: '52', fatG: '8', servingSize: '1 bowl', category: 'breakfast', dietType: 'vegan' },
  { name: 'Black Bean Tacos', calories: 340, proteinG: '14', carbsG: '48', fatG: '10', servingSize: '2 tacos', category: 'main', dietType: 'vegan' },
  { name: 'Vegetable Biryani', calories: 450, proteinG: '12', carbsG: '72', fatG: '14', servingSize: '1 plate', category: 'main', dietType: 'vegan' },
  { name: 'Oatmeal & Banana', calories: 340, proteinG: '10', carbsG: '62', fatG: '6', servingSize: '1 bowl', category: 'breakfast', dietType: 'vegan' },
  { name: 'Hummus & Veggie Wrap', calories: 320, proteinG: '12', carbsG: '42', fatG: '12', servingSize: '1 wrap', category: 'snack', dietType: 'vegan' },

  // ─── Common / Any diet ───
  { name: 'Almonds & Apple', calories: 259, proteinG: '6', carbsG: '34', fatG: '16', servingSize: '28g + 1 fruit', category: 'snack', dietType: 'vegetarian' },
  { name: 'Banana', calories: 105, proteinG: '1.3', carbsG: '27', fatG: '0.4', servingSize: '1 medium', category: 'fruit', dietType: 'vegan' },
  { name: 'Brown Rice', calories: 216, proteinG: '5', carbsG: '45', fatG: '1.8', servingSize: '1 cup cooked', category: 'grain', dietType: 'vegan' },
  { name: 'Whole Wheat Roti', calories: 120, proteinG: '4', carbsG: '24', fatG: '2', servingSize: '1 roti', category: 'grain', dietType: 'vegan' },
  { name: 'Mixed Vegetables (Sabzi)', calories: 150, proteinG: '6', carbsG: '18', fatG: '6', servingSize: '1 cup', category: 'vegetable', dietType: 'vegan' },
  { name: 'Curd / Yogurt', calories: 98, proteinG: '6', carbsG: '4', fatG: '5', servingSize: '100g', category: 'dairy', dietType: 'vegetarian' },
  { name: 'Glass of Milk', calories: 149, proteinG: '8', carbsG: '12', fatG: '8', servingSize: '1 glass', category: 'dairy', dietType: 'vegetarian' },
  { name: 'Protein Shake', calories: 180, proteinG: '25', carbsG: '8', fatG: '4', servingSize: '1 scoop + water', category: 'supplement', dietType: 'vegetarian' },
]

async function seed() {
  console.log('Seeding foods...')
  await db.insert(foods).values(seedFoods).onConflictDoNothing()
  console.log(`Seeded ${seedFoods.length} foods`)
}

seed().catch(console.error)
