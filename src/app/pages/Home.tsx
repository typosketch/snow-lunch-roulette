import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, RefreshCw } from "lucide-react";
import {
  type Restaurant,
  type ColorScheme,
  CATEGORY_LABELS,
  SCHEMES,
  DEFAULT_RESTAURANTS,
  loadCustomRestaurants,
  photoUrl,
  menuHref,
} from "../data";

function buildTeamsText(picks: Restaurant[]): string {
  const lines: string[] = ["🍽️ Snow Creative Team Lunch — Where Should We Eat?\n"];
  picks.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.name} — ${CATEGORY_LABELS[r.category]}`);
    lines.push(`   ${r.tagline}`);
    lines.push(`   Menu: ${menuHref(r)}`);
    if (i < picks.length - 1) lines.push("");
  });
  lines.push("\nVote for your pick! 🗳️");
  return lines.join("\n");
}

function copyText(text: string, onSuccess: () => void) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    onSuccess();
  } catch {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<pre style="font-family:monospace;white-space:pre-wrap;padding:24px">${text}</pre>`);
      w.document.close();
    }
  }
}

function Card({ restaurant, scheme }: { restaurant: Restaurant; scheme: ColorScheme }) {
  const s = scheme;
  return (
    <div
      className="relative w-full rounded-sm shadow-xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: s.bg }}
    >
      <div className="absolute inset-3 pointer-events-none" style={{ border: `1px solid ${s.outerBorder}` }} />
      <div className="absolute inset-[13px] pointer-events-none" style={{ border: `1px solid ${s.innerBorder}` }} />
      <div className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: `2px solid ${s.corner}`, borderLeft: `2px solid ${s.corner}` }} />
      <div className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: `2px solid ${s.corner}`, borderRight: `2px solid ${s.corner}` }} />
      <div className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: `2px solid ${s.corner}`, borderLeft: `2px solid ${s.corner}` }} />
      <div className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: `2px solid ${s.corner}`, borderRight: `2px solid ${s.corner}` }} />

      <div className="relative text-center pt-1">
        <p className="text-sm uppercase tracking-[0.3em] font-semibold font-['Raleway']" style={{ color: s.labelTop }}>
          {CATEGORY_LABELS[restaurant.category]}
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden bg-stone-700"
        style={{ height: "180px", flexShrink: 0, outline: `2px solid ${s.photoOutline}`, outlineOffset: "3px" }}
      >
        <img src={photoUrl(restaurant.category)} alt={restaurant.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 50%, ${s.photoOverlay} 100%)` }} />
      </div>

      <div className="relative text-center flex flex-col items-center gap-3 pb-2">
        <h2 className="font-['Playfair_Display'] text-2xl font-bold leading-tight" style={{ color: s.heading }}>
          {restaurant.name}
        </h2>
        <p className="text-sm italic font-['Raleway']" style={{ color: s.tagline }}>
          {restaurant.tagline}
        </p>
        <a
          href={menuHref(restaurant)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold font-['Raleway'] tracking-widest uppercase px-5 py-2 transition-colors"
          style={{ color: s.accentColor, border: `1px solid ${s.accentBorder}` }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = s.accentHoverBg; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        >
          View Menu <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function pickThree(all: Restaurant[]): { restaurant: Restaurant; schemeIdx: number }[] {
  const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, 3);
  const schemeOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  return shuffled.map((restaurant, i) => ({ restaurant, schemeIdx: schemeOrder[i] }));
}

export default function Home() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>(DEFAULT_RESTAURANTS);
  const [picks, setPicks] = useState<{ restaurant: Restaurant; schemeIdx: number }[]>([]);
  const [cardKey, setCardKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadCustomRestaurants().then((custom) => {
      if (!cancelled) setAllRestaurants([...DEFAULT_RESTAURANTS, ...custom]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => {
      setPicks(pickThree(allRestaurants));
      setCardKey((k) => k + 1);
      setSpinning(false);
    }, 350);
  }

  return (
    <div className="flex flex-col items-center px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.45em] text-[#7A8C6E] mb-2 font-['Raleway'] font-semibold">
          Snow Creative Team Lunch
        </p>
        <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#2C1A0E] mb-4 leading-tight">
          Where Should We Eat?
        </h1>
        <p className="text-base text-[#6B4C35] max-w-sm mx-auto leading-relaxed font-['Raleway']">
          Can't decide where to eat? Let fate choose your next dining adventure.
        </p>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="flex items-center gap-3 bg-[#C4622D] hover:bg-[#A04E24] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 text-base font-semibold font-['Raleway'] tracking-widest uppercase transition-all mb-14 rounded-sm shadow-lg hover:shadow-xl active:scale-95"
      >
        <RefreshCw className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
        {picks.length > 0 ? "Spin Again" : "Pick Restaurants"}
      </button>

      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {picks.length > 0 && !spinning && (
            <div key={cardKey} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {picks.map((pick, i) => {
                // Middle card (i=1) animates first, then left (i=0), then right (i=2)
                const delay = [0.14, 0, 0.28][i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay }}
                  >
                    <Card restaurant={pick.restaurant} scheme={SCHEMES[pick.schemeIdx]} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {picks.length > 0 && !spinning && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            onClick={() =>
              copyText(buildTeamsText(picks.map((p) => p.restaurant)), () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2200);
              })
            }
            className="flex items-center gap-2 border border-[#C4622D]/40 text-[#C4622D] hover:bg-[#C4622D]/5 px-6 py-2.5 text-sm font-semibold font-['Raleway'] tracking-wider uppercase transition-all rounded-sm"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy for Teams
              </>
            )}
          </button>
          <p className="text-xs text-[#B4906A] font-['Raleway']">Paste directly into a Teams chat</p>
        </div>
      )}

      <p className="mt-8 text-xs text-[#B4906A] tracking-[0.38em] uppercase font-['Raleway']">
        {allRestaurants.length} restaurants to discover
      </p>
    </div>
  );
}
