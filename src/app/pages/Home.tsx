import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import cardBackSrc from "@/imports/tarotcard.png";
import TarotIcon from "@/app/components/TarotIcon";
import {
  type Restaurant,
  CATEGORY_LABELS,
  DEFAULT_RESTAURANTS,
  loadCustomRestaurants,
  menuHref,
} from "../data";

// ── Helpers ────────────────────────────────────────────────────────────────

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

// ── Tarot card color schemes ───────────────────────────────────────────────

interface TarotScheme {
  bg: string;
  accent: string;
  text: string;
  sub: string;
  border: string;
  divider: string;
}

const TAROT_SCHEMES: TarotScheme[] = [
  { bg: "#08091A", accent: "#C9A96E", text: "#EDE8DC", sub: "rgba(237,232,220,0.75)", border: "rgba(201,169,110,0.35)", divider: "rgba(201,169,110,0.2)" },
  { bg: "#0D0A1F", accent: "#9B7FD4", text: "#EAE6F5", sub: "rgba(234,230,245,0.75)", border: "rgba(155,127,212,0.35)", divider: "rgba(155,127,212,0.2)" },
  { bg: "#100A0A", accent: "#C96E6E", text: "#F5E8E8", sub: "rgba(245,232,232,0.75)", border: "rgba(201,110,110,0.35)", divider: "rgba(201,110,110,0.2)" },
  { bg: "#060F12", accent: "#5FBFB0", text: "#E4F3F1", sub: "rgba(228,243,241,0.75)", border: "rgba(95,191,176,0.35)", divider: "rgba(95,191,176,0.2)" },
];

const ROMAN = ["I", "II", "III"];

// ── Tarot Card component ───────────────────────────────────────────────────

function TarotCard({
  restaurant,
  scheme,
  revealed,
  cardIndex,
}: {
  restaurant: Restaurant;
  scheme: TarotScheme;
  revealed: boolean;
  cardIndex: number;
}) {
  const s = scheme;

  return (
    <div
      style={{ perspective: "1200px", aspectRatio: "5 / 8" }}
      className="w-full"
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Back face ── */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
            backgroundColor: "#000",
            borderRadius: "8px",
            border: "1px solid rgba(201,169,110,0.25)",
            overflow: "hidden",
          }}
        >
          <ImageWithFallback
            src={cardBackSrc}
            alt="Card back"
            className="w-full h-full object-contain"
          />
        </div>

        {/* ── Front face ── */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
            backgroundColor: s.bg,
            borderRadius: "8px",
            border: `1px solid ${s.border}`,
            overflow: "hidden",
          }}
          className="flex flex-col p-5"
        >
          {/* Top: roman numeral + category */}
          <div className="flex items-start justify-between mb-4">
            <span
              className="font-['Eczar'] font-semibold text-3xl leading-none"
              style={{ color: s.accent }}
            >
              {ROMAN[cardIndex]}
            </span>
            <span
              className="font-['Raleway'] text-[10px] font-semibold uppercase tracking-[0.22em] text-right leading-tight"
              style={{ color: s.sub, maxWidth: "58%" }}
            >
              {CATEGORY_LABELS[restaurant.category]}
            </span>
          </div>

          {/* Center: restaurant name */}
          <div className="flex-1 flex items-center justify-center">
            <h2
              className="font-['Eczar'] font-semibold text-center leading-none w-full"
              style={{
                color: s.text,
                fontSize: "clamp(1.35rem, 7.5cqw, 2.4rem)",
                letterSpacing: "-0.01em",
                wordBreak: "break-word",
                hyphens: "auto",
              }}
            >
              {restaurant.name}
            </h2>
          </div>

          {/* Divider */}
          <div className="my-4" style={{ height: "1px", backgroundColor: s.divider }} />

          {/* Bottom: tagline + menu link */}
          <div className="flex flex-col items-center gap-3">
            <p
              className="font-['Raleway'] text-xs italic text-center leading-snug"
              style={{ color: s.sub }}
            >
              {restaurant.tagline}
            </p>
            <a
              href={menuHref(restaurant)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-['Raleway'] text-xs font-semibold uppercase tracking-widest px-4 py-2 transition-colors"
              style={{ color: s.accent, border: `1px solid ${s.border}` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = `${s.accent}22`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              View Menu <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Data helpers ───────────────────────────────────────────────────────────

interface Pick { restaurant: Restaurant; schemeIdx: number; }

function pickThree(all: Restaurant[]): Pick[] {
  const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, 3);
  const schemeOrder = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  return shuffled.map((restaurant, i) => ({ restaurant, schemeIdx: schemeOrder[i] }));
}

// ── Page ───────────────────────────────────────────────────────────────────

type Phase = "idle" | "active" | "revealed";

export default function Home() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>(DEFAULT_RESTAURANTS);
  // Cards are initialized on mount so backs are visible before any interaction.
  // Uses defaults only — custom restaurants load in just after and are picked up
  // by the next spin via allRestaurants.
  const [picks, setPicks] = useState<Pick[]>(() => pickThree(DEFAULT_RESTAURANTS));
  const [cardSetKey, setCardSetKey] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState([false, false, false]);
  const [flipKey, setFlipKey] = useState(0);
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

  // Auto-flip sequence triggered by flipKey increment
  // Order: middle (i=1) → left (i=0) → right (i=2)
  useEffect(() => {
    if (flipKey === 0) return;
    const timers = [
      setTimeout(() => setRevealed(r => { const n = [...r]; n[1] = true; return n; }), 700),
      setTimeout(() => setRevealed(r => { const n = [...r]; n[0] = true; return n; }), 1250),
      setTimeout(() => setRevealed(r => { const n = [...r]; n[2] = true; return n; }), 1800),
      setTimeout(() => setPhase("revealed"), 2700),
    ];
    return () => timers.forEach(clearTimeout);
  }, [flipKey]);

  function spin() {
    if (phase === "idle") {
      // Cards already visible face-down — just flip them
      setPhase("active");
      setFlipKey(k => k + 1);
    } else {
      // Flip current cards back, then swap in new picks and flip forward
      setRevealed([false, false, false]);
      setPhase("active");
      setTimeout(() => {
        setPicks(pickThree(allRestaurants));
        setCardSetKey(k => k + 1);
        setFlipKey(k => k + 1);
      }, 900);
    }
  }

  const totalRestaurants = allRestaurants.length;

  return (
    <div className="flex flex-col items-center px-4 py-16 bg-[#0C0A14] min-h-screen">

      {/* Header */}
      <div className="text-center mb-12">
        <TarotIcon className="w-24 h-auto mx-auto mb-5 opacity-75" fill="#C9A96E" />
        <p className="text-xs uppercase tracking-[0.45em] text-[#7A8C8E] mb-2 font-['Raleway'] font-semibold">
          Snow Creative Team Lunch
        </p>
        <h1 className="font-['Eczar'] text-5xl md:text-6xl font-bold text-[#EDE8DC] mb-4 leading-tight">
          Let the Cards Decide
        </h1>
        <p className="text-base text-[#A89880] max-w-sm mx-auto leading-relaxed font-['Raleway']">
         Close your eyes, trust the cards, and let destiny guide your fork.
        </p>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        className="flex items-center gap-3 bg-[#C9A96E] hover:bg-[#B8965A] text-[#08091A] px-10 py-4 text-base font-semibold font-['Raleway'] tracking-widest uppercase transition-all mb-14 rounded-sm shadow-lg hover:shadow-xl active:scale-95"
      >
        <RefreshCw className="w-5 h-5" />
        Let Fate Decide
      </button>

      {/* Cards — always rendered since picks initialize on mount */}
      <div className="w-full max-w-3xl" style={{ containerType: "inline-size" }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {picks.map((pick, i) => (
            <TarotCard
              key={`${cardSetKey}-${i}`}
                restaurant={pick.restaurant}
                scheme={TAROT_SCHEMES[pick.schemeIdx]}
                revealed={revealed[i]}
                cardIndex={i}
              />
          ))}
        </div>
      </div>

      {/* Post-reveal actions */}
      {phase === "revealed" && (
        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <button
            onClick={() =>
              copyText(buildTeamsText(picks.map((p) => p.restaurant)), () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2200);
              })
            }
            className="flex items-center gap-2 border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10 px-6 py-2.5 text-sm font-semibold font-['Raleway'] tracking-wider uppercase transition-all rounded-sm"
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
          <p className="text-xs text-[#9A8E7E] font-['Raleway']">Paste directly into a Teams chat</p>
        </motion.div>
      )}

      <p className="mt-10 text-xs text-[#8A7E6E] tracking-[0.38em] uppercase font-['Raleway']">
        {totalRestaurants} restaurants to discover
      </p>
    </div>
  );
}
