import { supabase } from "./supabaseClient";

export type Category =
  | "mexican" | "greek" | "breakfast" | "italian" | "pizza" | "bar" | "bbq"
  | "cafe" | "diner" | "deli" | "thai" | "ramen" | "asian" | "sushi" | "burger"
  | "cuban" | "indian" | "french" | "bistro" | "brew" | "steak"
  | "sandwiches" | "american" | "other";

export interface Restaurant {
  name: string;
  category: Category;
  tagline: string;
  menuUrl?: string;
  custom?: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  mexican:   "Mexican",
  greek:     "Greek",
  breakfast: "Breakfast & Brunch",
  italian:   "Italian",
  pizza:     "Pizza",
  bar:       "Bar & Grill",
  bbq:       "BBQ",
  cafe:      "Café",
  diner:     "Diner",
  deli:      "Deli & Sandwiches",
  thai:      "Thai",
  ramen:     "Ramen",
  sushi:     "Sushi & Japanese",
  burger:    "Burgers",
  cuban:     "Cuban",
  indian:    "Indian",
  french:    "French",
  bistro:    "Bistro",
  brew:      "Beer Bar",
  steak:     "Steak",
  sandwiches: "Sandwiches",
  american:  "American",
  other:     "Restaurant",
};

export const DEFAULT_RESTAURANTS: Restaurant[] = [
  { name: "Plaza Azteca",                   category: "mexican",   tagline: "Vibrant Mexican cuisine" },
  { name: "Jose Tequilas",                  category: "mexican",   tagline: "Tacos, tequila & good times" },
  { name: "Another Broken Egg",             category: "breakfast", tagline: "Morning indulgence, done right" },
  { name: "Sals",                           category: "italian",   tagline: "Old-world Italian comfort" },
  { name: "La Terraza",                     category: "mexican",   tagline: "Fresh flavors, lively atmosphere" },
  { name: "Cheese Shop",                    category: "deli",      tagline: "A Williamsburg institution since 1955" },
  { name: "Mellow Mushroom",                category: "pizza",     tagline: "Far-out pies & good vibes" },
  { name: "Dog Street Pub",                 category: "bar",       tagline: "Colonial charm, cold pints" },
  { name: "Old City BBQ",                   category: "bbq",       tagline: "Low & slow, worth every bite" },
  { name: "Tipsy Bean",                     category: "cafe",      tagline: "Coffee with a little kick" },
  { name: "Shorty's Diner",                 category: "diner",     tagline: "Classic eats, no fuss" },
  { name: "Rick's Cheese Steak Shop",       category: "sandwiches", tagline: "The real Philly deal" },
  { name: "Precarious",                     category: "brew",       tagline: "Craft cocktails & clever bites" },
  { name: "First Watch",                    category: "breakfast", tagline: "Daytime dining at its finest" },
  { name: "Maria Bonita",                   category: "mexican",   tagline: "Authentic south-of-the-border fare" },
  { name: "Ichiban",                        category: "sushi",     tagline: "Japanese tradition on every plate" },
  { name: "Craft 31",                       category: "brew",       tagline: "Local brews & handcrafted food" },
  { name: "K'Bola Cuban",                   category: "cuban",     tagline: "Bold Caribbean flavors" },
  { name: "Bangkok Garden",                 category: "thai",     tagline: "Thai spice, pure delight" },
  { name: "Miyaki Sushi and Grill",         category: "sushi",     tagline: "Pristine fish, artful rolls" },
  { name: "Brass Tap",                      category: "brew",       tagline: "Hundreds of craft beers on tap" },
  { name: "Ramen Time",                     category: "ramen",     tagline: "Steaming bowls, soulful broth" },
  { name: "Paul's Deli New Town",           category: "deli",      tagline: "Fresh-stacked neighborhood staple" },
  { name: "Brunch",                         category: "breakfast", tagline: "Weekend rituals, elevated" },
  { name: "South of The Border",            category: "mexican",   tagline: "Tex-Mex with a kick" },
  { name: "Cook's Burger Bar",              category: "burger",    tagline: "Hand-smashed, flame-kissed perfection" },
  { name: "Burgers On The Edge",            category: "burger",    tagline: "Living on the delicious edge" },
  { name: "Amiraj",                         category: "indian",    tagline: "Rich spices, royal heritage" },
  { name: "The Brunch Company",             category: "breakfast", tagline: "Brunch is always a good idea" },
  { name: "Second Street Bistro",           category: "american",  tagline: "Neighborhood bistro, big flavors" },
  { name: "Le Yaca",                        category: "french",    tagline: "Classic French, beautifully prepared" },
  { name: "Spice Palace Indian",            category: "indian",    tagline: "Aromatic curries & tandoor specialties" },
  { name: "Maurizio's Italian Restaurante", category: "italian",   tagline: "Nonna's recipes, served with love" },
];

export async function loadCustomRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("name, category, tagline, menu_url")
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to load restaurants from Supabase:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    name: row.name,
    category: row.category as Category,
    tagline: row.tagline,
    menuUrl: row.menu_url ?? undefined,
    custom: true,
  }));
}

export async function saveCustomRestaurant(r: Restaurant): Promise<void> {
  const { error } = await supabase.from("restaurants").insert({
    name: r.name,
    category: r.category,
    tagline: r.tagline,
    menu_url: r.menuUrl ?? null,
  });

  if (error) {
    console.error("Failed to save restaurant to Supabase:", error);
    throw error;
  }
}

export async function deleteCustomRestaurant(name: string): Promise<void> {
  const { error } = await supabase.from("restaurants").delete().eq("name", name);

  if (error) {
    console.error("Failed to delete restaurant from Supabase:", error);
    throw error;
  }
}

export function menuHref(r: Restaurant): string {
  if (r.menuUrl) return r.menuUrl;
  return `https://www.google.com/search?q=${encodeURIComponent(`${r.name} menu Williamsburg VA`)}`;
}

export interface ColorScheme {
  bg: string;
  outerBorder: string;
  innerBorder: string;
  corner: string;
  labelTop: string;
  photoOutline: string;
  heading: string;
  tagline: string;
  accentColor: string;
  accentBorder: string;
  accentHoverBg: string;
  photoOverlay: string;
}

export const SCHEMES: ColorScheme[] = [
  {
    bg: "#FEFAF3", outerBorder: "rgba(180,140,100,0.42)", innerBorder: "rgba(180,140,100,0.2)",
    corner: "rgba(196,98,45,0.5)", labelTop: "#7A8C6E", photoOutline: "rgba(180,140,100,0.35)",
    heading: "#2C1A0E", tagline: "#6B4C35", accentColor: "#C4622D",
    accentBorder: "rgba(196,98,45,0.4)", accentHoverBg: "rgba(196,98,45,0.07)", photoOverlay: "rgba(44,26,14,0.35)",
  },
  {
    bg: "#263A2E", outerBorder: "rgba(180,210,170,0.35)", innerBorder: "rgba(180,210,170,0.15)",
    corner: "rgba(200,230,185,0.55)", labelTop: "#A8C89A", photoOutline: "rgba(160,200,148,0.35)",
    heading: "#EEF5EA", tagline: "#A8C89A", accentColor: "#C8E8B4",
    accentBorder: "rgba(200,232,180,0.45)", accentHoverBg: "rgba(200,232,180,0.12)", photoOverlay: "rgba(26,46,30,0.4)",
  },
  {
    bg: "#1A2340", outerBorder: "rgba(210,185,120,0.38)", innerBorder: "rgba(210,185,120,0.18)",
    corner: "rgba(218,182,90,0.6)", labelTop: "#C8A84B", photoOutline: "rgba(210,185,120,0.35)",
    heading: "#F4EDD8", tagline: "#C8A84B", accentColor: "#C8A84B",
    accentBorder: "rgba(218,182,90,0.5)", accentHoverBg: "rgba(218,182,90,0.12)", photoOverlay: "rgba(26,35,64,0.4)",
  },
  {
    bg: "#F2E8E5", outerBorder: "rgba(160,80,90,0.35)", innerBorder: "rgba(160,80,90,0.16)",
    corner: "rgba(160,80,90,0.5)", labelTop: "#A05060", photoOutline: "rgba(160,80,90,0.3)",
    heading: "#2E1018", tagline: "#7A3040", accentColor: "#8C3044",
    accentBorder: "rgba(140,48,68,0.42)", accentHoverBg: "rgba(140,48,68,0.08)", photoOverlay: "rgba(46,16,24,0.35)",
  },
];
