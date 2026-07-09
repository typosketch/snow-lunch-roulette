import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router";
import { UtensilsCrossed, PlusCircle, List, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  type Restaurant,
  type Category,
  CATEGORY_LABELS,
  DEFAULT_RESTAURANTS,
  loadCustomRestaurants,
} from "./data";

function groupByCategory(restaurants: Restaurant[]): [Category, Restaurant[]][] {
  const map = new Map<Category, Restaurant[]>();
  for (const r of restaurants) {
    if (!map.has(r.category)) map.set(r.category, []);
    map.get(r.category)!.push(r);
  }
  return Array.from(map.entries()).sort(([a], [b]) =>
    CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b])
  );
}

export default function Root() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadCustomRestaurants().then((custom) => {
      if (!cancelled) setRestaurants([...DEFAULT_RESTAURANTS, ...custom]);
    });
    return () => {
      cancelled = true;
    };
  }, [panelOpen]); // refresh list each time panel opens

  const grouped = groupByCategory(restaurants);

  return (
    <div className="min-h-screen bg-[#0C0A14] flex flex-col">

      {/* Top nav */}
      <nav className="w-full border-b border-[rgba(201,169,110,0.15)] bg-[#0C0A14]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#C9A96E]" />
            <span className="font-['Eczar'] font-bold text-[#EDE8DC] text-lg">
              Oracle of Lunch
            </span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-xs font-semibold font-['Raleway'] uppercase tracking-widest px-3 py-1.5 transition-colors rounded-sm ${
                  isActive ? "text-[#C9A96E]" : "text-[#A89880] hover:text-[#C9A96E]"
                }`
              }
            >
              Our Lunch Destiny
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs font-semibold font-['Raleway'] uppercase tracking-widest px-3 py-1.5 transition-colors rounded-sm ${
                  isActive ? "text-[#C9A96E]" : "text-[#A89880] hover:text-[#C9A96E]"
                }`
              }
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Place
            </NavLink>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold font-['Raleway'] uppercase tracking-widest px-3 py-1.5 text-[#A89880] hover:text-[#C9A96E] transition-colors rounded-sm"
            >
              <List className="w-3.5 h-3.5" />
              All Places
            </button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Backdrop */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#100E1C] shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(201,169,110,0.15)]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#7A8C8E] font-['Raleway'] font-semibold mb-0.5">
                  Full List
                </p>
                <h2 className="font-['Eczar'] text-2xl font-bold text-[#EDE8DC]">
                  All Restaurants
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9A8E7E] font-['Raleway']">
                  {restaurants.length} places
                </span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="text-[#9A8E7E] hover:text-[#EDE8DC] transition-colors p-1"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] font-semibold font-['Raleway'] mb-2">
                    {CATEGORY_LABELS[category]}
                  </p>
                  <div className="space-y-1">
                    {items.map((r) => (
                      <div
                        key={r.name}
                        className="flex items-start justify-between gap-2 py-2 border-b border-[rgba(201,169,110,0.1)] last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold font-['Raleway'] text-[#EDE8DC] leading-snug">
                            {r.name}
                          </p>
                          <p className="text-xs text-[#9A8E7E] font-['Raleway'] italic leading-snug mt-0.5">
                            {r.tagline}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
