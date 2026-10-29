const GENDERS = [
  { id: "all",   label: "All" },
  { id: "men",   label: "Men" },
  { id: "women", label: "Women" }
];

const GENDER_ICONS = {
  men:    { icons: ["male"],           label: "Men's product" },
  women:  { icons: ["female"],         label: "Women's product" },
  unisex: { icons: ["male", "female"], label: "Unisex product" }
};

const genderBox     = document.getElementById("gender-filters");
const categoryBox   = document.getElementById("category-filters");
const grid          = document.getElementById("product-grid");
const emptyState    = document.getElementById("empty-state");
const countEl       = document.getElementById("result-count");
const filtersToggle = document.getElementById("filters-toggle");
const filtersCount  = document.getElementById("filters-count");
const categoryPanel = document.getElementById("category-panel");
const clearBtn      = document.getElementById("clear-categories");

/* ---------- State ---------- */

const params = new URLSearchParams(location.search);
const validCategoryIds = CATEGORIES.map(c => c.id);

const state = {
  gender: GENDERS.some(g => g.id === params.get("gender")) ? params.get("gender") : "all",
  categories: new Set(
    (params.get("category") || "").split(",").filter(id => validCategoryIds.includes(id))
  )
};

let prices = {};                       // filled from data/prices.json
const selectedTier = new Map();        // remembers each item's chosen tier across re-renders
let renderedCards = [];                // [{ card, item }]

const getTier = (item) => selectedTier.get(item.id) ?? item.defaultTier ?? "recommended";

/* ---------- Helpers ---------- */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function getPrice(item, tier) {
  return prices[`${item.id}:${tier}`] ?? item.variants[tier].price ?? null;
}

function formatPrice(p) {
  if (!p) return "Check price";
  try {
    return new Intl.NumberFormat(PRICE_LOCALE, {
      style: "currency",
      currency: p.currency ?? DEFAULT_CURRENCY
    }).format(p.amount);
  } catch {
    return `${p.amount} ${p.currency ?? ""}`.trim();
  }
}

/* ---------- Card ---------- */

function makeCard(item, index) {
  const card = el("article", "product-card");
  card.style.animationDelay = `${Math.min(index, 12) * 40}ms`;

  // Image (link to the seller)
  const imageLink = el("a", "product-image");
  imageLink.target = "_blank";
  imageLink.rel = "noopener noreferrer";
  const img = el("img");
  img.loading = "lazy";
  imageLink.appendChild(img);

  // Info
  const info = el("div", "product-info");
  const categoryLabel = CATEGORIES.find(c => c.id === item.category)?.label ?? "";
  const cat = el("span", "product-category", categoryLabel);

  const titleRow = el("div", "product-title-row");
  titleRow.appendChild(el("h3", null, item.name));

  const genderInfo = GENDER_ICONS[item.gender];
  if (genderInfo) {
    const symbols = el("span", "gender-symbols");
    symbols.title = genderInfo.label;
    symbols.setAttribute("role", "img");
    symbols.setAttribute("aria-label", genderInfo.label);
    genderInfo.icons.forEach(n => symbols.appendChild(el("span", `gender-icon gender-icon-${n}`)));
    titleRow.appendChild(symbols);
  }

  // Tier switcher
  const switcher = el("div", "tier-switch");
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", `Choose a variant of ${item.name}`);
  TIERS.forEach(t => {
    if (!item.variants[t.id]) return;
    const btn = el("button", "tier-btn", t.label);
    btn.type = "button";
    btn.dataset.tier = t.id;
    btn.title = t.hint;
    btn.addEventListener("click", () => {
      selectedTier.set(item.id, t.id);
      updateCard(card, item);
    });
    switcher.appendChild(btn);
  });

  const variantName = el("p", "variant-name");
  const variantBrand = el("p", "product-brand");
  const price = el("p", "product-price");

  const cta = el("a", "product-cta", "View product ↗");
  cta.target = "_blank";
  cta.rel = "noopener noreferrer";

  info.append(cat, titleRow, switcher, variantName, variantBrand, price, cta);
  card.append(imageLink, info);

  card._refs = { imageLink, img, variantName, variantBrand, price, cta, switcher };
  updateCard(card, item);
  return card;
}

// Updates a card in place for its currently selected tier
function updateCard(card, item) {
  const tier = getTier(item);
  const v = item.variants[tier];
  const r = card._refs;

  card.dataset.tier = tier;
  r.img.src = v.image;
  r.img.alt = `${v.brand ?? ""} ${v.name}`.trim();
  r.imageLink.href = v.url;
  r.cta.href = v.url;
  r.variantName.textContent = v.name;
  r.variantBrand.textContent = v.brand ?? "";

  const p = getPrice(item, tier);
  r.price.textContent = formatPrice(p);
  r.price.title = p?.updated ? `Price from the seller, checked ${p.updated}` : "";

  r.switcher.querySelectorAll(".tier-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.tier === tier));
  });
}

/* ---------- Filters ---------- */

function makeChip(entry) {
  const btn = el("button", "chip", entry.label);
  btn.type = "button";
  btn.dataset.value = entry.id;
  return btn;
}

function buildFilters() {
  GENDERS.forEach(g => {
    const chip = makeChip(g);
    chip.addEventListener("click", () => { state.gender = g.id; render(); });
    genderBox.appendChild(chip);
  });

  CATEGORIES.forEach(c => {
    const chip = makeChip(c);
    chip.addEventListener("click", () => {
      state.categories.has(c.id) ? state.categories.delete(c.id) : state.categories.add(c.id);
      render();
    });
    categoryBox.appendChild(chip);
  });
}

function setPanelOpen(open) {
  categoryPanel.classList.toggle("open", open);
  filtersToggle.setAttribute("aria-expanded", String(open));
}

filtersToggle.addEventListener("click", () => {
  setPanelOpen(filtersToggle.getAttribute("aria-expanded") !== "true");
});

clearBtn.addEventListener("click", () => { state.categories.clear(); render(); });

document.getElementById("reset-filters").addEventListener("click", () => {
  state.gender = "all";
  state.categories.clear();
  render();
});

/* ---------- Render ---------- */

function render() {
  const filtered = PRODUCTS.filter(p => {
    const genderOk = state.gender === "all" || p.gender === state.gender || p.gender === "unisex";
    const categoryOk = state.categories.size === 0 || state.categories.has(p.category);
    return genderOk && categoryOk;
  });

  renderedCards = filtered.map((item, i) => ({ item, card: makeCard(item, i) }));
  grid.replaceChildren(...renderedCards.map(r => r.card));

  emptyState.hidden = filtered.length > 0;
  countEl.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;

  document.querySelectorAll("#gender-filters .chip").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.value === state.gender));
  });
  document.querySelectorAll("#category-filters .chip").forEach(btn => {
    btn.setAttribute("aria-pressed", String(state.categories.has(btn.dataset.value)));
  });

  const n = state.categories.size;
  filtersCount.textContent = n;
  filtersCount.hidden = n === 0;
  clearBtn.hidden = n === 0;
  filtersToggle.classList.toggle("has-active", n > 0);

  const q = new URLSearchParams();
  if (state.gender !== "all") q.set("gender", state.gender);
  if (n > 0) q.set("category", [...state.categories].join(","));
  history.replaceState(null, "", q.toString() ? `?${q}` : location.pathname);
}

/* ---------- Start ---------- */

async function loadPrices() {
  try {
    const res = await fetch("data/prices.json", { cache: "no-cache" });
    if (!res.ok) return;
    prices = await res.json();
    renderedCards.forEach(({ card, item }) => updateCard(card, item));
  } catch {
    // Opened via file:// or file missing: cards fall back to the optional price in products-data.js
  }
}

buildFilters();
render();
if (state.categories.size > 0) setPanelOpen(true);
loadPrices();