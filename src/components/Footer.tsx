import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/texsonics-logo.png";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Robots", href: "/robots" },
  { name: "Solutions", href: "/solutions" },
  { name: "Technology", href: "/technology" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "E-Brochure", href: "/downloads" },
];

const products = [
  { name: "TS Series Industrial Robots", href: "/robots" },
  { name: "TSCR Series Collaborative Robots", href: "/robots/tscr-05e" },
  { name: "AMR Mobile Robots", href: "/robots/amr-300" },
  { name: "Robot Controllers & Software", href: "/technology" },
  { name: "Automation Solutions", href: "/solutions" },
];

const socials = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/texsonics-systems-india-pvt-ltd/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/texsonicssystemsindiapvtltd/", label: "Instagram" },
  { icon: Youtube, href: "https://www.youtube.com/@TexsonicsSystemsIndiaPvtLtd", label: "YouTube" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* CTA marquee band */}
      <Link
        to="/contact"
        className="group block border-b border-border overflow-hidden marquee-paused bg-gradient-cta text-primary-foreground"
        aria-label="Start your project — contact us"
      >
        <div className="animate-marquee flex w-max items-center py-5 md:py-7">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span className="font-display font-bold uppercase tracking-tight text-2xl md:text-4xl px-8">
                Start Your Project
              </span>
              <ArrowUpRight className="w-6 h-6 md:w-9 md:h-9 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          ))}
        </div>
      </Link>

      {/* Main footer */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Texsonics" className="h-8" />
              <span className="font-display font-bold uppercase tracking-widest text-foreground">
                Texsonics
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Industrial robot arms, collaborative robots, and autonomous mobile
              robots — designed and manufactured in India since 2004.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="tech-label text-primary mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="tech-label text-primary mb-6">Products</h4>
            <ul className="space-y-3">
              {products.map((product) => (
                <li key={product.name}>
                  <Link
                    to={product.href}
                    className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-4" />
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="tech-label text-primary mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">
                  1/6 - 1, Keerakaran Thottam,
                  <br />
                  Keeranatham,
                  <br />
                  Coimbatore - 641035
                  <br />
                  Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+919442624304" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 94426 24304
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:dharmar@texsonics.net" className="text-muted-foreground hover:text-primary transition-colors">
                  dharmar@texsonics.net
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative select-none pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="text-outline font-display font-bold uppercase leading-none text-center whitespace-nowrap text-[18vw] tracking-tight -mb-[4vw]">
          Texsonics
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="tech-label text-muted-foreground text-center md:text-left">
              © {currentYear} Texsonics Systems India Private Limited
            </p>
            <p className="tech-label text-muted-foreground">
              Made by{" "}
              <a
                href="https://yilxtrie.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Yil Xtrie
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
