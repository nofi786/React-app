import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');

  .ft-root { font-family: 'DM Sans', sans-serif; background: #1a1f2e; }

  /* ── BACK TO TOP ── */
  .ft-backtop {
    background: #2e3548;
    text-align: center;
    padding: 14px;
    cursor: pointer;
    color: #ccc;
    font-size: 13.5px;
    font-weight: 500;
    border: none;
    width: 100%;
    transition: background 0.2s, color 0.2s;
    letter-spacing: 0.3px;
  }
  .ft-backtop:hover { background: #3a4060; color: #fff; }

  /* ── NEWSLETTER ── */
  .ft-newsletter {
    background: linear-gradient(135deg, #1e2540, #2a1e40);
    padding: 48px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ft-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .ft-nl-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    flex-wrap: wrap;
  }
  .ft-nl-text h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #f0f0f0;
    margin-bottom: 6px;
  }
  .ft-nl-text p { font-size: 13.5px; color: #888; }
  .ft-nl-form { display: flex; gap: 10px; flex-wrap: wrap; }
  .ft-nl-input {
    padding: 11px 18px;
    border-radius: 8px;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: #eee;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    width: 260px;
    transition: border-color 0.2s;
  }
  .ft-nl-input::placeholder { color: #666; }
  .ft-nl-input:focus { border-color: #c9a84c; }
  .ft-nl-btn {
    padding: 11px 24px;
    border-radius: 8px;
    border: none;
    background: #c9a84c;
    color: #111;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.2s;
  }
  .ft-nl-btn:hover { background: #b8963e; transform: translateY(-1px); }

  /* ── MAIN LINKS ── */
  .ft-main {
    padding: 56px 0 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ft-main-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
  }
  .ft-col-title {
    font-size: 14.5px;
    font-weight: 700;
    color: #f0f0f0;
    margin-bottom: 18px;
    letter-spacing: 0.3px;
  }
  .ft-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ft-col ul li a {
    color: #8a8f9e;
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
    display: block;
    line-height: 1.4;
  }
  .ft-col ul li a:hover { color: #c9a84c; }

  /* ── FEATURES STRIP ── */
  .ft-features {
    padding: 36px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: #1e2338;
  }
  .ft-features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .ft-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    transition: background 0.2s;
  }
  .ft-feature:hover { background: rgba(255,255,255,0.06); }
  .ft-feature-icon { font-size: 26px; flex-shrink: 0; }
  .ft-feature-title { font-size: 13.5px; font-weight: 600; color: #e0e0e0; }
  .ft-feature-sub { font-size: 11.5px; color: #666; margin-top: 2px; }

  /* ── MIDDLE BAR ── */
  .ft-middle {
    padding: 36px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .ft-middle-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }
  .ft-logo {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: #f0f0f0;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ft-logo-mark {
    width: 34px; height: 26px;
    background: #c9a84c;
    clip-path: polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; color: #222; font-weight: 800;
  }
  .ft-logo em { color: #c9a84c; font-style: normal; }

  .ft-selects { display: flex; gap: 10px; flex-wrap: wrap; }
  .ft-select-box {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    padding: 8px 14px;
    background: transparent;
    color: #ccc;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .ft-select-box:hover { border-color: rgba(255,255,255,0.3); }
  .ft-select-box select {
    background: transparent;
    border: none;
    color: #ccc;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    outline: none;
  }
  .ft-select-box select option { background: #222; color: #eee; }

  .ft-social { display: flex; gap: 10px; }
  .ft-social-btn {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.2s;
  }
  .ft-social-btn:hover { background: rgba(201,168,76,0.2); transform: translateY(-2px); }

  /* ── BOTTOM BAR ── */
  .ft-bottom { padding: 20px 0; background: #141820; }
  .ft-bottom-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
  }
  .ft-copyright { font-size: 12.5px; color: #555; }
  .ft-copyright span { color: #c9a84c; }
  .ft-bottom-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .ft-bottom-links a {
    font-size: 12.5px;
    color: #555;
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-bottom-links a:hover { color: #aaa; }

  /* ── PAYMENTS ── */
  .ft-payments {
    padding: 24px 0;
    background: #161b28;
    border-top: 1px solid rgba(255,255,255,0.04);
    text-align: center;
  }
  .ft-pay-title { font-size: 12px; color: #555; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase; }
  .ft-pay-icons { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .ft-pay-icon {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 12px;
    color: #aaa;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* ── SUB BRANDS ── */
  .ft-brands {
    padding: 18px 0;
    background: #141820;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .ft-brands-inner {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px 24px;
  }
  .ft-brands-inner a {
    font-size: 12px;
    color: #444;
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-brands-inner a:hover { color: #888; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .ft-main-grid { grid-template-columns: repeat(3, 1fr); }
    .ft-features-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 680px) {
    .ft-main-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .ft-middle-inner { flex-direction: column; align-items: flex-start; }
    .ft-nl-inner { flex-direction: column; }
    .ft-nl-input { width: 100%; }
    .ft-bottom-inner { flex-direction: column; align-items: center; text-align: center; }
  }
  @media (max-width: 400px) {
    .ft-main-grid { grid-template-columns: 1fr 1fr; }
    .ft-features-grid { grid-template-columns: 1fr; }
  }
`;

const FOOTER_COLS = [
  {
    title: "Get to Know Us",
    links: ["Careers", "Blog", "About Dyard Store", "Investor Relations", "Our Devices", "Science & Innovation"],
  },
  {
    title: "Make Money with Us",
    links: ["Sell Products on Dyard", "Sell on Business", "Sell Your Apps", "Become an Affiliate", "Advertise Your Products", "Self-Publish with Us", "Host a Hub"],
  },
  {
    title: "Payment Products",
    links: ["Business Card", "Shop with Points", "Reload Your Balance", "Currency Converter", "Gift Cards", "Buy Now Pay Later"],
  },
  {
    title: "Let Us Help You",
    links: ["Your Account", "Your Orders", "Shipping Rates & Policies", "Returns & Replacements", "Manage Content", "Help Center", "Track Your Order"],
  },
  {
    title: "Browse Categories",
    links: ["Trending Products", "On Sale", "Home Essentials", "Electronics", "Fashion", "Gaming Accessories", "Baby Products", "Sports & Outdoors"],
  },
];

const FEATURES = [
  { icon: "🚚", title: "Free Delivery", sub: "On orders over $50" },
  { icon: "🔄", title: "Easy Returns", sub: "30 day return policy" },
  { icon: "🔒", title: "Secure Payment", sub: "100% secure transactions" },
  { icon: "🎧", title: "24/7 Support", sub: "Dedicated support team" },
];

const PAYMENT_METHODS = ["VISA", "Mastercard", "PayPal", "Stripe", "Apple Pay", "Google Pay", "JazzCash", "EasyPaisa"];

const SUB_BRANDS = ["Dyard Music", "Dyard Ads", "Dyard Business", "Dyard Fresh", "Dyard Prime", "Dyard Pay", "Dyard Books", "Dyard Games", "Sell on Dyard"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <>
      <style>{css}</style>
      <footer className="ft-root">

        {/* BACK TO TOP */}
        <button className="ft-backtop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ &nbsp; Back to top
        </button>

        {/* NEWSLETTER */}
        <div className="ft-newsletter">
          <div className="ft-wrap">
            <div className="ft-nl-inner">
              <div className="ft-nl-text">
                <h3>Stay in the loop 📬</h3>
                <p>Get the latest deals, new arrivals & exclusive offers straight to your inbox.</p>
              </div>
              <div className="ft-nl-form">
                <input
                  type="email"
                  className="ft-nl-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <button className="ft-nl-btn" onClick={handleSubscribe}>
                  {subscribed ? "✓ Subscribed!" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES STRIP */}
        <div className="ft-features">
          <div className="ft-wrap">
            <div className="ft-features-grid">
              {FEATURES.map((f) => (
                <div className="ft-feature" key={f.title}>
                  <div className="ft-feature-icon">{f.icon}</div>
                  <div>
                    <div className="ft-feature-title">{f.title}</div>
                    <div className="ft-feature-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN LINKS */}
        <div className="ft-main">
          <div className="ft-wrap">
            <div className="ft-main-grid">
              {FOOTER_COLS.map((col) => (
                <div className="ft-col" key={col.title}>
                  <div className="ft-col-title">{col.title}</div>
                  <ul>
                    {col.links.map((link) => (
                      <li key={link}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE — LOGO + SELECTS + SOCIAL */}
        <div className="ft-middle">
          <div className="ft-wrap">
            <div className="ft-middle-inner">

              <a href="#" className="ft-logo">
                <div className="ft-logo-mark">D</div>
                Dyard <em>&nbsp;Store</em>
              </a>

              <div className="ft-selects">
                <div className="ft-select-box">
                  🌐
                  <select aria-label="Language">
                    <option>English</option>
                    <option>Urdu</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div className="ft-select-box">
                  💱
                  <select aria-label="Currency">
                    <option>PKR — Pakistani Rupee</option>
                    <option>USD — US Dollar</option>
                    <option>EUR — Euro</option>
                    <option>GBP — British Pound</option>
                  </select>
                </div>
                <div className="ft-select-box">
                  🇵🇰
                  <select aria-label="Country">
                    <option>Pakistan</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>UAE</option>
                  </select>
                </div>
              </div>

              <div className="ft-social">
                {[["🐦", "Twitter"], ["📘", "Facebook"], ["📸", "Instagram"], ["▶️", "YouTube"], ["💼", "LinkedIn"]].map(([icon, name]) => (
                  <a key={name} href="#" className="ft-social-btn" aria-label={name} title={name}>{icon}</a>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="ft-payments">
          <div className="ft-wrap">
            <div className="ft-pay-title">Secure Payment Methods</div>
            <div className="ft-pay-icons">
              {PAYMENT_METHODS.map((p) => (
                <div className="ft-pay-icon" key={p}>{p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* SUB BRANDS */}
        <div className="ft-brands">
          <div className="ft-wrap">
            <div className="ft-brands-inner">
              {SUB_BRANDS.map((b) => (
                <a href="#" key={b}>{b}</a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="ft-bottom">
          <div className="ft-wrap">
            <div className="ft-bottom-inner">
              <div className="ft-copyright">
                © 2026 <span>Dyard Store</span>. All rights reserved. Made with ❤️ in Pakistan
              </div>
              <div className="ft-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Cookie Policy</a>
                <a href="#">Sitemap</a>
                <a href="#">Accessibility</a>
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}