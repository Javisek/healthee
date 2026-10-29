const DEFAULT_CURRENCY = "EUR";   // used if a shop page doesn't state its currency
const PRICE_LOCALE = "en-GB";     // controls how prices are formatted

const TIERS = [
  { id: "budget",      label: "Budget",      hint: "Same or lower price than usual, with fewer harmful ingredients" },
  { id: "recommended", label: "Recommended", hint: "Much better ingredients at an affordable price" },
  { id: "best",        label: "Best",        hint: "The best ingredients and health benefits you can buy" }
];

const CATEGORIES = [
  { id: "oral-hygiene", label: "Oral hygiene" },
  { id: "shower",       label: "Shower" },
  { id: "shaving",      label: "Shaving" },
  { id: "ears",         label: "Ears" },
  { id: "feet",         label: "Feet" },
  { id: "hands-nails",  label: "Hands & nails" },
  { id: "hands-nails",  label: "Skin care" },
  { id: "hands-nails",  label: "Kitchen" },
  { id: "hands-nails",  label: "Bathroom" },
  { id: "hands-nails",  label: "For babies" },
  { id: "hands-nails",  label: "Make-up" },
  { id: "hands-nails",  label: "Other" },
  // add more here, e.g. { id: "hair", label: "Hair" }
];


const PRODUCTS = [
  {
    id: "toothpaste",
    name: "Toothpaste",
    gender: "unisex",              // "men" | "women" | "unisex"
    category: "oral-hygiene",
    defaultTier: "recommended",    // optional, this is the default anyway
    variants: {
      budget: {
        name: "Product name",
        brand: "Brand name",
        image: "assets/products/toothpaste-budget.jpg",
        url: "https://example.com/budget-toothpaste",
        price: { amount: 0, currency: "EUR" }   // optional fallback if scraping fails
      },
      recommended: {
        name: "Product name",
        brand: "Brand name",
        image: "assets/products/toothpaste-recommended.jpg",
        url: "https://example.com/recommended-toothpaste"
      },
      best: {
        name: "Product name",
        brand: "Brand name",
        image: "assets/products/toothpaste-best.jpg",
        url: "https://example.com/best-toothpaste"
      }
    }
  },

  {
    id: "toothbrush",
    name: "Toothbrush",
    gender: "unisex",              // "men" | "women" | "unisex"
    category: "oral-hygiene",
    defaultTier: "recommended",    // optional, this is the default anyway
    variants: {
      budget: {
        name: "Product name",
        brand: "Brand name",
        image: "assets/products/toothpaste-budget.jpg",
        url: "https://example.com/budget-toothpaste",
        price: { amount: 0, currency: "EUR" }   // optional fallback if scraping fails
      },
      recommended: {
        name: "Product name",
        brand: "Brand name",
        image: "assets/products/toothpaste-recommended.jpg",
        url: "https://example.com/recommended-toothpaste"
      },
      best: {
        name: "Product name",
        brand: "Brand name",
        image: "assets/products/toothpaste-best.jpg",
        url: "https://example.com/best-toothpaste"
      }
    }
  }
];
