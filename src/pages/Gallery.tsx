import { Video, Image as ImageIcon, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
    { "@type": "ListItem", position: 2, name: "Gallery", item: "https://www.texsonics.net/gallery" },
  ],
};

const ComingSoonPanel = ({ icon: Icon, label }: { icon: typeof Video; label: string }) => (
  <div className="relative overflow-hidden border border-border bg-card">
    <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
    <div className="relative p-8 sm:p-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-xl bg-accent/50 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <span className="tech-label text-primary mb-3">{label}</span>
      <h3 className="font-display font-bold uppercase tracking-tight text-2xl md:text-3xl text-foreground mb-4">
        Coming Soon
      </h3>
      <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
        We're putting together the {label.toLowerCase()} — commissioning footage,
        cell walk-throughs, and finished-parts photography. In the meantime, our
        team can share media directly. Contact the office for an immediate response.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href="tel:+919442624304"
          className="inline-flex items-center gap-2 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-xs px-5 py-3 hover:border-primary hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4" />
          +91 94426 24304
        </a>
        <a
          href="mailto:dharmar@texsonics.net"
          className="inline-flex items-center gap-2 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-xs px-5 py-3 hover:border-primary hover:text-primary transition-colors"
        >
          <Mail className="w-4 h-4" />
          dharmar@texsonics.net
        </a>
      </div>
    </div>
  </div>
);

const Gallery = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Gallery | Texsonics Robots, Cells & Sheet Metal"
        description="Texsonics gallery — videos and images of our industrial robots, automation cells, sheet-metal fabrication and shop floor. Currently being updated."
        canonical="/gallery"
        keywords="Texsonics robots video, industrial automation cell photos, sheet metal shop floor Coimbatore"
        jsonLd={galleryJsonLd}
      />
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Gallery" }]} />

          <div className="grid md:grid-cols-2 gap-6 items-end mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Gallery</span>
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl text-foreground">
                Robots & Cells
                <br />
                <span className="text-outline-primary">In Motion</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
              Videos and images of Texsonics robots, cells, and shop floor —
              currently being produced. Reach out and we'll share what's ready
              directly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <ComingSoonPanel icon={Video} label="Video Gallery" />
            <ComingSoonPanel icon={ImageIcon} label="Image Gallery" />
          </div>

          <div className="border-t border-border pt-10 text-center">
            <p className="tech-label text-muted-foreground mb-4">
              While the gallery is under construction
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
              >
                <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                  Contact Office
                </span>
              </Link>
              <Link
                to="/robots"
                className="inline-flex items-center justify-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
              >
                Browse Robots
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Gallery;
