import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, CheckCircle } from "lucide-react";
import {
  type Restaurant,
  type Category,
  CATEGORY_LABELS,
  loadCustomRestaurants,
  saveCustomRestaurant,
  deleteCustomRestaurant,
} from "../data";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

const EMPTY: Omit<Restaurant, "custom"> = {
  name: "",
  category: "other",
  tagline: "",
  menuUrl: "",
};

export default function AddRestaurant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [custom, setCustom] = useState<Restaurant[]>([]);

  useEffect(() => {
    loadCustomRestaurants().then(setCustom);
  }, []);

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Restaurant name is required.";
    if (form.menuUrl && !/^https?:\/\/.+/.test(form.menuUrl.trim())) {
      e.menuUrl = "Must be a valid URL starting with http:// or https://";
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      await saveCustomRestaurant({
        name: form.name.trim(),
        category: form.category,
        tagline: form.tagline.trim() || `Great food at ${form.name.trim()}`,
        menuUrl: form.menuUrl?.trim() || undefined,
      });
      setCustom(await loadCustomRestaurants());
      setForm({ ...EMPTY });
      setErrors({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch {
      setErrors({ name: "Couldn't save — please try again." });
    }
  }

  async function handleDelete(name: string) {
    await deleteCustomRestaurant(name);
    setCustom(await loadCustomRestaurants());
  }

  function field(label: string, children: React.ReactNode, error?: string, hint?: string) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold font-['Raleway'] text-[#2C1A0E] uppercase tracking-wider">
          {label}
        </label>
        {hint && <p className="text-xs text-[#B4906A] font-['Raleway'] -mt-0.5">{hint}</p>}
        {children}
        {error && <p className="text-xs text-red-600 font-['Raleway']">{error}</p>}
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-[rgba(180,140,100,0.4)] rounded-sm px-4 py-2.5 text-sm font-['Raleway'] text-[#2C1A0E] placeholder-[#B4906A] focus:outline-none focus:border-[#C4622D] focus:ring-1 focus:ring-[#C4622D]/30 transition-colors";

  return (
    <div className="flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.45em] text-[#7A8C6E] mb-2 font-['Raleway'] font-semibold">
            Snow Creative Team Lunch
          </p>
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#2C1A0E] mb-3 leading-tight">
            Add a Restaurant
          </h1>
          <p className="text-sm text-[#6B4C35] font-['Raleway'] leading-relaxed">
            Know a great spot we're missing? Add it to the pool and it'll show up in the roulette.
          </p>
        </div>

        {/* Form card */}
        <div className="relative bg-[#FEFAF3] rounded-sm shadow-xl p-8">
          {/* Decorative border */}
          <div className="absolute inset-3 pointer-events-none" style={{ border: "1px solid rgba(180,140,100,0.3)" }} />
          <div className="absolute inset-[13px] pointer-events-none" style={{ border: "1px solid rgba(180,140,100,0.15)" }} />
          <div className="absolute top-3 left-3 w-5 h-5" style={{ borderTop: "2px solid rgba(196,98,45,0.45)", borderLeft: "2px solid rgba(196,98,45,0.45)" }} />
          <div className="absolute top-3 right-3 w-5 h-5" style={{ borderTop: "2px solid rgba(196,98,45,0.45)", borderRight: "2px solid rgba(196,98,45,0.45)" }} />
          <div className="absolute bottom-3 left-3 w-5 h-5" style={{ borderBottom: "2px solid rgba(196,98,45,0.45)", borderLeft: "2px solid rgba(196,98,45,0.45)" }} />
          <div className="absolute bottom-3 right-3 w-5 h-5" style={{ borderBottom: "2px solid rgba(196,98,45,0.45)", borderRight: "2px solid rgba(196,98,45,0.45)" }} />

          <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">

            {field(
              "Restaurant Name *",
              <input
                type="text"
                placeholder="e.g. The Hungry Crab"
                value={form.name}
                onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((err) => ({ ...err, name: undefined })); }}
                className={inputClass}
              />,
              errors.name,
            )}

            {field(
              "Category *",
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                className={inputClass}
              >
                {CATEGORIES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>,
            )}

            {field(
              "Tagline",
              <input
                type="text"
                placeholder="e.g. Fresh oysters on the half shell"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                className={inputClass}
              />,
              undefined,
              "One short line describing the vibe or specialty. Optional — we'll fill one in if you skip it.",
            )}

            {field(
              "Menu URL",
              <input
                type="url"
                placeholder="https://restaurant.com/menu"
                value={form.menuUrl}
                onChange={(e) => { setForm((f) => ({ ...f, menuUrl: e.target.value })); setErrors((err) => ({ ...err, menuUrl: undefined })); }}
                className={inputClass}
              />,
              errors.menuUrl,
              "Direct link to the menu. Optional — we'll link to a Google search if you skip it.",
            )}

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 bg-[#C4622D] hover:bg-[#A04E24] text-white px-8 py-3 text-sm font-semibold font-['Raleway'] tracking-widest uppercase rounded-sm shadow transition-all active:scale-95"
            >
              Add to Roulette
            </button>

            {submitted && (
              <div className="flex items-center gap-2 justify-center text-sm font-['Raleway'] text-[#7A8C6E]">
                <CheckCircle className="w-4 h-4 text-[#7A8C6E]" />
                Added! It'll appear in the next spin.
              </div>
            )}
          </form>
        </div>

        {/* Custom restaurant list */}
        {custom.length > 0 && (
          <div className="mt-10">
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#2C1A0E] mb-4">
              Your Added Places
            </h2>
            <div className="flex flex-col gap-2">
              {custom.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between bg-[#FEFAF3] border border-[rgba(180,140,100,0.3)] rounded-sm px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold font-['Raleway'] text-[#2C1A0E]">{r.name}</p>
                    <p className="text-xs text-[#B4906A] font-['Raleway']">{CATEGORY_LABELS[r.category]}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(r.name)}
                    className="text-[#B4906A] hover:text-red-600 transition-colors p-1"
                    aria-label={`Remove ${r.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-['Raleway'] text-[#C4622D] hover:underline"
          >
            ← Back to roulette
          </button>
        </div>
      </div>
    </div>
  );
}
