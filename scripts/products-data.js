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
        name: "Toothpaste",
        brand: "Elmex",
        image: "assets/products/toothpaste-budget.webp",
        url: "https://www.dm.cz/p/d/2011734/elmex-zubni-pasta-caries-protection",
        price: { amount: 0, currency: "EUR" }   // optional fallback if scraping fails
      },
      recommended: {
        name: "Toothpaste",
        brand: "BIOMED",
        image: "assets/products/toothpaste-recommended.webp",
        url: "https://www.drmax.cz/biomed-natural-whitening-zubni-pasta-100-g"
      },
      best: {
        name: "Toothpaste",
        brand: "WELEDA",
        image: "assets/products/toothpaste-best.webp",
        url: "https://www.dm.cz/p/d/1036943/weleda-zubni-pasta-sole"
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
        name: "Toothbrush",
        brand: "My White Secret",
        image: "assets/products/toothbrush-budget.webp",
        url: "https://www.mywhitesecret.cz/produkty-mywhite-secret-bambusovy-zubni-kartacek/?hgtid=1844b1e3-278d-44f4-9dce-335163797ce9",
        price: { amount: 0, currency: "EUR" }   // optional fallback if scraping fails
      },
      recommended: {
        name: "Toothbrush",
        brand: "Brand name",
        image: "assets/products/toothbrush-recommended.webp",
        url: "https://www.drmax.cz/curanatura-bamboo-extra-soft-bambusovy-kartacek"
      },
      best: {
        name: "Toothbrush",
        brand: "Brand name",
        image: "assets/products/toothpaste-recommended.webp",
        url: "https://www.drmax.cz/curanatura-bamboo-extra-soft-bambusovy-kartacek"
      }
    }
  }
];
