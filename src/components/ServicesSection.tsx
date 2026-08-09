import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { robots } from "@/data/robots";

gsap.registerPlugin(ScrollTrigger);

/* Homepage robot lineup — numbered rows with cursor-following preview */
const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current =
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        gsap.from(".robot-row", {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
        gsap.from(".lineup-header > *", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }

      if (canHover.current && previewRef.current) {
        const xTo = gsap.quickTo(previewRef.current, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(previewRef.current, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: MouseEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!previewRef.current || !canHover.current) return;
    gsap.to(previewRef.current, {
      autoAlpha: activeIndex !== null ? 1 : 0,
      scale: activeIndex !== null ? 1 : 0.85,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <section
      id="robots"
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="lineup-header grid md:grid-cols-2 gap-6 items-end mb-16 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">The Lineup</span>
            </div>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
              One Robot For
              <br />
              <span className="text-outline-primary">Every Job</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
            From compact 4-axis pick & place arms to 50 kg heavy-payload machines,
            collaborative robots, and autonomous mobile robots — all running our
            own controller.
          </p>
        </div>

        {/* Robot rows */}
        <div className="border-t border-border">
          {robots.map((robot, index) => (
            <Link
              key={robot.id}
              to={`/robots/${robot.id}`}
              className="robot-row group relative flex items-center gap-4 md:gap-8 py-6 md:py-8 border-b border-border transition-colors duration-300 hover:bg-card"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="tech-label text-muted-foreground w-8 shrink-0 transition-colors duration-300 group-hover:text-primary">
                0{index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold uppercase tracking-tight text-xl sm:text-2xl md:text-4xl text-foreground transition-transform duration-300 md:group-hover:translate-x-3">
                  {robot.model}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 md:mt-3 md:transition-transform md:duration-300 md:group-hover:translate-x-3">
                  <span className="tech-label text-primary">{robot.axes}</span>
                  <span className="tech-label text-muted-foreground">{robot.payload} payload</span>
                  <span className="tech-label text-muted-foreground hidden sm:inline">{robot.reach} reach</span>
                  <span className="tech-label text-muted-foreground hidden md:inline">{robot.tagline}</span>
                </div>
              </div>

              {/* Inline thumbnail for touch devices */}
              <div className="w-20 h-14 sm:w-24 sm:h-16 shrink-0 overflow-hidden md:hidden bg-card border border-border flex items-center justify-center">
                {robot.image ? (
                  <img
                    src={robot.image}
                    alt={robot.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <Bot className="w-6 h-6 text-primary/60" />
                )}
              </div>

              <span className="hidden md:flex w-12 h-12 border border-border items-center justify-center shrink-0 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                <ArrowUpRight className="w-5 h-5 text-foreground transition-colors duration-300 group-hover:text-primary-foreground" />
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            to="/robots"
            className="group inline-flex items-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
          >
            Compare All Robots
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Cursor-following preview (desktop only) */}
      <div
        ref={previewRef}
        className="fixed top-0 left-0 z-30 w-72 h-52 pointer-events-none hidden md:block opacity-0 -translate-x-1/2 -translate-y-1/2"
        style={{ visibility: "hidden" }}
        aria-hidden="true"
      >
        <div className="relative w-full h-full border border-primary/40 overflow-hidden shadow-2xl bg-[#eef3f4]">
          {robots.map((robot, i) => (
            <div
              key={robot.id}
              className={`absolute inset-0 transition-opacity duration-300 ${
                activeIndex === i ? "opacity-100" : "opacity-0"
              }`}
            >
              {robot.image ? (
                <img
                  src={robot.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-contain p-3"
                />
              ) : (
                <div className="w-full h-full bg-card flex flex-col items-center justify-center gap-2">
                  <Bot className="w-10 h-10 text-primary" />
                  <span className="tech-label text-muted-foreground">Render coming soon</span>
                </div>
              )}
            </div>
          ))}
          <span className="absolute top-2 left-2 tech-label text-primary-foreground bg-primary px-2 py-0.5">
            {activeIndex !== null ? robots[activeIndex].model : ""}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
