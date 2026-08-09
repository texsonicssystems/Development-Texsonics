import { useState } from "react";
import { Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    q: "What can your robots actually do?",
    a: "Pick & place, CNC machine tending, loading/unloading, palletizing, welding, spray painting, assembly, packaging, material handling, and vision inspection. Every cell is delivered complete — robot, end effector, safety fencing, programming, and operator training.",
  },
  {
    q: "Why buy a Texsonics robot instead of an imported brand?",
    a: "Higher payload for the price, fully made in India, faster service, and easier customization. Because we build the arm, controller, drives, and software ourselves, custom features and repairs don't wait on an overseas vendor.",
  },
  {
    q: "What do you manufacture in-house?",
    a: "The robot arm, controller, drive electronics, end effectors, motion software, HMI, teach pendant, and vision system — the complete stack, engineered and built in Coimbatore.",
  },
  {
    q: "What happens after I buy a robot?",
    a: "We handle installation, programming, robot teaching, and safety fencing, then support you with maintenance contracts, annual service, operator training, spare parts, and upgrades — all from our own engineering team.",
  },
  {
    q: "Which industries do you supply?",
    a: "Automotive manufacturers, foundries, sheet metal industries, textiles, plastic molding, electronics, pharmaceutical, CNC workshops, and engineering component manufacturers across India, with global support available.",
  },
  {
    q: "Do you make collaborative robots?",
    a: "Yes — our CS series cobots use force-limited harmonic-drive joints and hand-guided teaching, so they can run fence-free machine tending and assembly cells alongside your operators.",
  },
  {
    q: "Do you offer autonomous mobile robots (AMRs)?",
    a: "Yes. Our AMR series handles intralogistics — line-side delivery, warehouse transfer, and WIP movement — using LiDAR natural navigation with fleet management that integrates into your ERP or MES.",
  },
  {
    q: "Can you program robots from CAD files?",
    a: "Yes. Our CAM software generates robot paths directly from your CAD models for welding, painting, and machining applications — cutting teach time from days to hours.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section className="py-24 md:py-36 bg-card">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left — header */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">FAQ</span>
            </div>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl text-foreground mb-6">
              Common
              <br />
              <span className="text-outline-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Quick answers to the questions we hear most from buyers and engineers.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-2 border-t border-border">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center gap-5 py-5 md:py-6 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className={`tech-label transition-colors duration-300 ${isOpen ? "text-primary" : "text-muted-foreground/60"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-display font-semibold text-base md:text-lg transition-colors duration-300 ${
                        isOpen ? "text-primary" : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <Plus
                      className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                        isOpen ? "rotate-45 text-primary" : "text-muted-foreground group-hover:text-primary"
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-400 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pl-[3.25rem] pr-10 text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
