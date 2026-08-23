import { Download, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { robots } from "@/data/robots";
import { useDownloadGate } from "@/components/DownloadGate";

interface BrochureCard {
  key: string;
  title: string;
  description: string;
  url: string;
  filename: string;
}

const brochures: BrochureCard[] = [
  {
    key: "robotics",
    title: "Texsonics Company Brochure – Robotics",
    description:
      "Full company portfolio: robot lineup, controller stack, applications, and service — 6 pages.",
    url: "/brochures/Texsonics_Company_Brochure_Robotics.pdf",
    filename: "Texsonics_Company_Brochure_Robotics.pdf",
  },
  {
    key: "sheetmetal",
    title: "Texsonics Company Brochure – Sheetmetal",
    description:
      "Sheet-metal fabrication capabilities: enclosures, machine covers, control panels and OEM parts.",
    url: "/brochures/Texsonics_Brochure.pdf",
    filename: "Texsonics_Company_Brochure_Sheetmetal.pdf",
  },
];

const downloadsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://www.texsonics.net/downloads",
    name: "Texsonics Company Brochure",
    isPartOf: { "@id": "https://www.texsonics.net/#website" },
    about: { "@id": "https://www.texsonics.net/#organization" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
      { "@type": "ListItem", position: 2, name: "Downloads", item: "https://www.texsonics.net/downloads" },
    ],
  },
];

const Downloads = () => {
  const requestDownload = useDownloadGate();

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Download Texsonics Brochures & Catalogues | Robots, Sheet Metal"
        description="Download Texsonics company brochures — robotics portfolio, sheet-metal capabilities, and individual robot product catalogues."
        canonical="/downloads"
        keywords="Texsonics brochure PDF, robot catalog India, company profile Coimbatore, sheet metal brochure, robotics capabilities download"
        jsonLd={downloadsJsonLd}
      />
      <Navbar />

      {/* Company brochures */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tech-label inline-block text-primary mb-4">Downloads</span>
            <h1 className="font-display font-bold uppercase tracking-tight text-4xl md:text-5xl text-foreground mb-6">
              Company Brochures
            </h1>
            <p className="text-muted-foreground text-lg">
              Two portfolios — our robotics-focused overview and the sheet-metal
              fabrication capabilities that Texsonics has offered since 1998.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {brochures.map((b) => (
              <div
                key={b.key}
                className="bg-card rounded-xl p-8 border border-border/50 hover:shadow-lg transition-shadow group text-center flex flex-col"
              >
                <div className="w-20 h-20 rounded-xl bg-accent/50 flex items-center justify-center mb-6 mx-auto group-hover:bg-accent transition-colors">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1">
                  {b.description}
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">PDF Format</span>
                </div>
                <Button
                  size="lg"
                  className="w-full group/btn"
                  onClick={() =>
                    requestDownload({ url: b.url, filename: b.filename, label: b.title })
                  }
                >
                  <Download className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Robot Catalogues */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="tech-label inline-block text-primary mb-4">Product Catalogues</span>
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-4xl text-foreground mb-4">
              Robot Catalogues
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Individual product PDF for every robot in the Texsonics lineup — full specifications, working range, and application highlights.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {robots.filter((r) => r.catalogue).map((robot) => (
              <button
                key={robot.id}
                type="button"
                onClick={() =>
                  requestDownload({
                    url: robot.catalogue!,
                    filename: `Texsonics-${robot.model}.pdf`,
                    label: `${robot.model} catalogue`,
                  })
                }
                className="group flex items-center gap-4 bg-card border border-border/60 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="w-14 h-14 shrink-0 rounded-md bg-accent/60 flex items-center justify-center group-hover:bg-accent transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold uppercase text-sm text-foreground group-hover:text-primary transition-colors">
                    {robot.model}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {robot.series} · {robot.payload} · {robot.reach}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </button>
            ))}
          </div>

          <p className="tech-label text-muted-foreground/60 mt-8 text-center">
            Specifications are indicative — request a datasheet for guaranteed values.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Downloads;
