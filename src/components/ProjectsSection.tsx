import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Hand,
  Cog,
  Package,
  Layers,
  Flame,
  SprayCan,
  Puzzle,
  Box,
  Forklift,
  ScanEye,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { industries } from "@/data/robots";

gsap.registerPlugin(ScrollTrigger);

const applicationCards = [
  { icon: Hand, title: "Pick & Place", note: "High-speed part transfer & sorting" },
  { icon: Cog, title: "Machine Tending", note: "CNC, press & injection molding" },
  { icon: Layers, title: "Loading / Unloading", note: "Automated CNC work cells" },
  { icon: Package, title: "Palletizing", note: "End-of-line case & bag stacking" },
  { icon: Flame, title: "Welding", note: "Arc welding with seam tracking" },
  { icon: SprayCan, title: "Spray Painting", note: "Continuous-path coating" },
  { icon: Puzzle, title: "Assembly", note: "Precision joining & fastening" },
  { icon: Box, title: "Packaging", note: "Cartoning, kitting & sealing" },
  { icon: Forklift, title: "Material Handling", note: "AMR-driven intralogistics" },
  { icon: ScanEye, title: "Vision Inspection", note: "Camera-guided quality control" },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".apps-header > *", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
      gsap.from(".app-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ".apps-grid", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="applications" ref={sectionRef} className="py-24 md:py-36 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="apps-header grid md:grid-cols-2 gap-6 items-end mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">Applications</span>
            </div>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
              Put A Robot
              <br />
              <span className="text-outline-primary">On The Job</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
            Ten proven application areas — each delivered as a complete cell with
            robot, tooling, safety, programming, and training.
          </p>
        </div>

        {/* Applications grid */}
        <div className="apps-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border border border-border">
          {applicationCards.map((app, index) => (
            <Link
              key={index}
              to="/solutions"
              className="app-card group relative bg-background p-6 md:p-8 transition-colors duration-300 hover:bg-card"
            >
              <span className="tech-label text-muted-foreground/50 absolute top-4 right-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 border border-border flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                <app.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-base md:text-lg text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
                {app.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{app.note}</p>
            </Link>
          ))}
        </div>

        {/* Industries ticker */}
        <div className="mt-12 border-y border-border overflow-hidden marquee-paused" aria-hidden="true">
          <div className="animate-marquee flex w-max items-center py-3.5">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center shrink-0">
                <span className="tech-label text-primary px-4 shrink-0">Industries we serve —</span>
                {industries.map((ind, i) => (
                  <span key={i} className="flex items-center shrink-0">
                    <span className="tech-label text-muted-foreground px-4">{ind}</span>
                    <span className="w-1 h-1 bg-primary rotate-45" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/solutions"
            className="group inline-flex items-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
          >
            See How We Deliver A Cell
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
