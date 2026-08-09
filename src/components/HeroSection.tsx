import { lazy, Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useMagnetic } from "@/hooks/useMagnetic";
import { applications } from "@/data/robots";

const RobotScene = lazy(() => import("@/components/three/RobotScene"));

gsap.registerPlugin(ScrollTrigger);

/* Pre-split headline characters so GSAP can stagger them */
const SplitLine = ({ text, className = "" }: { text: string; className?: string }) => (
  <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`} aria-hidden="true">
    {text.split("").map((c, i) => (
      <span key={i} className="hero-char inline-block will-change-transform">
        {c === " " ? " " : c}
      </span>
    ))}
  </span>
);

const stats = [
  { value: 25, suffix: "+", label: "Years Engineering" },
  { value: 6, suffix: "", label: "Axis Robot Range", prefix: "4–" },
  { value: 8, suffix: "", label: "Core Parts In-House" },
  { value: 100, suffix: "%", label: "Made in India" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryBtnRef = useMagnetic<HTMLAnchorElement>(0.2);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".hero-char, .hero-fade, .hero-kicker", { clearProps: "all" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-scene", { opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
        .from(".hero-kicker", { opacity: 0, y: 16, duration: 0.7 }, 0.15)
        .from(".hero-char", { yPercent: 115, duration: 1.05, stagger: 0.022 }, 0.3)
        .from(".hero-fade", { opacity: 0, y: 24, duration: 0.8, stagger: 0.12 }, 0.9);

      // Count-up stats
      gsap.utils.toArray<HTMLElement>(".hero-stat-value").forEach((el) => {
        const target = Number(el.dataset.value || 0);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.6,
          delay: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.n)}${suffix}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="home"
        ref={sectionRef}
        className="relative min-h-screen flex items-end overflow-hidden bg-background noise"
      >
        {/* Three.js robot scene */}
        <div className="hero-scene absolute inset-0 z-0 opacity-70 md:opacity-100 md:left-[28%]">
          <Suspense fallback={null}>
            <RobotScene />
          </Suspense>
        </div>
        {/* Gradient so copy stays readable over the scene */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 z-[1] bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Blueprint grid */}
        <div className="absolute inset-0 z-[1] blueprint-grid opacity-40 pointer-events-none" />

        {/* Technical corner marks */}
        <div className="absolute top-28 left-6 md:left-10 z-[3] tech-label text-muted-foreground hidden md:block hero-fade">
          ROBOT CONTROL / CAM SOFTWARE
        </div>
        <div className="absolute top-28 right-6 md:right-10 z-[3] tech-label text-muted-foreground hidden md:block hero-fade">
          EST. 2004 — COIMBATORE, IN
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-40 pb-16">
          <div className="max-w-5xl">
            <div className="hero-kicker inline-flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">
                Industrial Robotics — Designed & Built in India
              </span>
            </div>

            <h1
              className="font-display font-bold uppercase leading-[0.95] tracking-tight text-foreground text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl mb-8"
              aria-label="Robots built for real factories"
            >
              <SplitLine text="Robots Built" />
              <SplitLine text="For Real" className="text-primary" />
              <SplitLine text="Factories" />
            </h1>

            <div className="grid md:grid-cols-2 gap-8 items-end">
              <p className="hero-fade text-muted-foreground text-base md:text-lg max-w-md leading-relaxed">
                4 to 6-axis industrial robot arms, collaborative robots, and
                autonomous mobile robots — with our own controller, drives, and
                CAM software. Engineered in-house, supported locally.
              </p>

              <div className="hero-fade flex flex-col sm:flex-row md:justify-end gap-4">
                <Link
                  ref={primaryBtnRef}
                  to="/robots"
                  className="group relative inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                    Explore Robots
                  </span>
                  <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background" />
                </Link>
                <Link
                  to="/solutions"
                  className="group inline-flex items-center justify-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
                >
                  Automation Solutions
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="hero-fade mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 border-t border-border">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="py-6 pr-6 md:px-6 first:md:pl-0 border-border md:border-l first:md:border-l-0"
                >
                  <div
                    className="hero-stat-value font-display text-3xl md:text-4xl font-bold text-foreground mb-1"
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                    data-prefix={stat.prefix || ""}
                  >
                    {stat.prefix || ""}0{stat.suffix}
                  </div>
                  <div className="tech-label text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Applications marquee */}
      <div className="relative z-10 border-y border-border bg-card overflow-hidden marquee-paused" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center py-4">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {applications.map((app, i) => (
                <span key={i} className="flex items-center shrink-0">
                  <span className="font-display uppercase tracking-widest text-sm md:text-base px-6 text-foreground/80">
                    {app}
                  </span>
                  <span className="text-primary text-lg">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
