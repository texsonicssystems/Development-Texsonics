import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale";
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
}

export const useScrollAnimation = <T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) => {
  const ref = useRef<T>(null);
  const {
    animation = "fadeUp",
    duration = 0.8,
    delay = 0,
    start = "top 85%",
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animations: Record<string, gsap.TweenVars> = {
      fadeUp: { opacity: 0, y: 50 },
      fadeIn: { opacity: 0 },
      slideLeft: { opacity: 0, x: -50 },
      slideRight: { opacity: 0, x: 50 },
      scale: { opacity: 0, scale: 0.9 },
    };

    const fromVars = animations[animation] || animations.fadeUp;

    gsap.set(element, fromVars);

    const ctx = gsap.context(() => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [animation, duration, delay, start]);

  return ref;
};

export const useStaggerAnimation = <T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) => {
  const containerRef = useRef<T>(null);
  const {
    animation = "fadeUp",
    duration = 0.6,
    stagger = 0.1,
    start = "top 85%",
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    if (!children.length) return;

    const animations: Record<string, gsap.TweenVars> = {
      fadeUp: { opacity: 0, y: 40 },
      fadeIn: { opacity: 0 },
      slideLeft: { opacity: 0, x: -30 },
      slideRight: { opacity: 0, x: 30 },
      scale: { opacity: 0, scale: 0.9 },
    };

    const fromVars = animations[animation] || animations.fadeUp;

    gsap.set(children, fromVars);

    const ctx = gsap.context(() => {
      gsap.to(children, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [animation, duration, stagger, start]);

  return containerRef;
};

export default useScrollAnimation;
