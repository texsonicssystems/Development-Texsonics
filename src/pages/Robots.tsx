import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { robots } from "@/data/robots";

gsap.registerPlugin(ScrollTrigger);

const seriesFilters = ["All", "TS Series", "TSA Series", "TSCR Series", "AMR Series"];

const robotsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: robots.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.texsonics.net/robots/${r.id}`,
      name: r.name,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
      { "@type": "ListItem", position: 2, name: "Robots", item: "https://www.texsonics.net/robots" },
    ],
  },
];

const Robots = () => {
  const [activeSeries, setActiveSeries] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeSeries === "All" ? robots : robots.filter((r) => r.series === activeSeries);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".robot-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [activeSeries]);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Industrial Robots Made in India | 4–6 Axis, Cobots, AMRs"
        description="Explore Texsonics AIR series robots (3–50 kg payload), CS series cobots, and AMR mobile robots — made in Coimbatore with our own controller and software."
        canonical="/robots"
        keywords="industrial robot India, 6 axis robot arm, 4 axis robot, robot manufacturer Coimbatore, collaborative robot India, cobot, AMR autonomous mobile robot, machine tending robot, welding robot, palletizing robot"
        jsonLd={robotsJsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Robots" }]} />

          {/* Header */}
          <div className="grid md:grid-cols-2 gap-6 items-end mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Robot Lineup</span>
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
                Industrial Robots
                <br />
                <span className="text-outline-primary">Made In India</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
              Every robot ships with our own RC series controller, teach pendant,
              and software — engineered, built, and supported from Coimbatore.
            </p>
          </div>

          {/* Series filter */}
          <div className="flex flex-wrap gap-2 mb-10 border-y border-border py-4">
            {seriesFilters.map((series) => (
              <button
                key={series}
                onClick={() => setActiveSeries(series)}
                className={`tech-label px-4 py-2 border transition-all duration-300 ${
                  activeSeries === series
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {series}
              </button>
            ))}
            <span className="tech-label text-muted-foreground/50 ml-auto self-center hidden sm:block">
              {String(filtered.length).padStart(2, "0")} MODELS
            </span>
          </div>

          {/* Grid */}
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {filtered.map((robot) => (
              <Link
                key={robot.id}
                to={`/robots/${robot.id}`}
                className="robot-card group relative bg-background overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#eef3f4] flex items-center justify-center">
                  {robot.image ? (
                    <img
                      src={robot.image}
                      alt={`${robot.name} — ${robot.axes} industrial robot by Texsonics`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Bot className="w-14 h-14 text-primary/50" />
                      <span className="tech-label text-muted-foreground">
                        Render coming soon
                      </span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 tech-label bg-background/85 backdrop-blur px-3 py-1.5 text-foreground border border-border">
                    {robot.series}
                  </span>
                  <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="font-display font-bold uppercase tracking-tight text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                      {robot.model}
                    </h2>
                    <span className="w-10 h-10 border border-border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                      <ArrowUpRight className="w-4 h-4 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" />
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {robot.description}
                  </p>
                  {/* Key specs strip */}
                  <div className="mt-auto grid grid-cols-3 border-t border-border pt-4 gap-2">
                    <div>
                      <div className="tech-label text-muted-foreground/60 mb-1">Axes</div>
                      <div className="font-display font-semibold text-sm text-foreground">{robot.axes}</div>
                    </div>
                    <div>
                      <div className="tech-label text-muted-foreground/60 mb-1">Payload</div>
                      <div className="font-display font-semibold text-sm text-foreground">{robot.payload}</div>
                    </div>
                    <div>
                      <div className="tech-label text-muted-foreground/60 mb-1">Reach</div>
                      <div className="font-display font-semibold text-sm text-foreground">{robot.reach}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="tech-label text-muted-foreground/60 mt-6">
            Specifications are indicative — request the datasheet for guaranteed figures.
          </p>

          {/* CTA */}
          <div className="text-center mt-14">
            <p className="text-muted-foreground mb-6">
              Not sure which robot fits your process? Our engineers will size it for you.
            </p>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                Talk To An Engineer
              </span>
              <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:text-background transition-colors duration-300" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Robots;
