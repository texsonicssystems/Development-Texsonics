import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Wrench, MapPin, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import workshopImg from "@/assets/robots/workshop-air6.jpg";

gsap.registerPlugin(ScrollTrigger);

const inHouse = [
  "Robot arm structure & machining",
  "RC series robot controller",
  "Drive electronics & servo tuning",
  "End effectors & grippers",
  "Motion software & CAM toolchain",
  "HMI, teach pendant & vision system",
];

const advantages = [
  {
    icon: Cpu,
    title: "Our Own Controller",
    description:
      "We design the controller, drives, and software ourselves — so nothing about your robot is a black box, and custom features ship in weeks.",
  },
  {
    icon: Wrench,
    title: "In-House Manufacturing",
    description:
      "Arm, electronics, end effector, pendant — built under one roof in Coimbatore. Faster delivery and lower cost than imported brands.",
  },
  {
    icon: MapPin,
    title: "Local Engineering Support",
    description:
      "Installation, programming, training, and annual service handled by our own engineers — not a distributor's ticket queue.",
  },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-item", {
        opacity: 0,
        y: 36,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });

      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: { trigger: imageWrapRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.from(".about-value", {
        opacity: 0,
        x: 40,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-values", start: "top 82%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" ref={sectionRef} className="relative py-24 md:py-36 bg-card noise overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Left — copy */}
          <div>
            <div className="about-item flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">Why Texsonics</span>
            </div>

            <h2 className="about-item font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
              Everything
              <br />
              <span className="text-gradient-brand">Under One</span>
              <br />
              Roof
            </h2>

            <p className="about-item text-muted-foreground text-base md:text-lg mb-4 max-w-lg leading-relaxed">
              Most robot suppliers assemble someone else's arm around someone
              else's controller. We don't. Texsonics designs and manufactures the
              complete stack — mechanics, electronics, and software — backed by
              25+ years of engineering in Coimbatore.
            </p>
            <p className="about-item text-muted-foreground mb-10 max-w-lg leading-relaxed">
              That means higher payload per rupee, custom engineering without
              vendor lock-in, and a service engineer who actually built the
              machine standing in your plant.
            </p>

            {/* In-house list */}
            <div className="about-item border-t border-border mb-10">
              {inHouse.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 py-3.5 border-b border-border transition-colors duration-300 hover:bg-background/50"
                >
                  <Plus className="w-4 h-4 text-primary shrink-0 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="text-foreground text-sm md:text-base">{item}</span>
                  <span className="tech-label text-muted-foreground/50 ml-auto hidden sm:block">
                    IN-HOUSE-{String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/technology"
              className="about-item group inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                Explore Our Technology
              </span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background" />
            </Link>
          </div>

          {/* Right — image + advantages */}
          <div className="relative">
            <div ref={imageWrapRef} className="relative overflow-hidden">
              <img
                ref={imageRef}
                src={workshopImg}
                alt="Texsonics AIR series 6-axis robot in the Coimbatore workshop"
                loading="lazy"
                className="w-full h-[320px] md:h-[440px] object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary" />
              <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-primary" />
              <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-primary" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary" />
              <div className="absolute bottom-6 right-6 bg-primary text-primary-foreground px-6 py-4">
                <div className="font-display font-bold text-4xl leading-none">25+</div>
                <div className="tech-label mt-1">Years of Engineering</div>
              </div>
              <span className="absolute bottom-6 left-6 tech-label text-foreground/80 bg-background/70 backdrop-blur px-3 py-1.5">
                AIR6 — ON THE FLOOR, COIMBATORE
              </span>
            </div>

            <div className="about-values mt-8 space-y-px bg-border border border-border">
              {advantages.map((value, index) => (
                <div
                  key={index}
                  className="about-value group flex gap-5 p-5 md:p-6 bg-card transition-colors duration-300 hover:bg-background"
                >
                  <div className="w-12 h-12 border border-border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                    <value.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold uppercase tracking-wide text-foreground mb-1">
                      {value.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
