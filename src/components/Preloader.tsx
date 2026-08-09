import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import logo from "@/assets/texsonics-logo.png";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onComplete();
      return;
    }

    // Safety net — always finish within 4s
    const safety = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 4000);

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      window.clearTimeout(safety);
      onComplete();
    };

    const tl = gsap.timeline({ onComplete: finish });

    gsap.from(".pre-item", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });

    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 1.9,
      ease: "power2.inOut",
      onUpdate: function () {
        setProgress(Math.round(this.progress() * 100));
      },
    })
      .to(innerRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.35,
        ease: "power2.in",
      })
      .to(preloaderRef.current, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
      });

    return () => {
      window.clearTimeout(safety);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] bg-background noise"
    >
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div ref={innerRef} className="relative h-full flex flex-col justify-between p-6 md:p-10">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="pre-item flex items-center gap-3">
            <img src={logo} alt="Texsonics" className="h-7 md:h-8" />
            <span className="font-display font-bold uppercase tracking-widest text-foreground text-sm">
              Texsonics
            </span>
          </div>
          <span className="pre-item tech-label text-muted-foreground hidden sm:block">
            EST. 2004 — COIMBATORE, IN
          </span>
        </div>

        {/* Center */}
        <div className="pre-item text-center">
          <p className="tech-label text-primary mb-3">Industrial Robotics & Automation</p>
          <p className="tech-label text-muted-foreground">Initializing robot systems…</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-8">
          <div className="pre-item flex-1 max-w-md">
            <div className="h-px bg-border w-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-primary origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span className="tech-label text-muted-foreground mt-3 block">Loading assets</span>
          </div>
          <span className="pre-item font-display font-bold text-6xl md:text-8xl text-foreground tabular-nums leading-none">
            {progress}
            <span className="text-primary text-3xl md:text-5xl">%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
