/**
 * The Veerji's menu, transcribed from the restaurant's Zomato listing
 * (October 2026). Prices are Zomato's; JustDial lists most of them ₹1
 * higher (₹200 instead of ₹199), so dine-in prices may differ slightly.
 * The kitchen is pure vegetarian.
 *
 * Thali and sizzler contents come from Zomato; other notes are ours.
 * `heat` is our own guide for the Spice-o-meter, not the kitchen's:
 * 0 mild · 1 medium · 2 hot · 3 fiery.
 */
export type Diet = "veg" | "egg" | "nonveg";
export type Heat = 0 | 1 | 2 | 3;

export interface MenuItem {
  name: string;
  price: number;
  diet: Diet;
  heat: Heat;
  note?: string;
  signature?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  blurb: string;
  items: MenuItem[];
}

const v = (name: string, price: number, heat: Heat = 1, extra: Partial<MenuItem> = {}): MenuItem => ({ name, price, diet: "veg", heat, ...extra });
const sig = { signature: true } as const;

export const menu: MenuCategory[] = [
  {
    id: "thali",
    title: "Thalis",
    blurb: "Lunch or dinner, sorted on one plate.",
    items: [
      v("Regular Thali", 199, 1, { note: "2 tandoori butter rotis, rice, dal tadka, paneer kolhapuri, mixed veg, raita, pickle, salad" }),
      v("VRJ Special Thali", 299, 1, {
        ...sig,
        note: "Chef's special: butter roti or lachha paratha, veg pulao, dal tadka, paneer lababdar, jalfrezi, mixed veg, raita, pickle, papad, salad and a dessert",
      }),
    ],
  },
  {
    id: "sizzlers",
    title: "Sizzlers",
    blurb: "Brought to the table smoking on hot iron.",
    items: [
      v("Veg Sizzler", 259, 1, { note: "Veg cutlet, boiled veggies, pineapple, french fries and butter on a hot plate" }),
      v("Paneer Sizzler", 289, 1, { ...sig, note: "Paneer cutlet, french fries, stuffed tomato and capsicum, pineapple and a Mexican sauce" }),
      v("Chinese Sizzler", 279, 2, { note: "Rice, noodles, fries, two veg lollipops and Manchurian with paneer" }),
    ],
  },
  {
    id: "starters",
    title: "Starters",
    blurb: "Paneer, chaap and kebabs off the tandoor.",
    items: [
      v("Paneer Tikka", 229, 1, { note: "The classic: yoghurt, spice, charcoal" }),
      v("Paneer Pickle Tikka", 249, 2, { note: "Marinated in achari masala, sharp and tangy" }),
      v("Paneer Peshawari Tikka", 319, 1),
      v("Paneer Poshida", 319, 1, { note: "Paneer with a hidden stuffing" }),
      v("Paneer Malai Tikka", 259, 0, { note: "Cream, cheese and cardamom. The gentle one." }),
      v("Paneer Banjara", 249, 2),
      v("VRJ Special Paneer Parinda", 319, 1, { ...sig, note: "Chef's special, from the tandoor" }),
      v("Hara Bhara Kebab", 179, 1, { note: "Spinach, peas and potato patties" }),
      v("Veg Seekh Kebab", 189, 1),
      v("Lehsuni Dhingri Kebab", 209, 1, { note: "Garlicky mushroom kebabs" }),
      v("Cheese Chilli Onion Seek Kebab", 319, 2),
      v("Kurkura Kebab", 249, 1, { note: "Crisp-coated and crunchy" }),
      v("Jaalimi Kebab", 179, 1),
      v("Dahi Sholey", 199, 0, { ...sig, note: "Crisp bread rolls with a cool hung-curd filling" }),
      v("Tandoori Lazakat", 199, 1),
      v("Hariyali Chaap", 199, 1, { note: "Soya chaap in a green herb marinade" }),
      v("Peshwari Chaap", 249, 1, { note: "Soya chaap, Peshawar style" }),
    ],
  },
  {
    id: "soups",
    title: "Soups",
    blurb: "Desi, Chinese and creamy.",
    items: [
      v("Cream of Tomato Soup", 99, 0),
      v("Tomato Shorba", 109, 1),
      v("Hot and Sour Soup", 99, 2),
      v("Manchow Soup", 99, 2, { note: "With crispy noodles on top" }),
      v("Lemon Coriander Soup", 99, 0),
      v("Z Pepper Soup", 109, 2),
      v("Veg Clear Soup", 99, 0),
      v("Sweet Corn Soup", 99, 0),
      v("Veg Wonton Soup", 109, 1),
      v("Roasted Bell Pepper Soup", 139, 1),
      v("All Fungi Soup", 119, 0, { note: "Mushrooms, three ways" }),
      v("Talumein Soup", 99, 1),
      v("Laksa Lemak Soup", 149, 1, { note: "Coconut and lemongrass, Malaysian style" }),
      v("Cream of Mushroom Soup", 109, 0),
    ],
  },
  {
    id: "salads",
    title: "Salads",
    blurb: "Fresh and crunchy on the side.",
    items: [
      v("Green Salad", 59, 0),
      v("Onion Salad", 49, 0),
      v("Tomato Salad", 39, 0),
      v("Punjabi Salad", 49, 1),
      v("Russian Salad", 119, 0, { note: "Potato, green peas and carrot in mayonnaise" }),
      v("Mexican Salad", 129, 0, { note: "Lettuce, green peas and carrot in mayonnaise" }),
    ],
  },
  {
    id: "mains",
    title: "Main course",
    blurb: "Paneer, kofta, dal and seasonal veg.",
    items: [
      v("Paneer Lababdar", 279, 1, { ...sig, note: "Paneer in a rich, buttery tomato-onion gravy" }),
      v("VRJ Special Paneer Indian", 329, 1, { ...sig, note: "Chef's special" }),
      v("Paneer Butter Masala", 259, 0),
      v("Shahi Paneer", 279, 0, { note: "Creamy, cashew-rich, a little sweet" }),
      v("Kadhai Paneer", 249, 2, { note: "With peppers and freshly pounded kadhai masala" }),
      v("Paneer Tikka Masala", 299, 1),
      v("Paneer Angara", 279, 3, { note: "Angara means ember. Smoky and fiery." }),
      v("Paneer Pardanashi", 269, 1, { note: "Sealed under a bread crust" }),
      v("Kaju Paneer Masala", 279, 1),
      v("Matar Paneer Masala", 239, 1),
      v("Paneer Kolhapuri", 229, 3, { note: "Kolhapur's red chilli heat" }),
      v("Paneer Kalmi", 239, 1),
      v("Paneer Finger Masala", 319, 1),
      v("Palak Paneer", 229, 1),
      v("Veg Kofta", 199, 1),
      v("Malai Kofta", 239, 0, { note: "Soft koftas in a mild, creamy gravy" }),
      v("Adraki Kofta", 249, 1, { note: "With a warm ginger edge" }),
      v("Cheese Angari Kofta", 219, 2),
      v("Corn Palak", 209, 1),
      v("Methi Matar Malai", 239, 0),
      v("Mushroom Masala", 229, 1),
      v("Mushroom Matar Masala", 239, 1),
      v("Veg Mixed", 209, 1),
      v("Veg Kolhapuri", 219, 3),
      v("Veg Jaipuri", 229, 2),
      v("Bhindi Masala", 179, 1),
      v("Bhindi Kurkuri", 149, 1, { note: "Crisp-fried okra" }),
      v("Chana Masala", 149, 2),
      v("Jeera Aloo", 129, 1),
      v("Dal Makhani", 229, 0, { ...sig, note: "Black dal, slow-cooked with butter and cream" }),
      v("Dal Fry", 139, 1),
      v("Dal Tadka", 149, 1),
      v("Dal Punjabi", 159, 1),
      v("Jeera Dal", 129, 1),
    ],
  },
  {
    id: "breads",
    title: "Breads",
    blurb: "From the tawa and the tandoor.",
    items: [
      v("Tawa Roti", 15, 0),
      v("Tawa Butter Roti", 20, 0),
      v("Tandoori Roti", 15, 0),
      v("Tandoori Butter Roti", 20, 0),
      v("Missi Roti", 30, 1),
      v("Plain Naan", 40, 0),
      v("Butter Naan", 50, 0),
      v("Garlic Naan", 55, 0),
      v("Chilli Cheese Garlic Naan", 79, 2),
      v("Chur Chur Naan", 60, 0, { note: "Crushed, flaky and buttery" }),
      v("Stuffed Chur Chur Naan", 70, 1, { ...sig, note: "Flaky layers with a spiced filling" }),
      v("Lachha Paratha", 40, 0),
      v("Plain Kulcha", 35, 0),
    ],
  },
  {
    id: "rice",
    title: "Rice & biryani",
    blurb: "Pulao, khichdi and dum biryani.",
    items: [
      v("Veg Dum Biryani", 209, 2, { ...sig, note: "Sealed and cooked on dum" }),
      v("Veg Biryani", 199, 2),
      v("Plain Rice", 89, 0),
      v("Jeera Rice", 109, 0),
      v("Masala Rice", 129, 1),
      v("Veg Pulao", 149, 0),
      v("Matar Pulao", 159, 0),
      v("Paneer Pulao", 179, 0),
      v("Kashmiri Pulao", 189, 0, { note: "Fruit and nuts, mildly sweet" }),
      v("Khichdi", 159, 0),
      v("Butter Khichdi", 179, 0),
    ],
  },
  {
    id: "chinese",
    title: "Chinese",
    blurb: "Indo-Chinese, high flame, plenty of sauce.",
    items: [
      v("VRJ Special Chinese Paneer", 279, 2, { ...sig, note: "Chef's special" }),
      v("Veg Kothe", 179, 2, { ...sig, note: "Pan-fried dumplings in a spicy sauce" }),
      v("Paneer 65", 259, 2),
      v("Veg Lollipop", 189, 1),
      v("Chilli Potato", 199, 2),
      v("Crispy Chilli Honey Potato", 219, 1, { note: "Sweet, crisp and a little hot" }),
      v("Manchurian Dry", 199, 2),
      v("Manchurian Gravy", 199, 2),
      v("Gobi Manchurian Dry", 179, 2),
      v("Gobi Manchurian Gravy", 179, 2),
      v("Smokey Paneer", 279, 2),
      v("Paneer Black Pepper", 209, 2),
      v("Chilli Paneer Dry", 219, 2),
      v("Chilli Paneer Gravy", 219, 2),
      v("Dragon Paneer", 269, 3, { note: "Red, sticky and fiery" }),
      v("Mexican Paneer Roll", 349, 1),
      v("Stir Fried Hong Kong Mushroom", 249, 2),
      v("Chilli Mushroom Dry", 219, 2),
      v("Chilli Mushroom Gravy", 219, 2),
      v("Mushroom Black Pepper", 219, 2),
      v("Chilli Mushroom Baby Corn", 219, 2),
      v("Corn Salt and Pepper", 199, 1),
      v("Corn Cake Kebab Chinese Style", 199, 1),
    ],
  },
  {
    id: "noodles",
    title: "Fried rice & noodles",
    blurb: "Hakka, Schezwan, Singapuri, chopsuey.",
    items: [
      v("Veg Fried Rice", 169, 1),
      v("Veg Triple Fried Rice", 199, 2, { note: "Rice, noodles and gravy together" }),
      v("Veg Paneer Fried Rice", 189, 1),
      v("Veg Schezwan Fried Rice", 179, 3),
      v("Veg Noodles", 139, 1),
      v("Veg Hakka Noodles", 149, 1),
      v("Veg Schezwan Noodles", 169, 3),
      v("Veg Singapuri Noodles", 189, 2),
      v("Hong Kong Noodles", 179, 2),
      v("Paneer Noodles", 189, 1),
      v("American Chopsuey", 199, 1, { note: "Crisp noodles under a sweet-sour sauce" }),
    ],
  },
  {
    id: "south",
    title: "South Indian",
    blurb: "Dosas, uttapams and idli.",
    items: [
      v("Idli Sambhar", 119, 1),
      v("Plain Dosa", 99, 1),
      v("Masala Dosa", 119, 1),
      v("Rava Dosa", 119, 1),
      v("Paper Dosa", 189, 1, { note: "Thin, crisp and taller than the plate" }),
      v("Paneer Dosa", 149, 1),
      v("Onion Uttapam", 129, 1),
      v("Tomato Uttapam", 129, 1),
      v("Paneer Uttapam", 139, 1),
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    blurb: "Red, white or green.",
    items: [
      v("Red Sauce Pasta", 209, 1),
      v("White Sauce Pasta", 229, 0),
      v("Green Sauce Pasta", 199, 0),
      v("Italian Style Cheese Stick Pasta", 99, 0),
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwiches",
    blurb: "Grilled, cheesy, cafe-style.",
    items: [
      v("Veg Sandwich", 79, 0),
      v("Masala Sandwich", 89, 1),
      v("Veg Cheese Grilled Sandwich", 109, 0),
      v("Paneer Cheese Sandwich", 119, 0),
      v("Veg Cheese Masala Paneer Grilled Sandwich", 149, 1),
      v("VRJ Special Sandwich", 159, 1, { note: "Chef's special" }),
    ],
  },
  {
    id: "snacks",
    title: "Snacks & kulchas",
    blurb: "Rolls, pakodas, chaat and Amritsari kulcha.",
    items: [
      v("Chinese Bhel", 149, 2),
      v("Veg Spring Roll", 199, 1),
      v("Paneer Roll", 149, 1),
      v("Paneer Spring Roll", 249, 1),
      v("Paneer Cheese Spider Roll", 249, 1),
      v("Cheese Balls", 199, 0),
      v("Crispy Corn", 199, 1),
      v("Dehraduni Pakoda", 129, 1),
      v("Mixed Pakoda", 149, 1),
      v("Paneer Pakoda", 179, 1),
      v("Onion Pakoda", 99, 1),
      v("Chana Roasted", 119, 1),
      v("Peanut Chaat", 119, 1),
      v("Peanut Masala", 109, 1),
      v("French Fries", 109, 0),
      v("Amritsari Kulcha", 80, 1),
      v("Onion Kulcha", 60, 1),
      v("Paneer Kulcha", 70, 1),
      v("Matar Kulcha", 70, 1),
    ],
  },
  {
    id: "sides",
    title: "Papad & raita",
    blurb: "The little things that finish a meal.",
    items: [
      v("Roasted Papad", 25, 0),
      v("Fried Papad", 25, 0),
      v("Masala Papad, Roasted", 39, 1),
      v("Masala Papad, Fried", 39, 1),
      v("Plain Curd", 49, 0),
      v("Fruit Raita", 79, 0),
      v("Boondi Raita", 59, 0),
      v("Veg Raita", 59, 0),
    ],
  },
  {
    id: "drinks",
    title: "Shakes, coffee & mocktails",
    blurb: "Hot, cold and very cold. All non-alcoholic.",
    items: [
      v("Cold Coffee", 99, 0, { ...sig, note: "What the cafe crowd orders" }),
      v("Hot Coffee", 39, 0),
      v("Tea", 25, 0),
      v("KitKat Shake", 129, 0),
      v("Oreo Shake", 119, 0),
      v("Butterscotch Shake", 109, 0),
      v("Chocolate Shake", 99, 0),
      v("Pineapple Shake", 99, 0),
      v("Banana Shake", 89, 0),
      v("Mango Shake", 89, 0),
      v("Vanilla Shake", 89, 0),
      v("Virgin Mojito", 99, 0),
      v("Blue Lagoon Mojito", 69, 0),
      v("Orange Mocktail", 109, 0),
      v("Litchi Mocktail", 109, 0),
      v("Kiwi Mocktail", 109, 0),
      v("Black Currant Mocktail", 99, 0),
      v("Fresh Lime Soda", 49, 0),
      v("Lemon Juice", 39, 0),
      v("Jal Jeera", 29, 1),
      v("Sweet Lassi", 99, 0),
      v("Salted Lassi", 99, 0),
      v("Milk", 39, 0),
      v("Plain Soda", 29, 0),
    ],
  },
];

export const allItems = menu.flatMap((c) => c.items.map((item) => ({ ...item, category: c.id })));

export const signatureItems = allItems.filter((i) => i.signature);

export const itemCount = allItems.length;

export const dietLabel: Record<Diet, string> = { veg: "Veg", egg: "Egg", nonveg: "Non-veg" };
