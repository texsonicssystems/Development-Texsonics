import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LayoutGrid, X, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/texsonics-logo.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Robots", href: "/robots" },
  { name: "Solutions", href: "/solutions" },
  { name: "Technology", href: "/technology" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Staggered link reveal when the overlay opens
  useEffect(() => {
    if (!isMobileMenuOpen || !overlayRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(".mobile-link", {
        yPercent: 110,
        duration: 0.7,
        stagger: 0.06,
        ease: "power4.out",
        delay: 0.1,
      });
      gsap.from(".mobile-meta", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        delay: 0.45,
        ease: "power2.out",
      });
    }, overlayRef);
    return () => ctx.revert();
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-background/85 backdrop-blur-xl border-border"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 md:gap-3 group">
              <img
                src={logo}
                alt="Texsonics Systems India"
                className="brand-logo-adaptive h-7 md:h-8 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display font-bold uppercase tracking-widest text-foreground text-sm md:text-base">
                Texsonics
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`group relative tech-label py-2 transition-colors duration-300 ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-px bg-primary transition-all duration-300 ${
                        isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                ))}
              </div>
              <Link
                to="/downloads"
                className="group relative inline-flex items-center gap-2 border border-primary text-primary tech-label px-5 py-2.5 overflow-hidden transition-colors duration-300 hover:text-primary-foreground"
              >
                <span className="absolute inset-0 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                <span className="relative z-10">E-Brochure</span>
                <ArrowUpRight className="relative z-10 w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button — 4-square grid with rotate/scale animation */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-foreground -mr-1 border border-transparent hover:border-border transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <LayoutGrid
                className={`absolute w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  isMobileMenuOpen
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100 text-primary"
                }`}
              />
              <X
                className={`absolute w-6 h-6 transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  isMobileMenuOpen
                    ? "rotate-0 scale-100 opacity-100 text-primary"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-40 lg:hidden bg-background transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 blueprint-grid opacity-40" />
        <div className="relative h-full flex flex-col justify-between px-6 pt-28 pb-10">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <div key={link.name} className="overflow-hidden">
                <Link
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-link flex items-baseline gap-4 py-2 font-display font-bold uppercase text-4xl tracking-tight ${
                    isActive(link.href) ? "text-primary" : "text-foreground"
                  }`}
                >
                  <span className="tech-label text-muted-foreground">0{i + 1}</span>
                  {link.name}
                </Link>
              </div>
            ))}
            <div className="overflow-hidden">
              <Link
                to="/downloads"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-link flex items-baseline gap-4 py-2 font-display font-bold uppercase text-4xl tracking-tight text-primary"
              >
                <span className="tech-label text-muted-foreground">0{navLinks.length + 1}</span>
                E-Brochure
              </Link>
            </div>
          </nav>

          <div className="mobile-meta border-t border-border pt-6 space-y-1">
            <p className="tech-label text-muted-foreground">Coimbatore, Tamil Nadu — IN</p>
            <a href="tel:+919442624304" className="block text-foreground font-display">
              +91 94426 24304
            </a>
            <a href="mailto:dharmar@texsonics.net" className="block text-primary font-display">
              dharmar@texsonics.net
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
