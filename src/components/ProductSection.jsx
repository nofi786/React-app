import { useState } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const makeCards = (emoji, names) =>
  names.map((name, i) => ({
    id: i + 1,
    name,
    emoji,
    price: (Math.random() * 80 + 20).toFixed(2),
    oldPrice: (Math.random() * 60 + 80).toFixed(2),
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviews: Math.floor(Math.random() * 200 + 20),
    badge: i === 0 ? "New" : i === 1 ? "Hot" : null,
  }));

const CATEGORIES = [
  {
    id: "trending",
    label: "Trending Products",
    icon: "🔥",
    accent: "#c9a84c",
    cards: makeCards("📦", ["Premium Wooden Chair", "Minimalist Desk Lamp", "Velvet Sofa Set", "Marble Coffee Table"]),
  },
  {
    id: "onsale",
    label: "On Sale",
    icon: "🏷️",
    accent: "#e05c5c",
    sale: true,
    cards: makeCards("💥", ["Leather Recliner", "Smart LED Strip", "Ceramic Vase Set", "Glass Bookshelf"]),
  },
  {
    id: "home",
    label: "Home Essentials",
    icon: "🏠",
    accent: "#4c9be0",
    cards: makeCards("🏡", ["Wall Clock", "Curtain Set", "Floor Rug", "Throw Pillow Pack"]),
  },
  {
    id: "kitchen",
    label: "Kitchen Essentials",
    icon: "🍳",
    accent: "#e07a4c",
    cards: makeCards("🍽️", ["Non-stick Pan Set", "Coffee Maker", "Knife Block Set", "Air Fryer"]),
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: "⚡",
    accent: "#4cc9e0",
    cards: makeCards("💻", ["Wireless Earbuds", "Smart Watch", "Portable Charger", "Bluetooth Speaker"]),
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: "👗",
    accent: "#c96caf",
    cards: makeCards("👠", ["Leather Handbag", "Silk Scarf", "Sunglasses", "Classic Watch"]),
  },
  {
    id: "decoration",
    label: "Decoration Essentials",
    icon: "🎨",
    accent: "#9b4ce0",
    cards: makeCards("🖼️", ["Canvas Wall Art", "Fairy Light Set", "Succulent Pot", "Mirror Frame"]),
  },
  {
    id: "gaming",
    label: "Gaming Accessories",
    icon: "🎮",
    accent: "#4ce08a",
    cards: makeCards("🕹️", ["Gaming Headset", "RGB Mousepad", "Mechanical Keyboard", "Gaming Chair"]),
  },
  {
    id: "toys",
    label: "Toys",
    icon: "🧸",
    accent: "#e0c94c",
    cards: makeCards("🎯", ["LEGO City Set", "Remote Car", "Plush Teddy Bear", "Puzzle 1000pcs"]),
  },
  {
    id: "medical",
    label: "Medical",
    icon: "💊",
    accent: "#4ce0a0",
    cards: makeCards("🏥", ["Digital Thermometer", "Blood Pressure Monitor", "First Aid Kit", "Pulse Oximeter"]),
  },
  {
    id: "baby",
    label: "Baby Products",
    icon: "👶",
    accent: "#e08ab0",
    cards: makeCards("🍼", ["Baby Monitor", "Diaper Bag", "Baby Carrier", "Nursing Pillow"]),
  },
  {
    id: "books",
    label: "Books",
    icon: "📚",
    accent: "#a04ce0",
    cards: makeCards("📖", ["Self Help Bundle", "Cook Book", "Children's Stories", "Finance Guide"]),
  },
  {
    id: "sports",
    label: "Sports",
    icon: "⚽",
    accent: "#4ce060",
    cards: makeCards("🏋️", ["Yoga Mat", "Resistance Bands", "Protein Shaker", "Jump Rope"]),
  },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

  .ps-root {
    background: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    padding: 60px 0 80px;
  }

  .ps-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* ── SECTION BLOCK ── */
  .ps-section {
    margin-bottom: 64px;
  }

  /* ── SECTION HEADER ── */
  .ps-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-wrap: wrap;
    gap: 12px;
  }
  .ps-section-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ps-section-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .ps-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    color: #f0f0f0;
    font-weight: 700;
    line-height: 1;
  }
  .ps-section-count {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
    font-weight: 400;
    font-family: 'DM Sans', sans-serif;
  }
  .ps-view-all {
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 16px;
    border-radius: 20px;
    border: 1.5px solid rgba(255,255,255,0.12);
    color: #aaa;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .ps-view-all:hover {
    color: #f0f0f0;
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.04);
  }

  /* ── SALE BADGE BAR ── */
  .ps-sale-bar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(90deg, #e05c5c22, transparent);
    border: 1px solid #e05c5c44;
    border-radius: 8px;
    padding: 6px 14px;
    margin-bottom: 20px;
    font-size: 12.5px;
    color: #e05c5c;
    font-weight: 600;
  }
  .ps-sale-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #e05c5c;
    animation: psPulse 1.4s ease-in-out infinite;
  }
  @keyframes psPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(1.4); }
  }

  /* ── GRID ── */
  .ps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  /* ── CARD ── */
  .ps-card {
    background: #222;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .ps-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }

  /* IMAGE PLACEHOLDER */
  .ps-card-img {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 54px;
    position: relative;
    background: #2a2a2a;
    overflow: hidden;
    transition: background 0.3s;
  }
  .ps-card:hover .ps-card-img { background: #2f2f2f; }
  .ps-card-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    position: absolute; inset: 0;
  }
  .ps-card-emoji {
    position: relative; z-index: 1;
    transition: transform 0.3s;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
  }
  .ps-card:hover .ps-card-emoji { transform: scale(1.12) translateY(-4px); }

  /* BADGE */
  .ps-card-badge {
    position: absolute;
    top: 12px; left: 12px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    z-index: 2;
  }

  /* WISHLIST BTN */
  .ps-card-wish {
    position: absolute;
    top: 10px; right: 10px;
    background: rgba(30,30,30,0.8);
    backdrop-filter: blur(6px);
    border: none; border-radius: 50%;
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 15px;
    transition: background 0.2s, transform 0.2s;
    z-index: 2;
  }
  .ps-card-wish:hover { background: rgba(224,92,92,0.3); transform: scale(1.1); }
  .ps-card-wish.wished { color: #e05c5c; }

  /* CARD BODY */
  .ps-card-body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .ps-card-name {
    font-size: 14px;
    font-weight: 600;
    color: #e8e8e8;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ps-card-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* STARS */
  .ps-card-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
  }
  .ps-stars { color: #c9a84c; font-size: 11px; letter-spacing: 1px; }
  .ps-rating-val { color: #aaa; }
  .ps-rating-count { color: #555; }

  /* PRICE */
  .ps-card-price {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: auto;
  }
  .ps-price-current {
    font-size: 17px;
    font-weight: 700;
    color: #f0f0f0;
  }
  .ps-price-old {
    font-size: 13px;
    color: #555;
    text-decoration: line-through;
  }
  .ps-price-discount {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 4px;
    background: #e05c5c22;
    color: #e05c5c;
  }

  /* ADD TO CART */
  .ps-card-footer {
    padding: 0 16px 16px;
  }
  .ps-card-add {
    width: 100%;
    padding: 9px 0;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .ps-card-add:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .ps-card-add:active { transform: translateY(0); }

  /* ── RESPONSIVE ── */
  @media (max-width: 992px) {
    .ps-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 680px) {
    .ps-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ps-section-title { font-size: 20px; }
    .ps-card-img { font-size: 40px; }
  }
  @media (max-width: 380px) {
    .ps-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .ps-card-name { font-size: 12.5px; }
    .ps-price-current { font-size: 15px; }
  }
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
};

const discount = (old, cur) =>
  Math.round(((old - cur) / old) * 100);

// ─── CARD ───────────────────────────────────────────────────────────────────

function ProductCard({ card, accent, isSale }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="ps-card" style={{ "--accent": accent }}>
      {/* IMAGE */}
      <div className="ps-card-img">
        {/* Replace the emoji below with <img src="your-image.jpg" alt="product" /> */}
        <span className="ps-card-emoji">{card.emoji}</span>

        {card.badge && (
          <span
            className="ps-card-badge"
            style={{ background: card.badge === "New" ? accent : "#e05c5c", color: "#111" }}
          >
            {card.badge}
          </span>
        )}
        {isSale && (
          <span className="ps-card-badge" style={{ background: "#e05c5c", color: "#fff", left: "auto", right: 12, top: 12 }}>
            -{discount(card.oldPrice, card.price)}%
          </span>
        )}

        <button
          className={`ps-card-wish${wished ? " wished" : ""}`}
          onClick={() => setWished(!wished)}
          aria-label="Add to wishlist"
        >
          {wished ? "❤️" : "🤍"}
        </button>
      </div>

      {/* BODY */}
      <div className="ps-card-body">
        <div className="ps-card-name">{card.name}</div>
        <div className="ps-card-desc">
          High quality product. Perfect for everyday use. Durable and stylish design.
        </div>

        <div className="ps-card-rating">
          <span className="ps-stars">{renderStars(parseFloat(card.rating))}</span>
          <span className="ps-rating-val">{card.rating}</span>
          <span className="ps-rating-count">({card.reviews})</span>
        </div>

        <div className="ps-card-price">
          <span className="ps-price-current">${card.price}</span>
          {isSale && (
            <>
              <span className="ps-price-old">${card.oldPrice}</span>
              <span className="ps-price-discount">-{discount(card.oldPrice, card.price)}%</span>
            </>
          )}
        </div>
      </div>

      {/* ADD TO CART */}
      <div className="ps-card-footer">
        <button
          className="ps-card-add"
          style={{
            background: added ? "#2d5a27" : accent,
            color: added ? "#7ddb6a" : "#111",
          }}
          onClick={handleAdd}
        >
          {added ? "✓ Added!" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ─── SECTION ────────────────────────────────────────────────────────────────

function CategorySection({ category }) {
  return (
    <div className="ps-section">
      <div className="ps-section-header">
        <div className="ps-section-left">
          <div
            className="ps-section-icon"
            style={{ background: `${category.accent}18`, border: `1.5px solid ${category.accent}33` }}
          >
            {category.icon}
          </div>
          <div>
            <div className="ps-section-title" style={{ color: "#f0f0f0" }}>
              {category.label}
            </div>
            <div className="ps-section-count">{category.cards.length} products</div>
          </div>
        </div>
        <a href="#" className="ps-view-all" style={{ borderColor: `${category.accent}44`, color: category.accent }}>
          View All →
        </a>
      </div>

      {category.sale && (
        <div className="ps-sale-bar">
          <div className="ps-sale-dot" />
          Limited time deals — Grab before they're gone!
        </div>
      )}

      <div className="ps-grid">
        {category.cards.map((card) => (
          <ProductCard key={card.id} card={card} accent={category.accent} isSale={!!category.sale} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────

export default function ProductSection() {
  return (
    <>
      <style>{css}</style>
      <section className="ps-root">
        <div className="ps-wrap">
          {CATEGORIES.map((cat) => (
            <CategorySection key={cat.id} category={cat} />
          ))}
        </div>
      </section>
    </>
  );
}