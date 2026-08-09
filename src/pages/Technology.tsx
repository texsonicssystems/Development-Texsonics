import { ArrowRight, Cpu, Route, TabletSmartphone, ScanEye, CircuitBoard, Hand, Code2, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import air4Img from "@/assets/robots/air4-560.jpg";
import workshopImg from "@/assets/robots/workshop-air6.jpg";

const stack = [
  {
    icon: Cpu,
    title: "RC Series Robot Controller",
    description:
      "Our own multi-axis controller — real-time motion kernel, safety I/O, fieldbus connectivity, and open interfaces. No licence lock-in, no black boxes.",
  },
  {
    icon: Route,
    title: "CAM Path Software",
    description:
      "Generate robot programs directly from CAD models for welding, painting, and machining. Teach time drops from days to hours.",
  },
  {
    icon: TabletSmartphone,
    title: "Teach Pendant & HMI",
    description:
      "A pendant designed for operators, not programmers — jog, teach, and edit cycles with a guided touchscreen interface in plain language.",
  },
  {
    icon: ScanEye,
    title: "Vision System",
    description:
      "2D/3D camera guidance integrated at the controller level for locating parts, inspecting quality, and correcting robot paths in real time.",
  },
  {
    icon: CircuitBoard,
    title: "Drive Electronics",
    description:
      "Servo drives engineered and tuned in-house, matched to each joint — the reason our arms deliver more payload per rupee.",
  },
  {
    icon: Hand,
    title: "End Effectors",
    description:
      "Grippers, magnetic and vacuum tooling, and special-purpose end-of-arm tooling designed for your exact part.",
  },
  {
    icon: Code2,
    title: "Motion Software",
    description:
      "Trajectory planning, kinematics, and application packages (palletizing, welding, tending) written by our own software team.",
  },
  {
    icon: Boxes,
    title: "Fleet Manager (AMR)",
    description:
      "Dispatch, traffic control, and charging management for AMR fleets, with ERP/MES integration for automatic job creation.",
  },
];

const technologyJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://www.texsonics.net/technology",
    name: "Robot Controller, CAM Software & In-House Robotics Technology | Texsonics",
    description:
      "The complete Texsonics robotics stack: RC series controller, CAM path software, teach pendant, vision system, drive electronics, and end effectors — all engineered in-house in India.",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
      { "@type": "ListItem", position: 2, name: "Technology", item: "https://www.texsonics.net/technology" },
    ],
  },
];

const Technology = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Robot Controller & CAM Software | Texsonics Technology"
        description="Texsonics engineers the robotics stack in India: controller, CAM software, teach pendant, vision system, drives, and end effectors — open and locally supported."
        canonical="/technology"
        keywords="robot controller India, CAM software robotics, robot programming from CAD, teach pendant, robot vision system, servo drive, indigenous robot controller, made in India robotics"
        jsonLd={technologyJsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <Breadcrumbs items={[{ label: "Technology" }]} />

          {/* Header */}
          <div className="grid md:grid-cols-2 gap-6 items-end mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-primary" />
                <span className="tech-label text-primary">The Stack</span>
              </div>
              <h1 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
                We Build The
                <br />
                <span className="text-outline-primary">Whole Machine</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
              Controller, drives, software, pendant, vision, and tooling —
              designed by one engineering team in Coimbatore. That's why our
              robots cost less, ship faster, and never wait on a foreign vendor.
            </p>
          </div>

          {/* Feature image band */}
          <div className="grid md:grid-cols-2 gap-px bg-border border border-border mb-16">
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={workshopImg}
                alt="Texsonics 6-axis robot commissioned on the Coimbatore shop floor"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              <span className="absolute bottom-4 left-4 tech-label text-foreground bg-background/70 backdrop-blur px-3 py-1.5">
                AIR6 CELL — FACTORY RUN-OFF
              </span>
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={air4Img}
                alt="Texsonics AIR4-560 compact robot arm during assembly"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              <span className="absolute bottom-4 left-4 tech-label text-foreground bg-background/70 backdrop-blur px-3 py-1.5">
                AIR4-560 — ASSEMBLY BAY
              </span>
            </div>
          </div>

          {/* Stack grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mb-20">
            {stack.map((item, index) => (
              <div
                key={index}
                className="group relative bg-background p-6 md:p-8 transition-colors duration-300 hover:bg-card"
              >
                <span className="tech-label text-muted-foreground/50 absolute top-4 right-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 border border-border flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                  <item.icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <h2 className="font-display font-bold uppercase tracking-tight text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Why it matters */}
          <div className="grid lg:grid-cols-3 gap-px bg-border border border-border mb-16">
            {[
              {
                stat: "Weeks",
                title: "Not months",
                note: "Custom features and integrations ship on our schedule — because the source code and drawings are ours.",
              },
              {
                stat: "1 Team",
                title: "One throat to choke",
                note: "Mechanics, electronics, and software from the same engineers. No finger-pointing between vendors.",
              },
              {
                stat: "₹ Less",
                title: "More payload per rupee",
                note: "In-house manufacturing removes import duties, distributor margins, and licence fees from your invoice.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card p-8 md:p-10">
                <div className="font-display font-bold text-4xl md:text-5xl text-primary mb-4">{item.stat}</div>
                <h3 className="font-display font-bold uppercase tracking-tight text-lg text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Want a deeper technical discussion? Our controls engineers speak fluent servo.
            </p>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                Talk Technology
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

export default Technology;
