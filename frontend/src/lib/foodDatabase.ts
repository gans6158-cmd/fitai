export interface FoodItem {
  name: string
  cal: number
  pro: number
  carb: number
  fat: number
}

export const FOODS: FoodItem[] = [
  // Proteins
  { name: 'Chicken Breast (cooked)', cal: 165, pro: 31, carb: 0, fat: 3.6 },
  { name: 'Chicken Thigh (cooked)', cal: 209, pro: 26, carb: 0, fat: 11 },
  { name: 'Chicken Wings', cal: 203, pro: 30, carb: 0, fat: 8.1 },
  { name: 'Beef (lean, cooked)', cal: 215, pro: 26, carb: 0, fat: 12 },
  { name: 'Ground Beef (cooked)', cal: 254, pro: 26, carb: 0, fat: 17 },
  { name: 'Beef Steak', cal: 271, pro: 26, carb: 0, fat: 18 },
  { name: 'Salmon (cooked)', cal: 208, pro: 20, carb: 0, fat: 13 },
  { name: 'Tuna (canned in water)', cal: 109, pro: 25, carb: 0, fat: 0.6 },
  { name: 'Shrimp (cooked)', cal: 99, pro: 24, carb: 0, fat: 0.3 },
  { name: 'Tilapia (cooked)', cal: 128, pro: 26, carb: 0, fat: 2.7 },
  { name: 'Turkey Breast (cooked)', cal: 189, pro: 29, carb: 0, fat: 7.4 },
  { name: 'Pork Loin (cooked)', cal: 242, pro: 27, carb: 0, fat: 14 },
  { name: 'Whole Egg', cal: 155, pro: 13, carb: 1.1, fat: 11 },
  { name: 'Egg White', cal: 52, pro: 11, carb: 0.7, fat: 0.2 },
  { name: 'Egg Yolk', cal: 322, pro: 16, carb: 3.6, fat: 27 },

  // Dairy
  { name: 'Whole Milk', cal: 61, pro: 3.2, carb: 4.8, fat: 3.3 },
  { name: 'Skim Milk', cal: 34, pro: 3.4, carb: 5, fat: 0.1 },
  { name: 'Greek Yogurt (plain)', cal: 59, pro: 10, carb: 3.6, fat: 0.4 },
  { name: 'Yogurt (full fat)', cal: 61, pro: 3.5, carb: 4.7, fat: 3.3 },
  { name: 'Cheddar Cheese', cal: 402, pro: 25, carb: 1.3, fat: 33 },
  { name: 'Mozzarella Cheese', cal: 280, pro: 28, carb: 2.2, fat: 17 },
  { name: 'Cottage Cheese', cal: 98, pro: 11, carb: 3.4, fat: 4.3 },
  { name: 'Paneer', cal: 265, pro: 18, carb: 1.2, fat: 20 },
  { name: 'Butter', cal: 717, pro: 0.9, carb: 0.1, fat: 81 },
  { name: 'Whey Protein Powder', cal: 352, pro: 75, carb: 6, fat: 4 },

  // Grains & Starches
  { name: 'White Rice (cooked)', cal: 130, pro: 2.7, carb: 28, fat: 0.3 },
  { name: 'Brown Rice (cooked)', cal: 111, pro: 2.6, carb: 23, fat: 0.9 },
  { name: 'Basmati Rice (cooked)', cal: 121, pro: 2.5, carb: 25, fat: 0.3 },
  { name: 'Oats (dry)', cal: 389, pro: 17, carb: 66, fat: 7 },
  { name: 'Oatmeal (cooked)', cal: 71, pro: 2.5, carb: 12, fat: 1.5 },
  { name: 'White Bread', cal: 265, pro: 9, carb: 49, fat: 3.2 },
  { name: 'Whole Wheat Bread', cal: 247, pro: 13, carb: 41, fat: 4.2 },
  { name: 'Pasta (cooked)', cal: 131, pro: 5, carb: 25, fat: 1.1 },
  { name: 'Quinoa (cooked)', cal: 120, pro: 4.4, carb: 22, fat: 1.9 },
  { name: 'Roti / Chapati', cal: 297, pro: 9.2, carb: 55, fat: 5.3 },
  { name: 'Naan Bread', cal: 317, pro: 9, carb: 55, fat: 7 },
  { name: 'Corn Tortilla', cal: 218, pro: 5.7, carb: 46, fat: 2.5 },
  { name: 'White Bread Roll', cal: 271, pro: 9, carb: 50, fat: 3.5 },

  // Vegetables
  { name: 'Broccoli', cal: 34, pro: 2.8, carb: 7, fat: 0.4 },
  { name: 'Spinach', cal: 23, pro: 2.9, carb: 3.6, fat: 0.4 },
  { name: 'Kale', cal: 49, pro: 4.3, carb: 8.8, fat: 0.9 },
  { name: 'Lettuce (romaine)', cal: 17, pro: 1.2, carb: 3.3, fat: 0.3 },
  { name: 'Tomato', cal: 18, pro: 0.9, carb: 3.9, fat: 0.2 },
  { name: 'Cucumber', cal: 15, pro: 0.7, carb: 3.6, fat: 0.1 },
  { name: 'Bell Pepper', cal: 31, pro: 1, carb: 6, fat: 0.3 },
  { name: 'Onion', cal: 40, pro: 1.1, carb: 9.3, fat: 0.1 },
  { name: 'Carrot', cal: 41, pro: 0.9, carb: 10, fat: 0.2 },
  { name: 'Potato', cal: 77, pro: 2, carb: 17, fat: 0.1 },
  { name: 'Sweet Potato', cal: 86, pro: 1.6, carb: 20, fat: 0.1 },
  { name: 'Mushroom', cal: 22, pro: 3.1, carb: 3.3, fat: 0.3 },
  { name: 'Cauliflower', cal: 25, pro: 1.9, carb: 5, fat: 0.3 },
  { name: 'Zucchini', cal: 17, pro: 1.2, carb: 3.1, fat: 0.3 },
  { name: 'Green Beans', cal: 31, pro: 1.8, carb: 7, fat: 0.1 },
  { name: 'Peas', cal: 81, pro: 5.4, carb: 14, fat: 0.4 },
  { name: 'Corn', cal: 86, pro: 3.3, carb: 19, fat: 1.4 },

  // Fruits
  { name: 'Banana', cal: 89, pro: 1.1, carb: 23, fat: 0.3 },
  { name: 'Apple', cal: 52, pro: 0.3, carb: 14, fat: 0.2 },
  { name: 'Orange', cal: 47, pro: 0.9, carb: 12, fat: 0.1 },
  { name: 'Mango', cal: 60, pro: 0.8, carb: 15, fat: 0.4 },
  { name: 'Grapes', cal: 69, pro: 0.7, carb: 18, fat: 0.2 },
  { name: 'Strawberries', cal: 32, pro: 0.7, carb: 7.7, fat: 0.3 },
  { name: 'Blueberries', cal: 57, pro: 0.7, carb: 14, fat: 0.3 },
  { name: 'Watermelon', cal: 30, pro: 0.6, carb: 7.6, fat: 0.2 },
  { name: 'Pineapple', cal: 50, pro: 0.5, carb: 13, fat: 0.1 },
  { name: 'Avocado', cal: 160, pro: 2, carb: 9, fat: 15 },
  { name: 'Dates', cal: 282, pro: 2.5, carb: 75, fat: 0.4 },

  // Legumes
  { name: 'Lentils (cooked)', cal: 116, pro: 9, carb: 20, fat: 0.4 },
  { name: 'Chickpeas (cooked)', cal: 164, pro: 8.9, carb: 27, fat: 2.6 },
  { name: 'Black Beans (cooked)', cal: 132, pro: 8.9, carb: 24, fat: 0.5 },
  { name: 'Kidney Beans (cooked)', cal: 127, pro: 8.7, carb: 23, fat: 0.5 },
  { name: 'Dal (cooked)', cal: 116, pro: 8, carb: 20, fat: 0.6 },
  { name: 'Tofu (firm)', cal: 76, pro: 8, carb: 1.9, fat: 4.8 },
  { name: 'Edamame', cal: 121, pro: 11, carb: 9, fat: 5.2 },

  // Nuts & Seeds
  { name: 'Almonds', cal: 579, pro: 21, carb: 22, fat: 50 },
  { name: 'Walnuts', cal: 654, pro: 15, carb: 14, fat: 65 },
  { name: 'Cashews', cal: 553, pro: 18, carb: 30, fat: 44 },
  { name: 'Peanuts', cal: 567, pro: 26, carb: 16, fat: 49 },
  { name: 'Peanut Butter', cal: 588, pro: 25, carb: 20, fat: 50 },
  { name: 'Chia Seeds', cal: 486, pro: 17, carb: 42, fat: 31 },
  { name: 'Sunflower Seeds', cal: 584, pro: 21, carb: 20, fat: 51 },

  // Oils & Fats
  { name: 'Olive Oil', cal: 884, pro: 0, carb: 0, fat: 100 },
  { name: 'Coconut Oil', cal: 862, pro: 0, carb: 0, fat: 100 },
  { name: 'Ghee', cal: 900, pro: 0, carb: 0, fat: 99.5 },

  // Indian Foods
  { name: 'Idli', cal: 58, pro: 2, carb: 12, fat: 0.1 },
  { name: 'Dosa', cal: 168, pro: 3.8, carb: 27, fat: 5 },
  { name: 'Sambar', cal: 49, pro: 2.7, carb: 8, fat: 0.9 },
  { name: 'Rice & Dal', cal: 100, pro: 4, carb: 20, fat: 0.5 },
  { name: 'Biryani', cal: 180, pro: 6, carb: 28, fat: 5.5 },
  { name: 'Rajma (cooked)', cal: 127, pro: 8.7, carb: 22, fat: 0.5 },

  // Common packaged / fast food
  { name: 'Milk Chocolate', cal: 535, pro: 7.6, carb: 60, fat: 30 },
  { name: 'Dark Chocolate (70%)', cal: 598, pro: 7.8, carb: 46, fat: 43 },
  { name: 'Orange Juice', cal: 45, pro: 0.7, carb: 10, fat: 0.2 },
  { name: 'Honey', cal: 304, pro: 0.3, carb: 82, fat: 0 },
  { name: 'Sugar', cal: 387, pro: 0, carb: 100, fat: 0 },
  { name: 'White Rice (uncooked)', cal: 365, pro: 7.1, carb: 80, fat: 0.7 },
  { name: 'Pizza (cheese)', cal: 266, pro: 11, carb: 33, fat: 10 },
]

export function searchFoods(query: string): FoodItem[] {
  if (!query || query.length < 1) return []
  const lower = query.toLowerCase()
  return FOODS.filter(f => f.name.toLowerCase().includes(lower)).slice(0, 8)
}
