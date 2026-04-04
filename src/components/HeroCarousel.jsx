import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    id: 1,
    badge: "New Collection",
    title: "Modern Living\nRedefined",
    subtitle: "Discover furniture that speaks your style — elegant, minimal, and built to last.",
    cta: "Shop Now",
    cta2: "Explore Collection",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2d2417 50%, #1a1a1a 100%)",
    accent: "#c9a84c",
    imgPlaceholder: "🛋️",
    tag: "Up to 40% Off",
  },
  {
    id: 2,
    badge: "Summer Sale",
    title: "Style Meets\nComfort",
    subtitle: "Handpicked pieces for every corner of your home. Premium quality, unbeatable prices.",
    cta: "Shop Sale",
    cta2: "View Lookbook",
    bg: "linear-gradient(135deg, #0f1a2e 0%, #1a2d1a 50%, #0f1a2e 100%)",
    accent: "#4caf8c",
    imgPlaceholder: "🪑",
    tag: "Free Shipping",
  },
  {
    id: 3,
    badge: "Limited Offer",
    title: "Crafted for\nYour Space",
    subtitle: "From minimalist to maximalist — find the perfect fit. Shop thousands of curated products.",
    cta: "Discover Now",
    cta2: "Browse Categories",
    bg: "linear-gradient(135deg, #1e0f2e 0%, #2e1a0f 50%, #1e0f2e 100%)",
    accent: "#c96caf",
    imgPlaceholder: "🪞",
    tag: "New Arrivals",
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .dy-carousel {
    position: relative;
    width: 100%;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    user-select: none;
  }

  /* TRACK */
  .dy-carousel-track {
    display: flex;
    transition: transform 0.65s cubic-bezier(0.77, 0, 0.175, 1);
    will-change: transform;
  }

  /* SLIDE */
  .dy-slide {
    min-width: 100%;
    min-height: 520px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 60px 0;
  }

  /* ANIMATED BG SHAPES */
  .dy-slide-bg {
    position: absolute; inset: 0;
    z-index: 0;
  }
  .dy-slide-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: dyFloat 8s ease-in-out infinite;
  }
  .dy-slide-shape-1 { width: 500px; height: 500px; top: -150px; right: -100px; }
  .dy-slide-shape-2 { width: 300px; height: 300px; bottom: -80px; left: 10%; animation-delay: -3s; }
  .dy-slide-shape-3 { width: 200px; height: 200px; top: 30%; left: 40%; animation-delay: -5s; opacity: 0.1; }

  @keyframes dyFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-20px) scale(1.05); }
  }

  /* GRID */
  .dy-slide-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    position: relative;
    z-index: 1;
    width: 100%;
  }

  /* LEFT CONTENT */
  .dy-slide-content { display: flex; flex-direction: column; gap: 20px; }

  .dy-slide-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 20px;
    font-size: 11.5px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; width: fit-content;
    border: 1.5px solid currentColor;
    animation: dySlideFadeUp 0.6s ease both;
    animation-delay: 0.1s;
  }

  .dy-slide-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 62px);
    font-weight: 800;
    color: #f5f5f5;
    line-height: 1.1;
    white-space: pre-line;
    animation: dySlideFadeUp 0.6s ease both;
    animation-delay: 0.2s;
  }

  .dy-slide-subtitle {
    font-size: 15px;
    color: #aaa;
    line-height: 1.7;
    max-width: 420px;
    animation: dySlideFadeUp 0.6s ease both;
    animation-delay: 0.3s;
  }

  .dy-slide-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: #888;
    animation: dySlideFadeUp 0.6s ease both;
    animation-delay: 0.35s;
  }
  .dy-slide-tag span {
    display: inline-block; padding: 3px 10px; border-radius: 4px;
    font-size: 11.5px; font-weight: 700; color: #222;
  }

  .dy-slide-btns {
    display: flex; gap: 12px; flex-wrap: wrap;
    animation: dySlideFadeUp 0.6s ease both;
    animation-delay: 0.4s;
  }
  .dy-slide-btn-main {
    padding: 13px 28px; border-radius: 8px; border: none; cursor: pointer;
    font-size: 14px; font-weight: 700; color: #222;
    font-family: 'DM Sans', sans-serif;
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none; display: inline-block;
  }
  .dy-slide-btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .dy-slide-btn-sec {
    padding: 13px 28px; border-radius: 8px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #eee;
    font-family: 'DM Sans', sans-serif; background: transparent;
    border: 1.5px solid rgba(255,255,255,0.2);
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    text-decoration: none; display: inline-block;
  }
  .dy-slide-btn-sec:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); transform: translateY(-2px); }

  @keyframes dySlideFadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* RIGHT IMAGE BOX */
  .dy-slide-img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    animation: dySlideScaleIn 0.65s ease both;
    animation-delay: 0.15s;
  }
  @keyframes dySlideScaleIn {
    from { opacity: 0; transform: scale(0.88) translateX(30px); }
    to   { opacity: 1; transform: scale(1) translateX(0); }
  }
  .dy-slide-img-card {
    width: 340px;
    height: 380px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.08);
  }
  .dy-slide-img-card img {
    width: 100%; height: 100%; object-fit: cover;
    position: absolute; inset: 0;
  }
  .dy-slide-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
  }
  .dy-slide-img-emoji {
    position: relative; z-index: 1;
    filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
    animation: dyFloatEmoji 4s ease-in-out infinite;
  }
  @keyframes dyFloatEmoji {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }

  /* FLOATING LABEL */
  .dy-slide-float-label {
    position: absolute;
    bottom: 24px;
    left: -20px;
    background: rgba(30,30,30,0.92);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .dy-float-dot { width: 8px; height: 8px; border-radius: 50%; }
  .dy-float-text { font-size: 12px; color: #eee; font-weight: 500; }
  .dy-float-sub  { font-size: 10.5px; color: #777; }

  /* PREV / NEXT */
  .dy-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10; background: rgba(30,30,30,0.75); backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.12); border-radius: 50%;
    width: 46px; height: 46px; cursor: pointer; color: #eee;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: background 0.2s, transform 0.2s;
  }
  .dy-arrow:hover { background: rgba(201,168,76,0.25); transform: translateY(-50%) scale(1.08); }
  .dy-arrow-left  { left: 20px; }
  .dy-arrow-right { right: 20px; }

  /* DOTS */
  .dy-dots {
    position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 8px; z-index: 10;
  }
  .dy-dot {
    width: 8px; height: 8px; border-radius: 4px;
    background: rgba(255,255,255,0.3); cursor: pointer;
    transition: width 0.3s, background 0.3s; border: none;
  }
  .dy-dot.dy-dot-active { width: 28px; }

  /* PROGRESS BAR */
  .dy-progress {
    position: absolute; bottom: 0; left: 0; height: 3px;
    transition: width 0s linear;
    z-index: 10;
  }
  .dy-progress.dy-progressing {
    transition: width 4s linear;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .dy-slide { min-height: auto; padding: 40px 0 60px; }
    .dy-slide-inner { grid-template-columns: 1fr; text-align: center; gap: 30px; }
    .dy-slide-img-box { order: -1; }
    .dy-slide-img-card { width: 240px; height: 260px; font-size: 70px; }
    .dy-slide-subtitle { margin: 0 auto; }
    .dy-slide-btns { justify-content: center; }
    .dy-slide-float-label { left: 50%; transform: translateX(-50%); }
    .dy-slide-badge { margin: 0 auto; }
  }
  @media (max-width: 480px) {
    .dy-arrow { width: 36px; height: 36px; font-size: 14px; }
    .dy-arrow-left { left: 10px; }
    .dy-arrow-right { right: 10px; }
    .dy-slide-btn-main, .dy-slide-btn-sec { padding: 11px 20px; font-size: 13px; }
  }
`;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [progressing, setProgressing] = useState(false);
  const total = SLIDES.length;

  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total);
    setProgressing(false);
    setTimeout(() => setProgressing(true), 50);
  }, [total]);

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-play every 4s
  useEffect(() => {
    setProgressing(false);
    const t1 = setTimeout(() => setProgressing(true), 50);
    const t2 = setTimeout(next, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [current, next]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const slide = SLIDES[current];

  return (
    <>
      <style>{css}</style>
      <section className="dy-carousel" aria-label="Hero Carousel">

        {/* TRACK */}
        <div
          className="dy-carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className="dy-slide"
              style={{ background: s.bg }}
              aria-hidden={i !== current}
            >
              {/* Animated background shapes */}
              <div className="dy-slide-bg">
                <div className="dy-slide-shape dy-slide-shape-1" style={{ background: s.accent }} />
                <div className="dy-slide-shape dy-slide-shape-2" style={{ background: s.accent }} />
                <div className="dy-slide-shape dy-slide-shape-3" style={{ background: s.accent }} />
              </div>

              <div className="dy-slide-inner">
                {/* LEFT */}
                <div className="dy-slide-content">
                  <span className="dy-slide-badge" style={{ color: s.accent, borderColor: s.accent }}>
                    ✦ {s.badge}
                  </span>

                  <h1 className="dy-slide-title">{s.title}</h1>

                  <p className="dy-slide-subtitle">{s.subtitle}</p>

                  <div className="dy-slide-tag">
                    <span style={{ background: s.accent }}>{s.tag}</span>
                    on selected items
                  </div>

                  <div className="dy-slide-btns">
                    <a href="#" className="dy-slide-btn-main" style={{ background: s.accent }}>
                      {s.cta}
                    </a>
                    <a href="#" className="dy-slide-btn-sec">{s.cta2}</a>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="dy-slide-img-box">
                  <div className="dy-slide-img-card" style={{ background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}08)` }}>
                    <div className="dy-slide-img-overlay" />
                    <span className="dy-slide-img-emoji">{s.imgPlaceholder}</span>

                    {/* Floating info label */}
                    <div className="dy-slide-float-label">
                      <div className="dy-float-dot" style={{ background: s.accent }} />
                      <div>
                        <div className="dy-float-text">Premium Quality</div>
                        <div className="dy-float-sub">Handpicked for you</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PREV / NEXT */}
        <button className="dy-arrow dy-arrow-left" onClick={prev} aria-label="Previous slide">‹</button>
        <button className="dy-arrow dy-arrow-right" onClick={next} aria-label="Next slide">›</button>

        {/* DOTS */}
        <div className="dy-dots" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`dy-dot${i === current ? " dy-dot-active" : ""}`}
              style={i === current ? { background: slide.accent } : {}}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              role="tab"
              aria-selected={i === current}
            />
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div
          className={`dy-progress${progressing ? " dy-progressing" : ""}`}
          style={{
            background: slide.accent,
            width: progressing ? "100%" : "0%",
          }}
        />

      </section>
    </>
  );
}