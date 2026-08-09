import { ArrowRight, ArrowUpRight, ScanEye, Forklift, Workflow, Cpu, MonitorCog, Radio, Gauge, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { industries } from "@/data/robots";

const solutions = [
  {
    icon: ScanEye,
    title: "Vision Inspection",
    description:
      "Camera-guided pick & place, defect detection, and dimensional verification — integrated with our own vision system and robot controller.",
  },
  {
    icon: Forklift,
    title: "Material Handling",
    description:
      "Robotic transfer, part feeding, and AMR-based intralogistics that move material between machines, lines, and stores without operators.",
  },
  {
    icon: Workflow,
    title: "Conveyor Automation",
    description:
      "Synchronized conveyor lines with robot pick points, tracking, accumulation, and sortation designed around your takt time.",
  },
  {
    icon: Cpu,
    title: "PLC Programming",
    description:
      "Cell and line control logic on all major PLC platforms, commissioned by the same engineers who program the robots.",
  },
  {
    icon: MonitorCog,
    title: "HMI & SCADA",
    description:
      "Operator interfaces and plant-level SCADA that give supervisors live cell status, alarms, and production counts.",
  },
  {
    icon: Radio,
    title: "IIoT & Data",
    description:
      "Machine connectivity, OEE dashboards, and predictive maintenance signals streamed from robots and PLCs to your systems.",
  },
  {
    icon: Gauge,
    title: "Motion Control",
    description:
      "Servo sizing, multi-axis coordination, and custom kinematics for machines that need more than a standard robot.",
  },
  {
    icon: GitBranch,
    title: "Custom Engineering",
    description:
      "Special-purpose machines, end effectors, and turnkey cells engineered in-house when a catalogue product won't fit.",
  },
];

const lifecycle = [
  { step: "01", title: "Process Study", note: "We visit your line, time the cycle, and define the cell scope." },
  { step: "02", title: "Proposal & Simulation", note: "Robot selection, layout, cycle-time estimate, and a firm budget." },
  { step: "03", title: "Build & Integrate", note: "Cell built and run-off in our Coimbatore works before dispatch." },
  { step: "04", title: "Install & Commission", note: "Installation, safety fencing, programming, and robot teaching on-site." },
  { step: "05", title: "Train & Handover", note: "Operator and maintenance training with documentation." },
  { step: "06", title: "Support & Grow", note: "Annual service, spare parts, upgrades, and remote support." },
];

const solutionsJsonLd = [
  ...solutions.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    provider: {
      "@type": "Organization",
      name: "Texsonics Systems India",
      url: "https://www.texsonics.net",
    },
    areaServed: [{ "@type": "Country", name: "India" }],
  })),
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
      { "@type": "ListItem", position: 2, name: "Solutions", item: "https://www.texsonics.net/solutions" },
    ],
  },
];

const Solutions = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Industrial Automation Solutions | Texsonics Robotics"
        description="Turnkey automation from Texsonics: vision inspection, material handling, conveyors, PLC, HMI/SCADA, IIoT — delivered as complete robot cells with training."
        canonical="/solutions"
        keywords="industrial automation India, turnkey robot cell, vision inspection system, PLC programming Coimbatore, SCADA development, IIoT manufacturing, conveyor automation, machine tending cell"
        jsonLd={solutionsJsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Solutions" }]} />

          {/* Header */}
          <div className="grid md:grid-cols-2 gap-6 items-end mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">Automation Solutions</span>
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
                Complete Cells,
                <br />
                <span className="text-outline-primary">Not Just Robots</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
              A robot alone doesn't automate anything. We deliver the full cell —
              vision, conveyors, PLC, safety, and software — engineered and
              supported by one team.
            </p>
          </div>

          {/* Solutions grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mb-20">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="group relative bg-background p-6 md:p-8 transition-colors duration-300 hover:bg-card"
              >
                <span className="tech-label text-muted-foreground/50 absolute top-4 right-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 border border-border flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                  <solution.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <h2 className="font-display font-bold uppercase tracking-tight text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {solution.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>

          {/* Lifecycle */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">How We Deliver</span>
            </div>
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl md:text-4xl text-foreground mb-10">
              From Process Study To
              <span className="text-primary"> Lifetime Support</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {lifecycle.map((phase) => (
                <div
                  key={phase.step}
                  className="group bg-background p-6 md:p-8 transition-colors duration-300 hover:bg-card"
                >
                  <div className="font-display font-bold text-4xl text-outline-primary mb-4 group-hover:text-primary transition-colors duration-300">
                    {phase.step}
                  </div>
                  <h3 className="font-display font-bold uppercase tracking-tight text-lg text-foreground mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{phase.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="border border-border bg-card p-8 md:p-10 mb-16 relative">
            <span className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-primary" />
            <span className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-primary" />
            <h2 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground mb-6">
              Industries We Automate
            </h2>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <span key={ind} className="tech-label border border-border text-muted-foreground px-3 py-2 hover:border-primary hover:text-foreground transition-colors">
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Have a process in mind? Describe it and we'll propose the cell.
            </p>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                Start A Process Study
              </span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Solutions;
