import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Wheat, MapPin, Clock, AtSign, Mail, ShoppingBasket, Flame } from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import heroImg from "@/assets/boule.jpg";
import doughImg from "@/assets/dough.jpg";
import handsImg from "@/assets/hands.jpg";
import pastriesImg from "@/assets/pastries.jpg";
import loafImg from "@/assets/loaf.jpg";
import focacciaImg from "@/assets/focaccia.jpg";
import cookiesImg from "@/assets/cookies.jpg";
import specialImg from "@/assets/special.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "El Crustfund | Mother & Daughter Sourdough Microbakery" },
      {
        name: "description",
        content:
          "Slow bread, wild crumb, family hands. A mother & daughter sourdough microbakery — 36-hour ferment, pre-order by Wednesday 6 PM, pick up warm on the weekend.",
      },
      { property: "og:title", content: "El Crustfund | Mother & Daughter Sourdough Microbakery" },
      {
        property: "og:description",
        content:
          "36-hour cold-fermented sourdough, focaccia and morning pastries. Weekend bake drops from a two-person family microbakery.",
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
  cat: "Wild Sourdoughs" | "Morning Pastries" | "Enriched & Focaccia" | "Pantry";
  tag?: string;
  cap: number;
};

const MENU: Item[] = [
  {
    id: "focaccia",
    name: "Focaccia Barese",
    desc: "High-hydration focaccia drowned in good olive oil, tomatoes, red onion and garden rosemary.",
    price: 14,
    img: focacciaImg,
    cat: "Enriched & Focaccia",
    tag: "Vegan",
    cap: 16,
  },
  {
    id: "classic",
    name: "Country Boule",
    desc: "36-hour cold ferment, stone-milled flour, blistered dark crust and a custardy open crumb.",
    price: 12,
    img: loafImg,
    cat: "Wild Sourdoughs",
    tag: "Best seller",
    cap: 24,
  },
  {
    id: "buns",
    name: "Mom's Morning Buns",
    desc: "Laminated sourdough buns rolled in cinnamon sugar. The recipe has never been written down.",
    price: 15,
    img: pastriesImg,
    cat: "Morning Pastries",
    cap: 18,
  },
  {
    id: "cookies",
    name: "Discard Cookies",
    desc: "Half dozen. Browned butter, dark chocolate, sea salt — tangy, chewy, dangerous.",
    price: 10,
    img: cookiesImg,
    cat: "Pantry",
    cap: 20,
  },
  {
    id: "special",
    name: "Cinnamon Swirl Babka",
    desc: "Enriched sweet sourdough, cocoa-cinnamon swirl, honey glaze. This week only.",
    price: 16,
    img: specialImg,
    cat: "Enriched & Focaccia",
    tag: "This week only",
    cap: 12,
  },
  {
    id: "seeded",
    name: "Seeded Sesame Batard",
    desc: "Toasted sesame and flax crust over a soft, faintly sweet crumb. Best for toast.",
    price: 13,
    img: heroImg,
    cat: "Wild Sourdoughs",
    cap: 18,
  },
];

const CATS = ["All", "Wild Sourdoughs", "Morning Pastries", "Enriched & Focaccia", "Pantry"] as const;

const BATCH_CAPACITY = 120;

const MANIFESTO = [
  {
    n: "01",
    title: "The Seven-Year Starter",
    body: "Our starter is older than the business. Fed twice a day, every day, for seven years — through moves, holidays and one memorable power outage. It travels in a cooler. It has a name.",
    img: doughImg,
    quote: null,
  },
  {
    n: "02",
    title: "Mother & Daughter Hands",
    body: "Mom mixes and shapes. Her daughter scores, bakes and runs the numbers. Every loaf passes through four hands before it reaches yours — that's the whole company, and that's the point.",
    img: handsImg,
    quote: "We never wanted a factory. We wanted a kitchen. — The Daughter",
  },
  {
    n: "03",
    title: "The 36-Hour Cold Ferment",
    body: "Mixed on Thursday, cold-proofed until Saturday dawn. Slow fermentation builds the flavour, the blistered crust and a crumb that's gentler on your gut. Good bread cannot be rushed, so we don't.",
    img: loafImg,
    quote: "The fridge does half the work. Time does the rest. — Mom",
  },
  {
    n: "04",
    title: "The El Crustfund Dividend",
    body: "Why the name? Because every loaf you buy is an investment in a tiny family economy — and the dividend is warm bread, a market stall that knows your name, and a starter that outlives us all.",
    img: null,
    quote: "Best return on investment you'll ever taste. — The Daughter",
  },
];

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  // Next Monday 08:00 local
  const target = useMemo(() => {
    const d = new Date(now);
    const next = new Date(d);
    next.setHours(8, 0, 0, 0);
    const days = (8 - d.getDay()) % 7;
    next.setDate(d.getDate() + (days === 0 && d.getHours() >= 8 ? 7 : days));
    return next.getTime();
  }, [Math.floor(now / 60000)]);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hrs: Math.floor((diff / 3600000) % 24),
    min: Math.floor((diff / 60000) % 60),
    sec: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function Index() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [method, setMethod] = useState<"Pickup" | "Delivery">("Pickup");
  const [day, setDay] = useState<"Saturday" | "Sunday">("Saturday");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const cd = useCountdown();

  const lines = useMemo(
    () => MENU.filter((i) => (qty[i.id] ?? 0) > 0).map((i) => ({ ...i, count: qty[i.id]! })),
    [qty],
  );
  const total = lines.reduce((s, l) => s + l.count * l.price, 0);
  const itemCount = lines.reduce((s, l) => s + l.count, 0);
  const visible = cat === "All" ? MENU : MENU.filter((i) => i.cat === cat);

  const bump = (item: Item, delta: number) =>
    setQty((q) => {
      const next = Math.max(0, (q[item.id] ?? 0) + delta);
      if (delta > 0 && next > item.cap) return q;
      return { ...q, [item.id]: next };
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemCount === 0) {
      toast.error("Your basket is empty — add something warm from the bake list.");
      return;
    }
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in your name, phone and email.");
      return;
    }
    toast.success(`Thank you, ${form.name}! Your ${method.toLowerCase()} for ${day} is booked.`);
    setQty({});
    setForm({ name: "", phone: "", email: "", notes: "" });
  };

  const field =
    "w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const Marquee = ({ items, dark = false }: { items: string[]; dark?: boolean }) => (
    <div
      className={`overflow-hidden border-y py-4 ${dark ? "border-dough/15 bg-ink text-dough" : "border-border bg-background"}`}
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl italic tracking-tight">
            {t}
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-foreground">
      <Toaster />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo.url} alt="El Crustfund logo" className="h-11 w-11 rounded-full" />
            <span className="font-display text-xl font-semibold tracking-tight">El Crustfund</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#menu" className="transition hover:text-primary">Menu</a>
            <a href="#story" className="transition hover:text-primary">Our Story</a>
            <a href="#gallery" className="transition hover:text-primary">Gallery</a>
            <a href="#visit" className="transition hover:text-primary">Visit Us</a>
          </nav>
          <a
            href="#order"
            className="flex items-center gap-2 rounded-full bg-primary py-2 pl-4 pr-2 text-primary-foreground transition hover:brightness-110"
            aria-label={`Basket, ${itemCount} items`}
          >
            <ShoppingBasket className="h-5 w-5" />
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-sm font-bold text-primary">
              {itemCount}
            </span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-3 rounded-full border border-border bg-muted/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa">
              <Flame className="h-4 w-4 text-primary" />A mother &amp; daughter sourdough microbakery
            </span>
            <h1 className="mt-7 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
              Slow bread.
              <br />
              <em className="not-italic italic text-primary">Wild crumb.</em>
              <br />
              Family hands.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              Every loaf at El Crustfund is mixed, shaped and baked by the two of us — a 36-hour
              ferment, stone-milled flour, and one very patient starter. Order before Wednesday
              night, pick up warm on the weekend.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-110"
              >
                Order this week's drop
              </a>
              <a
                href="#story"
                className="rounded-full border border-border px-8 py-4 text-sm font-bold text-foreground transition hover:bg-muted"
              >
                Our story
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-3 -top-3 hidden h-full w-full rounded-[2rem] bg-primary sm:block" />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/80 shadow-[var(--shadow-lift)]">
              <img
                src={heroImg}
                width={1200}
                height={1400}
                alt="A flour-dusted sourdough boule resting on burlap"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative -mt-14 ml-0 w-[85%] rounded-3xl bg-card p-6 shadow-[var(--shadow-lift)] sm:-ml-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Oven schedule
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug">
                Bakes drop Saturday &amp; Sunday mornings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Orders close Wednesday 6:00 PM sharp.
              </p>
            </div>
          </div>
        </div>

        {/* Bake drop / capacity */}
        <div className="mt-16 rounded-[2rem] border border-ink/80 bg-sky p-7 shadow-[var(--shadow-lift)] sm:p-9">
          <div className="flex flex-wrap items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-background">
              <Wheat className="h-7 w-7 text-primary" />
            </span>
            <div className="min-w-[16rem] flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cocoa/70">
                Order window open
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold text-cocoa">
                Weekend Bake Drop <span className="text-cocoa/60">#37</span>
              </h2>
              <p className="mt-1 max-w-md text-cocoa/80">
                This week's bake is filling up. The window closes Wednesday at 6:00 PM.
              </p>
            </div>
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-cocoa/70">
            Orders close in
          </p>
          <div className="mt-3 grid max-w-lg grid-cols-4 gap-3">
            {[
              [pad(cd.days), "days"],
              [pad(cd.hrs), "hrs"],
              [pad(cd.min), "min"],
              [pad(cd.sec), "sec"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-background py-4 text-center">
                <div className="font-display text-3xl font-bold">{v}</div>
                <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-cocoa/80">
            <span>Batch capacity</span>
            <span>
              {itemCount}/{BATCH_CAPACITY} loaves
            </span>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-cocoa transition-all duration-500"
              style={{ width: `${Math.max(3, (itemCount / BATCH_CAPACITY) * 100)}%` }}
            />
          </div>
        </div>
      </section>

      <Marquee
        items={["FERMENTED 36 HOURS", "MOTHER & DAUGHTER", "STONE-MILLED FLOUR", "SATURDAY & SUNDAY DROPS"]}
      />

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          This week's bake list
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          The menu, baked <em className="text-primary">to order</em>
        </h2>

        <div className="mt-7 flex flex-wrap gap-3">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => {
            const count = qty[item.id] ?? 0;
            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
              >
                <div className="relative">
                  <img
                    src={item.img}
                    width={800}
                    height={600}
                    loading="lazy"
                    alt={item.name}
                    className="h-56 w-full object-cover"
                  />
                  {item.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-background/95 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cocoa">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold leading-tight">{item.name}</h3>
                    <span className="font-display text-2xl font-bold text-primary">${item.price}</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                  <div className="mt-5">
                    {count === 0 ? (
                      <button
                        onClick={() => bump(item, 1)}
                        className="w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
                      >
                        Add to order
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-full border border-border px-3 py-1.5">
                        <button
                          aria-label={`Remove one ${item.name}`}
                          onClick={() => bump(item, -1)}
                          className="h-9 w-9 rounded-full text-xl leading-none text-crust transition hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold">{count} in basket</span>
                        <button
                          aria-label={`Add one ${item.name}`}
                          onClick={() => bump(item, 1)}
                          disabled={count >= item.cap}
                          className="h-9 w-9 rounded-full text-xl leading-none text-crust transition hover:bg-muted disabled:opacity-30"
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

      {/* Manifesto */}
      <section id="story" className="border-t border-border py-20">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            The family manifesto
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Four chapters of{" "}
            <em className="text-primary">flour, water &amp; stubbornness</em>
          </h2>

          <div className="mt-14 space-y-20">
            {MANIFESTO.map((c, i) => (
              <div
                key={c.n}
                className={`grid items-center gap-10 ${c.img ? "md:grid-cols-2" : ""} ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                {c.img && (
                  <div className="relative">
                    <div className="absolute -bottom-3 -left-3 h-full w-full rounded-[1.75rem] bg-sky" />
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-ink/80">
                      <img
                        src={c.img}
                        width={1200}
                        height={1000}
                        loading="lazy"
                        alt={c.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Chapter {c.n}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-bold">{c.title}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{c.body}</p>
                  {c.quote && (
                    <blockquote className="mt-6 border-l-4 border-sky pl-5 font-display text-xl italic leading-relaxed">
                      {c.quote}
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            From the oven cam
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Crust, crumb &amp; <em className="text-primary">flour dust</em>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[loafImg, pastriesImg, focacciaImg, doughImg, specialImg, handsImg, cookiesImg, heroImg].map(
              (src, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-3xl border border-border ${
                    i % 5 === 0 ? "row-span-2" : ""
                  }`}
                >
                  <img
                    src={src}
                    width={800}
                    height={800}
                    loading="lazy"
                    alt="El Crustfund bakes"
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            The whole team
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Two people. <em className="text-primary">One oven.</em>
          </h2>
          <div className="mt-10 grid gap-7 md:grid-cols-2">
            <div className="rounded-[2rem] bg-primary p-8 text-primary-foreground sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-80">
                Co-founder · Dough
              </p>
              <h3 className="mt-3 font-display text-4xl font-bold">Mom</h3>
              <p className="mt-5 leading-relaxed opacity-90">
                Keeper of the starter, ruler of the mixing bowl. She's been baking sourdough since
                before it was cool — and she'll tell you so. Her morning bun recipe has never been
                written down, and never will be.
              </p>
              <p className="mt-6 font-display text-xl italic">
                "If the dough isn't talking, you're not listening."
              </p>
            </div>
            <div className="rounded-[2rem] bg-sky p-8 text-cocoa sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                Co-founder · Fire &amp; figures
              </p>
              <h3 className="mt-3 font-display text-4xl font-bold">The Daughter</h3>
              <p className="mt-5 leading-relaxed opacity-90">
                Scores every loaf by hand, wakes up at 4 AM to fire the oven, and built the whole
                pre-order system so Mom never has to guess how many boules to shape. Chief Crust
                Officer, self-appointed.
              </p>
              <p className="mt-6 font-display text-xl italic">
                "Bread is a growth asset. Literally."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit + order */}
      <section id="visit" className="border-t border-border bg-sky/25 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Come say hi</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Find us at the <em className="text-primary">stall &amp; the porch</em>
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <ul className="space-y-7">
                {[
                  [MapPin, "Bakery HQ — Porch Pickup", "Maple Ave, Suite B · Saturday 8:30 AM–12 PM & Sunday 9–11:30 AM"],
                  [MapPin, "Downtown Farmers Market — Stall #14", "Every Saturday, 9 AM–1 PM · come early for croissants"],
                  [Clock, "Pre-order rhythm", "Orders open Monday morning, close Wednesday 6:00 PM sharp"],
                ].map(([Icon, t, d]) => {
                  const I = Icon as typeof MapPin;
                  return (
                    <li key={t as string} className="flex gap-4">
                      <I className="mt-1 h-6 w-6 shrink-0 text-primary" />
                      <div>
                        <h3 className="font-display text-xl font-bold">{t as string}</h3>
                        <p className="mt-1 text-muted-foreground">{d as string}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 flex flex-wrap gap-7 text-sm font-semibold">
                <a
                  href="https://instagram.com/elcrustfund"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-primary"
                >
                  <AtSign className="h-5 w-5" /> @elcrustfund
                </a>
                <a href="mailto:hello@elcrustfund.com" className="flex items-center gap-2 transition hover:text-primary">
                  <Mail className="h-5 w-5" /> hello@elcrustfund.com
                </a>
              </div>
            </div>

            {/* Order form */}
            <form
              id="order"
              onSubmit={submit}
              className="rounded-[2rem] border border-border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-9"
            >
              <h3 className="font-display text-3xl font-bold">Custom bakes &amp; orders</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Wedding loaves, starter advice, wholesale for your café — or just this week's drop.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {(["Pickup", "Delivery"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      method === m
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {(["Saturday", "Sunday"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      day === d
                        ? "border-sky bg-sky text-cocoa"
                        : "border-border bg-background text-muted-foreground hover:border-sky/50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  className={field}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  aria-label="Your name"
                />
                <input
                  className={field}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone number"
                  aria-label="Phone number"
                  inputMode="tel"
                />
                <input
                  className={`${field} sm:col-span-2`}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <textarea
                  rows={3}
                  className={`${field} sm:col-span-2`}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={
                    method === "Delivery" ? "Delivery address, gate code…" : "Anything we should know?"
                  }
                  aria-label="Notes"
                />
              </div>

              <div className="mt-6 rounded-2xl bg-muted/70 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold">Your basket</span>
                  <span className="font-display text-lg font-bold text-primary">${total}</span>
                </div>
                {lines.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nothing yet — pick something from this week's bake list.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {lines.map((l) => (
                      <li key={l.id} className="flex justify-between gap-4">
                        <span>
                          {l.count} × {l.name}
                        </span>
                        <span className="font-semibold text-foreground">${l.count * l.price}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {method} · {day}. Paid at {method === "Pickup" ? "pickup" : "delivery"}.
                </p>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition hover:brightness-110"
              >
                Send my order
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-dough">
        <Marquee
          dark
          items={["BAKED WITH A 7-YEAR STARTER", "SATURDAY & SUNDAY DROPS", "PRE-ORDERS ONLY"]}
        />
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex flex-wrap items-center gap-6">
            <img src={logo.url} alt="" className="h-20 w-20 rounded-full bg-background" />
            <div>
              <p className="font-display text-4xl font-bold">El Crustfund</p>
              <p className="font-display text-2xl font-bold italic text-primary">
                fermented slowly, shared warmly.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
                Bake drops
              </h3>
              <ul className="mt-4 space-y-1 opacity-90">
                <li>Saturday 8:30–12</li>
                <li>Sunday 9–11:30</li>
                <li>Pre-orders only</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
                Order window
              </h3>
              <ul className="mt-4 space-y-1 opacity-90">
                <li>Opens Monday 8 AM</li>
                <li>Closes Wednesday 6 PM</li>
                <li>Sharp. Mom's rules.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">Explore</h3>
              <ul className="mt-4 space-y-1 opacity-90">
                <li><a href="#menu" className="hover:text-primary">Menu</a></li>
                <li><a href="#story" className="hover:text-primary">Our Story</a></li>
                <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
                <li><a href="#visit" className="hover:text-primary">Visit Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
                The family
              </h3>
              <p className="mt-4 opacity-90">
                A mother &amp; daughter microbakery. Every loaf shaped by our four hands, paid for at
                pickup.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dough/20 pt-6 text-sm opacity-60">
            <p>© 2026 El Crustfund Microbakery · Maple Ave, Suite B</p>
            <p className="flex items-center gap-2">
              <Wheat className="h-4 w-4" /> Baked with love by mom &amp; daughter
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
