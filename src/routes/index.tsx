import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import logo from "@/assets/logo.png.asset.json";
import heroImg from "@/assets/hero.jpg";
import loafImg from "@/assets/loaf.jpg";
import focacciaImg from "@/assets/focaccia.jpg";
import cookiesImg from "@/assets/cookies.jpg";
import specialImg from "@/assets/special.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "El Crustfund | Artisan Sourdough Microbakery" },
      {
        name: "description",
        content:
          "A mom & daughter family-owned microbakery. Slow-fermented sourdough loaves, focaccia and cookies. Order Mon-Thu, pick up or delivered Saturdays & Sundays.",
      },
      { property: "og:title", content: "El Crustfund | Artisan Sourdough Microbakery" },
      {
        property: "og:description",
        content:
          "Small-batch, slow-fermented sourdough baked with love by a mom & daughter team. Weekly menu drops with weekend pickup and delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Item = {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  tag?: string;
};

const MENU: Item[] = [
  {
    id: "classic",
    name: "Classic Country Loaf",
    desc: "48-hour cold ferment, crackling dark crust, custardy open crumb.",
    price: 12,
    img: loafImg,
    tag: "Best seller",
  },
  {
    id: "focaccia",
    name: "Rosemary Sea Salt Focaccia",
    desc: "Olive-oil dimpled slab with garden rosemary and flaky salt.",
    price: 14,
    img: focacciaImg,
  },
  {
    id: "cookies",
    name: "Sourdough Discard Cookies",
    desc: "Half dozen, browned butter and dark chocolate, tangy and chewy.",
    price: 10,
    img: cookiesImg,
  },
  {
    id: "special",
    name: "Weekly Special: Cinnamon Swirl Babka",
    desc: "Sweet sourdough enriched dough, cocoa cinnamon swirl, honey glaze.",
    price: 16,
    img: specialImg,
    tag: "This week only",
  },
];

const CAPACITY: Record<string, number> = {
  classic: 24,
  focaccia: 16,
  cookies: 20,
  special: 12,
};

function Index() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<"Pickup" | "Delivery">("Pickup");
  const [day, setDay] = useState<"Saturday" | "Sunday">("Saturday");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const lines = useMemo(
    () => MENU.filter((i) => (qty[i.id] ?? 0) > 0).map((i) => ({ ...i, count: qty[i.id]! })),
    [qty],
  );
  const total = lines.reduce((s, l) => s + l.count * l.price, 0);
  const itemCount = lines.reduce((s, l) => s + l.count, 0);
  const totalCapacity = Object.values(CAPACITY).reduce((s, c) => s + c, 0);
  const reserved = itemCount;
  const remaining = totalCapacity - reserved;

  const bump = (id: string, delta: number) =>
    setQty((q) => {
      const next = Math.max(0, (q[id] ?? 0) + delta);
      if (delta > 0 && next > CAPACITY[id]) return q;
      return { ...q, [id]: next };
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemCount === 0) {
      toast.error("Your basket is empty — add something warm from the menu.");
      return;
    }
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in your name, phone and email.");
      return;
    }
    toast.success(`Thank you, ${form.name}! Your ${method.toLowerCase()} order for ${day} is in.`);
    setQty({});
    setForm({ name: "", phone: "", email: "", notes: "" });
  };

  const field =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen text-foreground">
      <Toaster />

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo.url} alt="El Crustfund logo" className="h-11 w-11 rounded-full" />
            <span className="font-display text-lg font-semibold tracking-tight">El Crustfund</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#story" className="transition hover:text-primary">Our Story</a>
            <a href="#menu" className="transition hover:text-primary">Weekly Menu</a>
            <a href="#order" className="transition hover:text-primary">Order</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Artisan Sourdough Microbakery
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-cocoa sm:text-7xl">
              El Crustfund
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              A mom &amp; daughter family-owned microbakery. Slow, naturally fermented bread baked in
              small batches — and always in tiny weekly quantities.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-110"
              >
                View Weekly Menu
              </a>
              <a
                href="#order"
                className="rounded-full border border-crust/25 px-7 py-3.5 text-sm font-semibold text-crust transition hover:bg-dough"
              >
                Place Your Order
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
              <div>
                <dt className="text-muted-foreground">Fermented</dt>
                <dd className="font-display text-xl text-crust">48 hrs</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Order by</dt>
                <dd className="font-display text-xl text-crust">Thu 6pm</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ready</dt>
                <dd className="font-display text-xl text-crust">Weekends</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]">
              <img
                src={heroImg}
                width={1200}
                height={1400}
                alt="A mother and daughter shaping sourdough dough on a floured table"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-border bg-card px-5 py-3 shadow-[var(--shadow-soft)]">
              <p className="font-display text-sm text-cocoa">Baked with love by mom &amp; daughter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="border-y border-border bg-dough/50 py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Story</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-cocoa">
              Two pairs of hands, one very spoiled starter.
            </h2>
          </div>
          <div className="space-y-4 text-[1.05rem] leading-relaxed text-muted-foreground">
            <p>
              El Crustfund started at our kitchen table, with one jar of bubbling starter and a
              daughter who kept asking to help shape the dough. Years later, the jar is still going
              and so are we — mom mixing, daughter scoring, both of us arguing happily about crust.
            </p>
            <p>
              Every loaf rests through a long, slow natural fermentation. No commercial yeast, no
              shortcuts, no rushing. Just flour, water, salt, time, and hands that have learned what
              the dough is asking for.
            </p>
            <p>
              We bake in small batches so that every bag handed over on Saturday morning feels like
              it was made for the person carrying it home. Because it was.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 px-5 sm:grid-cols-3">
          {[
            ["Slow fermentation", "48-hour cold proof for deep flavor and easier digestion."],
            ["Small batch", "Limited weekly drops, never mass produced."],
            ["Family owned", "Mom mixes, daughter shapes, both of us deliver."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-display text-lg text-cocoa">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl border border-primary/25 bg-primary/8 p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How ordering works
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-xl text-cocoa">Ordering window</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Open <strong className="text-foreground">Monday through Thursday</strong>, closing at{" "}
                <strong className="text-foreground">6:00 PM sharp</strong>.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-cocoa">Pickup &amp; delivery</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <strong className="text-foreground">Saturdays &amp; Sundays</strong> — choose your day
                at checkout.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl text-cocoa">Weekly drop</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Limited batch. Once it's spoken for, it's gone until next week's bake.
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-14 text-4xl font-semibold text-cocoa">This week's menu</h2>
        <p className="mt-2 text-muted-foreground">Add what you'd like, then send your order below.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MENU.map((item) => {
            const count = qty[item.id] ?? 0;
            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="aspect-square w-full object-cover"
                  />
                  {item.tag ? (
                    <span className="absolute left-3 top-3 rounded-full bg-sky px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-accent-foreground">
                      {item.tag}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg leading-snug text-cocoa">{item.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-xl text-crust">${item.price}</span>
                    {count === 0 ? (
                      <button
                        onClick={() => bump(item.id, 1)}
                        className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                      >
                        Add to Order
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                        <button
                          aria-label={`Remove one ${item.name}`}
                          onClick={() => bump(item.id, -1)}
                          className="h-7 w-7 rounded-full text-lg leading-none text-crust transition hover:bg-dough"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">{count}</span>
                        <button
                          aria-label={`Add one ${item.name}`}
                          onClick={() => bump(item.id, 1)}
                          className="h-7 w-7 rounded-full text-lg leading-none text-crust transition hover:bg-dough"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Order form */}
      <section id="order" className="border-t border-border bg-dough/50 py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={submit}
            className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-9"
          >
            <h2 className="text-3xl font-semibold text-cocoa">Place your order</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Orders close Thursday at 6:00 PM. We'll text you to confirm.
            </p>

            <fieldset className="mt-7">
              <legend className="text-sm font-semibold text-foreground">Pickup or delivery</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["Pickup", "Delivery"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      method === m
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-foreground">Fulfillment day</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["Saturday", "Sunday"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      day === d
                        ? "border-sky bg-sky text-accent-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-sky/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-foreground">
                Name
                <input
                  className={`mt-2 ${field}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ana Rivera"
                />
              </label>
              <label className="text-sm font-semibold text-foreground">
                Phone number
                <input
                  className={`mt-2 ${field}`}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(555) 012-3456"
                  inputMode="tel"
                />
              </label>
              <label className="text-sm font-semibold text-foreground sm:col-span-2">
                Email
                <input
                  className={`mt-2 ${field}`}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                />
              </label>
              <label className="text-sm font-semibold text-foreground sm:col-span-2">
                Notes {method === "Delivery" ? "(delivery address)" : "(optional)"}
                <textarea
                  rows={3}
                  className={`mt-2 ${field}`}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={
                    method === "Delivery" ? "Street, city, gate code…" : "Anything we should know?"
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-110"
            >
              Submit order request
            </button>
          </form>

          <aside className="h-fit rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-2xl text-cocoa">Your basket</h3>
            {lines.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nothing yet — pick something from this week's menu.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {l.count} × {l.name}
                    </span>
                    <span className="font-semibold">${l.count * l.price}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex justify-between border-t border-border pt-4">
              <span className="font-display text-lg text-cocoa">Total</span>
              <span className="font-display text-lg text-crust">${total}</span>
            </div>
            <p className="mt-5 rounded-xl bg-dough p-4 text-xs leading-relaxed text-muted-foreground">
              {method} · {day}. Payment is collected at {method === "Pickup" ? "pickup" : "delivery"}.
            </p>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cocoa py-14 text-dough">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo.url} alt="" className="h-12 w-12 rounded-full" />
              <span className="font-display text-xl">El Crustfund</span>
            </div>
            <p className="mt-4 max-w-xs text-sm opacity-80">
              Artisan sourdough microbakery. Small batches, long ferments, weekend weekends.
            </p>
          </div>
          <div className="text-sm">
            <h4 className="font-display text-lg">Weekly schedule</h4>
            <ul className="mt-3 space-y-1 opacity-80">
              <li>Orders: Monday – Thursday, until 6:00 PM</li>
              <li>Pickup: Saturday &amp; Sunday</li>
              <li>Delivery: Saturday &amp; Sunday</li>
            </ul>
          </div>
          <div className="text-sm">
            <h4 className="font-display text-lg">Say hello</h4>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full border border-dough/30 px-5 py-2 transition hover:bg-dough/10"
            >
              Instagram @elcrustfund
            </a>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl border-t border-dough/20 px-5 pt-6 font-display text-sm opacity-80">
          Baked with love by mom &amp; daughter.
        </p>
      </footer>
    </div>
  );
}
