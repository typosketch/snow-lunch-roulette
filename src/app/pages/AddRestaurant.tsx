import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Trash2, CheckCircle } from "lucide-react";
function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path fill="#C9A96E" fillRule="evenodd" d="m205.82 539.57c42.707-4.8594 85.391-9.9961 128.12-14.484 36.289-3.8164 72.625-7.6562 109-9.9492 24.07-1.5469 38.34-15.086 49.402-34.129 2.5547-4.4297-0.058594-8.293-2.6992-12.539-12.672-20.375-31.523-35.328-46.789-53.398-27.406-32.375-56.293-63.492-84.504-95.195-0.68359-0.74219-0.51562-2.2422-1.4531-6.8633 56.125 45.637 109.99 89.438 165.05 134.22 16.402-21.406 30.289-40.859 34.32-65.711 4.8594-30.109 10.055-60.203 15-90.336 4.8828-29.711 11.785-58.969 18.625-88.285 3.4062-14.375 5.8086-29.004 8.7227-43.488h2.4844c10.141 37.812 18.602 75.996 24.648 114.68 5.8555 37.5 13.703 74.605 20.809 111.86 3.793 19.945 13.344 35.965 23.953 52.199 5.0391 7.6445 9.6719 8.1133 16.176 2.8203 22.297-18.156 44.797-36.023 66.816-54.48 29.473-24.707 60.707-47.23 88.859-73.488 0.82812 0.74219 1.668 1.4766 2.4609 2.207-7.7148 9.0234-15.359 18.109-23.172 27.023-37.078 42.156-74.102 84.312-111.32 126.31-5.1719 5.8438-4.1055 9.9492-0.10938 16.355 14.398 23.062 35.473 30.805 61.645 32.941 30.277 2.4844 60.898 0.43359 90.984 4.8008 31.078 4.5352 62.594-0.75781 93.539 4.9219 9.875 1.8125 19.738 2.7852 29.773 2.4844 3.4688-0.10938 6.6836 0.76953 8.0039 5.375-4.1523 4.2461-9.5273 5.4961-15.422 5.8438-68.27 4.0781-135.66 16.117-203.64 22.871-32.062 3.2031-57.289 19.586-75.73 46.234-3.2656 4.7266-4.5352 8.7617-0.70703 13.465 16.391 19.789 31.766 40.586 49.367 59.207 34.379 36.266 64.934 75.66 97.621 113.29 1.6445 1.9336 2.3984 4.6211 2.7734 7.4414-60.742-52.43-116.71-109.54-174.95-164.1-22.117 18.59-27.227 42.492-30.168 67.645-3.3828 29.137-7.8477 58.117-11.617 87.238-2.1953 16.801-3.9727 33.707-5.9141 50.543-3.2266 27.961-7.1992 55.871-9.3711 83.879-1.4531 19.465-3.6484 38.82-5.7227 58.199-1.8828 18.059-3.9102 36.086-9.6133 53.449h-5.0508c0.875-25.848-5.832-50.953-7.6797-76.547-1.5469-21.406-4.3555-42.781-6.9961-64.117-5.0625-40.68-5.9141-81.758-12.254-122.34-4.1641-26.953-7.1992-54.059-10.246-81.168-2.6172-22.703-15.012-39.539-31.934-56.641-58.273 53.891-112.57 110.91-172.96 161.4 47.258-63.07 102.42-119.5 151.11-181.82-8.7617-11.16-16.5-20.773-24.012-30.562-14.594-18.938-36.863-20.699-57.492-24.145-59.41-9.9258-119.66-11.508-179.62-15.59-12.781-0.86328-25.488-2.9531-38.16-4.4766 0.046875-1.6797 0.046875-3.3594 0.046875-5.0547z" />
    </svg>
  );
}
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
        <label className="text-sm font-semibold font-['Raleway'] text-[#EDE8DC] uppercase tracking-wider">
          {label}
        </label>
        {hint && <p className="text-xs text-[#9A8E7E] font-['Raleway'] -mt-0.5">{hint}</p>}
        {children}
        {error && <p className="text-xs text-[#C96E6E] font-['Raleway']">{error}</p>}
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#0D0B1A] border border-[rgba(201,169,110,0.25)] rounded-sm px-4 py-2.5 text-sm font-['Raleway'] text-[#EDE8DC] placeholder-[#7A7060] focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/20 transition-colors";

  return (
    <div className="flex flex-col items-center px-4 py-16 bg-[#0C0A14] min-h-screen">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <StarIcon className="w-20 h-auto mx-auto mb-5 opacity-80" />
          <p className="text-xs uppercase tracking-[0.45em] text-[#7A8C8E] mb-2 font-['Raleway'] font-semibold">
            Snow Creative Team Lunch
          </p>
          <h1 className="font-['Eczar'] text-4xl font-bold text-[#EDE8DC] mb-3 leading-tight">
            Add a Restaurant
          </h1>
          <p className="text-sm text-[#A89880] font-['Raleway'] leading-relaxed">
            Know a great spot we're missing? Add it to the pool and it'll show up in the roulette.
          </p>
        </div>

        {/* Form card */}
        <div
          className="relative rounded-sm p-8"
          style={{
            backgroundColor: "#08091A",
            border: "1px solid rgba(201,169,110,0.25)",
          }}
        >
          {/* Inner decorative border */}
          <div
            className="absolute pointer-events-none"
            style={{ inset: "10px", border: "1px solid rgba(201,169,110,0.1)" }}
          />
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4" style={{ borderTop: "1px solid rgba(201,169,110,0.5)", borderLeft: "1px solid rgba(201,169,110,0.5)" }} />
          <div className="absolute top-3 right-3 w-4 h-4" style={{ borderTop: "1px solid rgba(201,169,110,0.5)", borderRight: "1px solid rgba(201,169,110,0.5)" }} />
          <div className="absolute bottom-3 left-3 w-4 h-4" style={{ borderBottom: "1px solid rgba(201,169,110,0.5)", borderLeft: "1px solid rgba(201,169,110,0.5)" }} />
          <div className="absolute bottom-3 right-3 w-4 h-4" style={{ borderBottom: "1px solid rgba(201,169,110,0.5)", borderRight: "1px solid rgba(201,169,110,0.5)" }} />

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
                style={{ colorScheme: "dark" }}
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
              className="mt-2 flex items-center justify-center gap-2 bg-[#C9A96E] hover:bg-[#B8965A] text-[#08091A] px-8 py-3 text-sm font-semibold font-['Raleway'] tracking-widest uppercase rounded-sm shadow transition-all active:scale-95"
            >
              Add to the Oracle
            </button>

            {submitted && (
              <div className="flex items-center gap-2 justify-center text-sm font-['Raleway'] text-[#5FBFB0]">
                <CheckCircle className="w-4 h-4" />
                Added! It'll appear in the next spin.
              </div>
            )}
          </form>
        </div>

        {/* Custom restaurant list */}
        {custom.length > 0 && (
          <div className="mt-10">
            <h2 className="font-['Eczar'] text-xl font-bold text-[#EDE8DC] mb-4">
              Your Added Places
            </h2>
            <div className="flex flex-col gap-2">
              {custom.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between rounded-sm px-4 py-3"
                  style={{ backgroundColor: "#08091A", border: "1px solid rgba(201,169,110,0.2)" }}
                >
                  <div>
                    <p className="text-sm font-semibold font-['Raleway'] text-[#EDE8DC]">{r.name}</p>
                    <p className="text-xs text-[#9A8E7E] font-['Raleway']">{CATEGORY_LABELS[r.category] ?? r.category}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(r.name)}
                    className="text-[#9A8E7E] hover:text-[#C96E6E] transition-colors p-1"
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
            className="text-sm font-['Raleway'] text-[#C9A96E] hover:text-[#EDE8DC] transition-colors"
          >
            ← Back to the Oracle
          </button>
        </div>
      </div>
    </div>
  );
}
