import { Layers, Building2, Zap, Shield, Paintbrush, Boxes, ArrowRight, CheckCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";

import sheetMetalImg from "@/assets/services/sheet-metal.jpg";
import weldingImg from "@/assets/services/welding.jpg";
import surfaceTreatmentImg from "@/assets/services/surface-treatment.jpg";
import enclosuresImg from "@/assets/services/enclosures.jpg";
import powderCoatingImg from "@/assets/services/powder-coating.jpg";
import architecturalImg from "@/assets/services/architectural.jpg";

const services = [
  {
    icon: Layers,
    title: "Sheet Metal Fabrication",
    image: sheetMetalImg,
    description: "Precision cutting, bending, and forming of sheet metal components for diverse industrial applications.",
    highlights: [
      "Laser cutting up to 20 mm thickness",
      "CNC press-brake bending up to 4 m length",
      "Custom forming and shaping",
      "Prototype to production runs",
    ],
  },
  {
    icon: Boxes,
    title: "Enclosure Manufacturing",
    image: enclosuresImg,
    description: "Custom electrical and electronic enclosures, cabinets, and housing solutions.",
    highlights: [
      "Electrical control panels",
      "Outdoor enclosures (IP65+)",
      "Server & telecom cabinets",
      "EMI/RFI shielding options",
    ],
  },
  {
    icon: Zap,
    title: "Welding & Assembly",
    image: weldingImg,
    description: "Expert welding services including TIG, MIG, and spot welding with complete assembly solutions.",
    highlights: [
      "TIG welding for precision work",
      "MIG welding for production",
      "Spot & projection welding",
      "Full assembly services",
    ],
  },
  {
    icon: Paintbrush,
    title: "Powder Coating",
    image: powderCoatingImg,
    description: "High-quality powder coating finishes in all RAL colors for durable and attractive results.",
    highlights: [
      "All RAL colors available",
      "Textured finishes",
      "High-durability coatings",
      "Corrosion resistance",
    ],
  },
  {
    icon: Shield,
    title: "Surface Treatment",
    image: surfaceTreatmentImg,
    description: "Complete surface preparation and treatment solutions for enhanced durability and protection.",
    highlights: [
      "Deburring and edge finishing",
      "Cleaning and degreasing",
      "Phosphating treatment",
      "Pre-treatment for coating",
    ],
  },
  {
    icon: Building2,
    title: "Architectural Fabrication",
    image: architecturalImg,
    description: "Custom architectural metal work for modern buildings, facades, and structural applications.",
    highlights: [
      "Building facades and cladding",
      "Structural steel components",
      "Interior metal work",
      "Custom architectural elements",
    ],
  },
];

const capabilities = [
  "Laser Cutting",
  "CNC Bending",
  "TIG / MIG Welding",
  "Spot Welding",
  "Powder Coating (RAL)",
  "Passivation",
  "CNC Machining",
  "Assembly",
];

const industries = [
  "Machine Building",
  "Automotive",
  "Electrical Panels",
  "Telecom & Server",
  "Foundries",
  "OEM Enclosures",
  "Architectural",
  "Automation Cells",
];

const sheetMetalJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Sheet Metal Fabrication",
    provider: { "@id": "https://www.texsonics.net/#organization" },
    areaServed: { "@type": "Country", name: "India" },
    description:
      "Precision sheet-metal fabrication in Coimbatore since 1998 — laser cutting, CNC bending, welding, powder coating, and enclosure manufacturing.",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
      { "@type": "ListItem", position: 2, name: "Sheet Metal", item: "https://www.texsonics.net/sheet-metal" },
    ],
  },
];

const SheetMetal = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Sheet Metal Fabrication in Coimbatore | Laser Cutting, Welding, Powder Coating | Texsonics"
        description="Texsonics has been fabricating precision sheet metal in Coimbatore since 1998 — laser cutting up to 20 mm, CNC press-brake bending, TIG/MIG welding, RAL powder coating, and custom enclosures."
        canonical="/sheet-metal"
        keywords="sheet metal fabrication Coimbatore, laser cutting India, TIG MIG welding, powder coating RAL, CNC press brake, enclosure manufacturing Tamil Nadu, Texsonics sheet metal"
        jsonLd={sheetMetalJsonLd}
      />
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Sheet Metal" }]} />

          {/* Hero */}
          <div className="grid md:grid-cols-2 gap-8 items-end mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Sheet Metal Fabrication</span>
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
                Precision Sheet Metal.
                <br />
                <span className="text-outline-primary">Since 1998.</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
              Before we built robots, we fabricated the enclosures, machine
              covers, and control panels that automation lives inside. Twenty-seven years of laser cutting, press-brake bending,
              welding, and powder coating — under one roof in Coimbatore.
            </p>
          </div>

          {/* Capabilities strip */}
          <div className="border-y border-border py-6 mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="tech-label text-muted-foreground mb-1">Facility</div>
                <div className="font-display font-semibold text-foreground">25,000 sq.ft</div>
              </div>
              <div>
                <div className="tech-label text-muted-foreground mb-1">Since</div>
                <div className="font-display font-semibold text-foreground">1998</div>
              </div>
              <div>
                <div className="tech-label text-muted-foreground mb-1">Laser cut</div>
                <div className="font-display font-semibold text-foreground">Up to 20 mm</div>
              </div>
              <div>
                <div className="tech-label text-muted-foreground mb-1">Bend length</div>
                <div className="font-display font-semibold text-foreground">Up to 4 m</div>
              </div>
            </div>
          </div>

          {/* Services grid */}
          <div className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-4xl text-foreground">
                Services
              </h2>
              <span className="tech-label text-muted-foreground hidden sm:block">
                {String(services.length).padStart(2, "0")} CATEGORIES
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-background overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 w-10 h-10 bg-background/85 backdrop-blur border border-border flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-primary" />
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display font-bold uppercase tracking-tight text-lg text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mt-auto">
                      {service.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities + Industries */}
          <div className="grid md:grid-cols-2 gap-10 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Capabilities</span>
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground mb-6">
                Everything under one roof
              </h3>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((c) => (
                  <span
                    key={c}
                    className="tech-label border border-border text-foreground px-3 py-2"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Industries Served</span>
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground mb-6">
                Where our parts end up
              </h3>
              <div className="flex flex-wrap gap-2">
                {industries.map((i) => (
                  <span
                    key={i}
                    className="tech-label border border-border text-foreground px-3 py-2"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-border pt-14 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display font-bold uppercase tracking-tight text-3xl text-foreground mb-3">
                Need a fabrication quote?
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                Share your drawings or a rough spec — we'll size the job, quote,
                and hand back a delivery plan. Prototypes and production runs
                both welcome.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
              >
                <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                  Request a Quote
                </span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:text-background transition-colors duration-300" />
              </Link>
              <Link
                to="/downloads"
                className="inline-flex items-center justify-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
              >
                Sheetmetal Brochure
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SheetMetal;
