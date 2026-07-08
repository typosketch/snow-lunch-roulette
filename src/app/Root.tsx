import { Outlet, NavLink } from "react-router";
import { UtensilsCrossed, PlusCircle } from "lucide-react";

export default function Root() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
      {/* Top nav */}
      <nav className="w-full border-b border-[rgba(180,140,100,0.25)] bg-[#F5F0E8]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-[#C4622D]" />
            <span className="font-['Playfair_Display'] font-bold text-[#2C1A0E] text-base">
              Snow Lunch Roulette
            </span>
          </div>
          <div className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-xs font-semibold font-['Raleway'] uppercase tracking-widest px-3 py-1.5 transition-colors rounded-sm ${
                  isActive
                    ? "text-[#C4622D]"
                    : "text-[#6B4C35] hover:text-[#C4622D]"
                }`
              }
            >
              Roulette
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs font-semibold font-['Raleway'] uppercase tracking-widest px-3 py-1.5 transition-colors rounded-sm ${
                  isActive
                    ? "text-[#C4622D]"
                    : "text-[#6B4C35] hover:text-[#C4622D]"
                }`
              }
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Place
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
