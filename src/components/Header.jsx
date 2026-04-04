import { useState } from "react";

const CART_ITEMS_DEFAULT = [
  { id: 1, name: "Beige knitted elastic runner shoes", qty: 1, price: 84.0 },
  { id: 2, name: "Blue utility pinafore denim dress", qty: 1, price: 76.0 },
];

const CATEGORIES = [
  "Daily Offers", "Gift Ideas", "Beds", "Lighting",
  "Sofas & Sleeper Sofas", "Storage", "Armchairs & Chaises",
  "Decoration", "Kitchen Cabinets", "Coffee & Tables", "Outdoor Furniture",
];

const NAV_LINKS = ["Home", "Shop", "Product", "Pages", "Blog", "Elements"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dy-header {
    font-family: 'DM Sans', sans-serif;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #333333;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  /* CONTAINER */
  .dy-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  /* TOP BAR */
  .dy-topbar {
    background: #282828;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 7px 0;
    font-size: 12.5px;
  }
  .dy-topbar .dy-wrap { flex-wrap: wrap; gap: 6px; }
  .dy-topbar-phone { color: #aaa; text-decoration: none; transition: color .2s; }
  .dy-topbar-phone:hover { color: #c9a84c; }
  .dy-topbar-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .dy-topbar-right a { color: #aaa; text-decoration: none; transition: color .2s; font-size: 12.5px; }
  .dy-topbar-right a:hover { color: #c9a84c; }
  .dy-sel {
    background: transparent; border: none; color: #aaa; font-size: 12.5px;
    cursor: pointer; outline: none; font-family: 'DM Sans', sans-serif;
  }
  .dy-sel option { background: #333; color: #eee; }

  /* MIDDLE BAR */
  .dy-middle { padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }

  /* LOGO */
  .dy-logo { text-decoration: none; display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
  .dy-logo-mark {
    width: 30px; height: 22px; background: #c9a84c;
    clip-path: polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: #222; font-weight: 800;
  }
  .dy-logo-name {
    font-family: 'Playfair Display', serif; font-size: 21px;
    color: #f0f0f0; letter-spacing: .5px;
  }
  .dy-logo-name em { color: #c9a84c; font-style: normal; }

  /* SEARCH */
  .dy-search {
    flex: 1; max-width: 540px; display: flex;
    border: 1.5px solid rgba(255,255,255,0.13); border-radius: 28px;
    overflow: hidden; background: rgba(255,255,255,0.05);
    transition: border-color .25s, box-shadow .25s;
  }
  .dy-search:focus-within { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,.14); }
  .dy-search input {
    flex: 1; background: transparent; border: none; outline: none;
    padding: 9px 16px; font-size: 13.5px; color: #eee; font-family: 'DM Sans', sans-serif;
  }
  .dy-search input::placeholder { color: #777; }
  .dy-search button {
    background: #c9a84c; border: none; padding: 0 18px; cursor: pointer;
    color: #222; font-size: 15px; font-weight: 700; transition: background .2s;
  }
  .dy-search button:hover { background: #b8963e; }

  /* ICON BUTTONS */
  .dy-icons { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .dy-ibtn {
    background: none; border: none; cursor: pointer; position: relative;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    color: #ccc; text-decoration: none; padding: 7px 11px; border-radius: 8px;
    transition: background .2s, color .2s; font-family: 'DM Sans', sans-serif;
  }
  .dy-ibtn:hover { background: rgba(255,255,255,0.07); color: #c9a84c; }
  .dy-ibtn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.8; }
  .dy-ibtn-label { font-size: 10.5px; color: #888; }
  .dy-badge {
    position: absolute; top: 3px; right: 7px;
    background: #c9a84c; color: #222; border-radius: 50%;
    font-size: 9px; font-weight: 700; width: 15px; height: 15px;
    display: flex; align-items: center; justify-content: center;
  }

  /* DROPDOWN BASE */
  .dy-drop {
    position: absolute; top: calc(100% + 10px); right: 0;
    background: #2b2b2b; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; box-shadow: 0 14px 40px rgba(0,0,0,0.5);
    z-index: 9999; padding: 14px;
    animation: dyFadeDown .16s ease;
  }
  @keyframes dyFadeDown {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* CART DROPDOWN */
  .dy-cart-drop { width: 300px; }
  .dy-cart-item {
    display: flex; gap: 10px; padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07); align-items: center;
  }
  .dy-cart-img {
    width: 46px; height: 46px; border-radius: 6px;
    background: #444; flex-shrink: 0; object-fit: cover;
  }
  .dy-cart-info { flex: 1; min-width: 0; }
  .dy-cart-name {
    font-size: 12.5px; color: #ddd; text-decoration: none;
    display: block; line-height: 1.35; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }
  .dy-cart-name:hover { color: #c9a84c; }
  .dy-cart-price { font-size: 11.5px; color: #888; margin-top: 2px; }
  .dy-rm { background: none; border: none; color: #666; cursor: pointer; font-size: 13px; transition: color .2s; }
  .dy-rm:hover { color: #e05; }
  .dy-cart-total {
    display: flex; justify-content: space-between; padding: 10px 0 8px;
    font-size: 13.5px; font-weight: 600; color: #eee;
  }
  .dy-cart-total strong { color: #c9a84c; }
  .dy-cart-btns { display: flex; gap: 8px; }
  .dy-btn-fill {
    flex: 1; background: #c9a84c; color: #222; text-align: center;
    padding: 8px 0; border-radius: 6px; text-decoration: none;
    font-size: 12.5px; font-weight: 600; transition: background .2s;
  }
  .dy-btn-fill:hover { background: #b8963e; }
  .dy-btn-line {
    flex: 1; border: 1.5px solid #c9a84c; color: #c9a84c; text-align: center;
    padding: 8px 0; border-radius: 6px; text-decoration: none;
    font-size: 12.5px; font-weight: 600; transition: all .2s;
  }
  .dy-btn-line:hover { background: #c9a84c; color: #222; }

  /* COMPARE DROPDOWN */
  .dy-cmp-drop { min-width: 260px; }
  .dy-cmp-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .dy-cmp-item a { color: #ccc; text-decoration: none; font-size: 13px; }
  .dy-cmp-item a:hover { color: #c9a84c; }
  .dy-cmp-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .dy-cmp-clear { background: none; border: none; color: #c9a84c; cursor: pointer; font-size: 12.5px; font-family: 'DM Sans', sans-serif; }

  /* NAVBAR */
  .dy-navbar { background: #2d2d2d; border-top: 1px solid rgba(255,255,255,0.05); }
  .dy-navbar .dy-wrap { gap: 0; align-items: stretch; }

  /* CATEGORY */
  .dy-cat-wrap { position: relative; display: flex; align-items: stretch; }
  .dy-cat-btn {
    background: #c9a84c; border: none; color: #222; font-weight: 700; font-size: 13px;
    padding: 12px 18px; cursor: pointer; white-space: nowrap;
    font-family: 'DM Sans', sans-serif; transition: background .2s;
    display: flex; align-items: center; gap: 6px;
  }
  .dy-cat-btn:hover { background: #b8963e; }
  .dy-cat-drop {
    position: absolute; top: 100%; left: 0;
    background: #2b2b2b; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 0 0 10px 10px; box-shadow: 0 14px 40px rgba(0,0,0,0.5);
    z-index: 9999; min-width: 220px; padding: 8px 0;
    animation: dyFadeDown .16s ease;
  }
  .dy-cat-link {
    display: block; padding: 9px 20px; color: #ccc; text-decoration: none;
    font-size: 13px; transition: background .15s, color .15s;
  }
  .dy-cat-link:hover { background: rgba(201,168,76,0.1); color: #c9a84c; }

  /* MAIN NAV */
  .dy-mainnav { display: flex; align-items: center; flex: 1; padding: 0 8px; }
  .dy-navlink {
    color: #bbb; text-decoration: none; font-size: 13.5px; font-weight: 500;
    padding: 12px 13px; border-bottom: 3px solid transparent;
    display: block; transition: color .2s, border-color .2s; white-space: nowrap;
  }
  .dy-navlink:hover, .dy-navlink.dy-active { color: #c9a84c; border-bottom-color: #c9a84c; }

  /* CLEARANCE */
  .dy-clearance {
    font-size: 12.5px; color: #aaa; padding: 0 14px; margin-left: auto;
    white-space: nowrap; display: flex; align-items: center; gap: 5px;
  }
  .dy-clearance strong { color: #c9a84c; }

  /* MOBILE TOGGLE */
  .dy-hamburger {
    background: none; border: none; color: #ccc; font-size: 22px;
    cursor: pointer; padding: 4px 6px; display: none; flex-shrink: 0; transition: color .2s;
  }
  .dy-hamburger:hover { color: #c9a84c; }

  /* MOBILE MENU */
  .dy-mobile { background: #282828; border-top: 1px solid rgba(255,255,255,0.07); }
  .dy-mob-link {
    display: block; padding: 13px 20px; color: #ccc; text-decoration: none;
    font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); transition: color .2s, background .2s;
  }
  .dy-mob-link:hover { color: #c9a84c; background: rgba(255,255,255,0.03); }
  .dy-mob-cats { padding: 12px 20px 6px; }
  .dy-mob-cats-title {
    font-size: 10.5px; color: #c9a84c; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 8px;
  }
  .dy-mob-cat {
    display: block; padding: 8px 0; color: #999; text-decoration: none;
    font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: color .2s;
  }
  .dy-mob-cat:hover { color: #c9a84c; }

  /* RESPONSIVE */
  @media (max-width: 992px) {
    .dy-navbar { display: none; }
    .dy-hamburger { display: flex !important; }
    .dy-search { max-width: 100%; }
  }
  @media (max-width: 600px) {
    .dy-topbar .dy-wrap { justify-content: center; }
    .dy-topbar-right { justify-content: center; }
    .dy-ibtn-label { display: none; }
    .dy-ibtn { padding: 7px 8px; }
    .dy-icons { gap: 0; }
  }
  @media (max-width: 400px) {
    .dy-logo-name { font-size: 17px; }
    .dy-search input { padding: 8px 10px; font-size: 12.5px; }
  }
`;

// Simple SVG icons
const IconCompare = () => (
  <svg viewBox="0 0 24 24"><path d="M7 16V4m0 0L4 7m3-3 3 3M17 8v12m0 0 3-3m-3 3-3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconHeart = () => (
  <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IconCart = () => (
  <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState(CART_ITEMS_DEFAULT);

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const removeItem = (id) => setCartItems((p) => p.filter((i) => i.id !== id));

  const closeDropdowns = () => { setCartOpen(false); setCompareOpen(false); setCatOpen(false); };
  const toggleCart    = () => { const next = !cartOpen; closeDropdowns(); setCartOpen(next); };
  const toggleCompare = () => { const next = !compareOpen; closeDropdowns(); setCompareOpen(next); };
  const toggleCat     = () => { const next = !catOpen; closeDropdowns(); setCatOpen(next); };

  return (
    <>
      <style>{css}</style>
      <header className="dy-header">

        {/* ── TOP BAR ── */}
        <div className="dy-topbar">
          <div className="dy-wrap">
            <a href="#" className="dy-topbar-phone">📞 Call: +0123 456 789</a>
            <div className="dy-topbar-right">
              <select className="dy-sel" aria-label="Currency">
                <option>USD</option><option>EUR</option>
              </select>
              <select className="dy-sel" aria-label="Language">
                <option>English</option><option>French</option><option>Spanish</option>
              </select>
              <a href="#">Sign in / Sign up</a>
            </div>
          </div>
        </div>

        {/* ── MIDDLE BAR ── */}
        <div className="dy-middle">
          <div className="dy-wrap">

            <button className="dy-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? "✕" : "☰"}
            </button>

            <a href="#" className="dy-logo">
              <div className="dy-logo-mark">D</div>
              <span className="dy-logo-name">Dyard <em>Store</em></span>
            </a>

            <div className="dy-search">
              <input
                type="search"
                placeholder="Search product ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search"
              />
              <button aria-label="Submit search">🔍</button>
            </div>

            <div className="dy-icons">

              {/* Compare */}
              <div style={{ position: "relative" }}>
                <button className="dy-ibtn" onClick={toggleCompare} aria-label="Compare">
                  <IconCompare /><span className="dy-ibtn-label">Compare</span>
                </button>
                {compareOpen && (
                  <div className="dy-drop dy-cmp-drop">
                    {["Blue Night Dress", "White Long Skirt"].map((item) => (
                      <div className="dy-cmp-item" key={item}>
                        <a href="#">{item}</a>
                        <button className="dy-rm">✕</button>
                      </div>
                    ))}
                    <div className="dy-cmp-actions">
                      <button className="dy-cmp-clear">Clear All</button>
                      <a href="#" className="dy-btn-line" style={{ flex: "unset", padding: "6px 14px" }}>Compare →</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <a href="#" className="dy-ibtn" aria-label="Wishlist">
                <IconHeart /><span className="dy-badge">3</span>
                <span className="dy-ibtn-label">Wishlist</span>
              </a>

              {/* Cart */}
              <div style={{ position: "relative" }}>
                <button className="dy-ibtn" onClick={toggleCart} aria-label="Cart">
                  <IconCart /><span className="dy-badge">{cartItems.length}</span>
                  <span className="dy-ibtn-label">Cart</span>
                </button>
                {cartOpen && (
                  <div className="dy-drop dy-cart-drop">
                    {cartItems.length === 0 ? (
                      <p style={{ color: "#777", fontSize: 13, textAlign: "center", padding: "12px 0" }}>Cart is empty.</p>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div className="dy-cart-item" key={item.id}>
                            <div className="dy-cart-img" />
                            <div className="dy-cart-info">
                              <a href="#" className="dy-cart-name">{item.name}</a>
                              <div className="dy-cart-price">{item.qty} × ${item.price.toFixed(2)}</div>
                            </div>
                            <button className="dy-rm" onClick={() => removeItem(item.id)}>✕</button>
                          </div>
                        ))}
                        <div className="dy-cart-total">
                          <span>Total</span><strong>${total.toFixed(2)}</strong>
                        </div>
                        <div className="dy-cart-btns">
                          <a href="#" className="dy-btn-fill">View Cart</a>
                          <a href="#" className="dy-btn-line">Checkout →</a>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <div className="dy-navbar">
          <div className="dy-wrap">

            <div className="dy-cat-wrap">
              <button className="dy-cat-btn" onClick={toggleCat}>
                ☰ Browse Categories ▾
              </button>
              {catOpen && (
                <div className="dy-cat-drop">
                  {CATEGORIES.map((c) => <a key={c} href="#" className="dy-cat-link">{c}</a>)}
                </div>
              )}
            </div>

            <nav className="dy-mainnav" aria-label="Main navigation">
              {NAV_LINKS.map((label) => (
                <a key={label} href="#" className={`dy-navlink${label === "Home" ? " dy-active" : ""}`}>
                  {label}
                </a>
              ))}
            </nav>

            <div className="dy-clearance">💡 Clearance <strong>&nbsp;Up to 30% Off</strong></div>

          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {mobileOpen && (
          <div className="dy-mobile">
            {NAV_LINKS.map((label) => (
              <a key={label} href="#" className="dy-mob-link">{label}</a>
            ))}
            <div className="dy-mob-cats">
              <div className="dy-mob-cats-title">Categories</div>
              {CATEGORIES.map((c) => <a key={c} href="#" className="dy-mob-cat">{c}</a>)}
            </div>
          </div>
        )}

      </header>
    </>
  );
}