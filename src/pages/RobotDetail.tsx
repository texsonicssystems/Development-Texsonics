import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Bot, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { robots } from "@/data/robots";

const RobotDetail = () => {
  const { id } = useParams<{ id: string }>();
  const robot = robots.find((r) => r.id === id);

  if (!robot) {
    return (
      <main className="min-h-screen bg-background">
        <SEO
          title="Robot Not Found | Texsonics Robotics"
          description="The robot model you're looking for doesn't exist. Browse the full Texsonics robot lineup."
          noindex
        />
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display font-bold uppercase text-4xl text-foreground mb-4">
              Model Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The robot you're looking for doesn't exist in the current lineup.
            </p>
            <Link
              to="/robots"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4"
            >
              View All Robots
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const others = robots.filter((r) => r.id !== robot.id).slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: robot.name,
      description: robot.longDescription,
      category: "Industrial Robot",
      brand: { "@type": "Brand", name: "Texsonics" },
      manufacturer: {
        "@type": "Organization",
        name: "Texsonics Systems India Private Limited",
        url: "https://www.texsonics.net",
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "INR",
        url: `https://www.texsonics.net/robots/${robot.id}`,
        seller: { "@type": "Organization", name: "Texsonics Systems India" },
      },
      additionalProperty: [...robot.specs, ...robot.workingRange].map((s) => ({
        "@type": "PropertyValue",
        name: s.label,
        value: s.value,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
        { "@type": "ListItem", position: 2, name: "Robots", item: "https://www.texsonics.net/robots" },
        { "@type": "ListItem", position: 3, name: robot.model, item: `https://www.texsonics.net/robots/${robot.id}` },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={`${robot.model} — ${robot.axes} ${robot.payload} Industrial Robot | Texsonics India`}
        description={`${robot.description} ${robot.payload} payload, ${robot.reach} reach, ${robot.repeatability} repeatability. Made in India with in-house controller and local support.`}
        canonical={`/robots/${robot.id}`}
        ogType="product"
        keywords={`${robot.model}, ${robot.axes} robot, ${robot.series}, industrial robot India, ${robot.applications.join(", ")}`}
        jsonLd={jsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Robots", href: "/robots" }, { label: robot.model }]} />

          <Link
            to="/robots"
            className="inline-flex items-center gap-2 tech-label text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to lineup
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image */}
            <div className="relative border border-border bg-[#eef3f4] h-[380px] lg:h-[520px] flex items-center justify-center overflow-hidden">
              {robot.image ? (
                <img
                  src={robot.image}
                  alt={`${robot.name} — manufactured by Texsonics Systems India`}
                  loading="eager"
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <Bot className="w-20 h-20 text-primary/50" />
                  <span className="tech-label text-muted-foreground">Product render coming soon</span>
                </div>
              )}
              <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary" />
              <span className="absolute top-3 right-3 w-5 h-5 border-t border-r border-primary" />
              <span className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-primary" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary" />
              <span className="absolute top-6 left-6 tech-label bg-primary text-primary-foreground px-3 py-1.5">
                {robot.series}
              </span>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">{robot.tagline}</span>
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl text-foreground mb-6">
                {robot.model}
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                {robot.longDescription}
              </p>

              {/* Hero specs */}
              <div className="grid grid-cols-3 border border-border mb-8 bg-border gap-px">
                {[
                  { label: "Axes", value: robot.axes },
                  { label: "Payload", value: robot.payload },
                  { label: "Reach", value: robot.reach },
                ].map((s) => (
                  <div key={s.label} className="bg-card p-4 md:p-5">
                    <div className="tech-label text-muted-foreground mb-1.5">{s.label}</div>
                    <div className="font-display font-bold text-lg md:text-2xl text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Applications */}
              <div className="mb-8">
                <h2 className="tech-label text-primary mb-4">Typical Applications</h2>
                <div className="flex flex-wrap gap-2">
                  {robot.applications.map((app) => (
                    <span key={app} className="tech-label border border-border text-foreground px-3 py-2">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="group relative flex-1 inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                    Request A Quote
                  </span>
                  <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background" />
                </Link>
                {robot.catalogue ? (
                  <a
                    href={robot.catalogue}
                    download={`Texsonics-${robot.model}.pdf`}
                    className="group flex-1 inline-flex items-center justify-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
                  >
                    Download Catalogue
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    to="/downloads"
                    className="group flex-1 inline-flex items-center justify-center gap-3 border border-border text-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 hover:border-primary hover:text-primary transition-colors duration-300"
                  >
                    Download Catalogue
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Full spec table */}
          <div className="mt-16 lg:mt-24 grid lg:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Specifications</span>
              </div>
              <h2 className="font-display font-bold uppercase tracking-tight text-3xl text-foreground mb-4">
                Technical Data
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Figures are indicative. Request the {robot.model} datasheet for
                guaranteed values, dimensional drawings, and load diagrams.
              </p>
            </div>
            <div className="lg:col-span-2 border-t border-border">
              {robot.specs.map((spec, i) => (
                <div
                  key={i}
                  className="group grid grid-cols-2 gap-4 py-4 border-b border-border transition-colors duration-300 hover:bg-card px-2"
                >
                  <span className="tech-label text-muted-foreground self-center">{spec.label}</span>
                  <span className="text-foreground font-medium text-sm md:text-base">{spec.value}</span>
                </div>
              ))}

              {/* Working range */}
              <div className="flex items-center gap-3 pt-8 pb-2 px-2">
                <span className="w-6 h-px bg-primary" />
                <h3 className="tech-label text-primary">Working Range</h3>
              </div>
              {robot.workingRange.map((range, i) => (
                <div
                  key={i}
                  className="group grid grid-cols-2 gap-4 py-4 border-b border-border transition-colors duration-300 hover:bg-card px-2"
                >
                  <span className="tech-label text-muted-foreground self-center">{range.label}</span>
                  <span className="text-foreground font-medium text-sm md:text-base">{range.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div className="mt-16 border border-border bg-card p-8 md:p-10 relative">
            <span className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-primary" />
            <span className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-primary" />
            <h2 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground mb-6">
              Every {robot.series} delivery includes
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {[
                "Installation & commissioning",
                "Application programming",
                "Robot teaching & optimization",
                "Safety fencing (where required)",
                "Operator training",
                "Annual service & spare parts support",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Plus className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other robots */}
          <div className="mt-16">
            <h2 className="tech-label text-primary mb-6">More From The Lineup</h2>
            <div className="grid sm:grid-cols-3 gap-px bg-border border border-border">
              {others.map((other) => (
                <Link
                  key={other.id}
                  to={`/robots/${other.id}`}
                  className="group bg-background p-6 transition-colors duration-300 hover:bg-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold uppercase tracking-tight text-lg text-foreground group-hover:text-primary transition-colors">
                      {other.model}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="tech-label text-muted-foreground">
                    {other.axes} · {other.payload} · {other.reach}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RobotDetail;
