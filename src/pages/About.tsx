import { Award, Users, Target, Building, Calendar, Globe, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import workshopImg from "@/assets/robots/workshop-air6.jpg";

const milestones = [
  { year: "1998", note: "Founded in Coimbatore as a precision sheet-metal fabrication company." },
  { year: "2000s", note: "Two decades of sheet-metal work for OEMs, machine builders and enclosure customers." },
  { year: "2020s", note: "Pivoted focus toward automation — cell design, controllers and integration." },
  { year: "2024", note: "In-house RC series robot controller and TEXCAM motion software completed." },
  { year: "Today", note: "Manufacturing 4–6 axis robots, cobots and AMRs — with our own controller and CAM." },
];

const values = [
  { icon: Award, title: "Engineering First", description: "Every machine we ship is designed, built, and tested by our own engineers — no rebadged imports." },
  { icon: Users, title: "Customer Partnership", description: "We automate your process, not just sell you hardware. Cell scoping to operator training, one team." },
  { icon: Target, title: "Precision Heritage", description: "27+ years of tight-tolerance sheet-metal and precision manufacturing discipline now applied to robot arms and controllers." },
];

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://www.texsonics.net/about",
  mainEntity: { "@id": "https://www.texsonics.net/#organization" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://www.texsonics.net/about" },
    ],
  },
};

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="About Texsonics | Robot Manufacturer in India Since 1998"
        description="Texsonics builds robot arms, cobots, and AMRs in Coimbatore, Tamil Nadu — 27+ years of precision engineering with an in-house controller and software stack."
        canonical="/about"
        keywords="about Texsonics, robot manufacturer India, robotics company Coimbatore, Indian robot arm maker, industrial automation company Tamil Nadu"
        jsonLd={aboutJsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tech-label inline-block text-primary mb-4">About Us</span>
            <h1 className="font-display font-bold uppercase tracking-tight text-4xl md:text-5xl text-foreground mb-6">
              27 Years Of Engineering.
              <br />
              <span className="text-primary">Now Building Robots.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Texsonics Systems India Private Limited designs and manufactures
              industrial robots, collaborative robots, and autonomous mobile
              robots — entirely in India.
            </p>
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative overflow-hidden border border-border">
              <img
                src={workshopImg}
                alt="Texsonics AIR series robot on the shop floor of the 25,000 sq.ft Coimbatore facility"
                width={800}
                height={400}
                loading="lazy"
                className="w-full h-[400px] object-cover"
              />
              <span className="absolute top-3 left-3 w-5 h-5 border-t border-l border-primary" />
              <span className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-primary" />
              <span className="absolute bottom-4 left-4 tech-label text-foreground bg-background/70 backdrop-blur px-3 py-1.5">
                COIMBATORE WORKS
              </span>
            </div>
            <div>
              <h2 className="font-display font-bold uppercase tracking-tight text-3xl text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded in 1998 in Coimbatore, Texsonics spent over two decades
                as a precision sheet-metal fabrication and automation-support
                partner for OEMs and machine builders. That discipline — tight
                tolerances, fast turnarounds, everything under one roof — is
                exactly what building robots demands.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Today our focus is robotics: 4–6 axis industrial robot arms,
                collaborative robots, autonomous mobile robots, and the robot
                controller and CAM software that drive them. We build the arm,
                the drives, the pendant, and the code — then install, train, and
                support it with our own engineers.
              </p>
              <div className="grid grid-cols-2 gap-px bg-border border border-border">
                {[
                  { icon: Calendar, label: "Founded", value: "1998" },
                  { icon: Building, label: "Facility", value: "25,000 sq.ft" },
                  { icon: Users, label: "Team", value: "20+" },
                  { icon: Globe, label: "Clients", value: "150+" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-card">
                    <stat.icon className="w-7 h-7 text-primary shrink-0" />
                    <div>
                      <div className="font-display text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="tech-label text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-20">
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl text-foreground mb-10 text-center">
              The Road To Robotics
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
              {milestones.map((m, i) => (
                <div key={i} className="group bg-background p-6 md:p-8 transition-colors duration-300 hover:bg-card">
                  <div className="font-display font-bold text-3xl text-primary mb-3">{m.year}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border mb-16">
            {values.map((value, i) => (
              <div key={i} className="group text-center p-8 md:p-10 bg-background transition-colors duration-300 hover:bg-card">
                <div className="w-14 h-14 border border-border flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                  <value.icon className="w-6 h-6 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold uppercase tracking-tight text-xl text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Additional services — deliberately quiet */}
          <div className="border border-border bg-card px-6 py-5 mb-16 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <Plus className="w-4 h-4 text-primary shrink-0" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-medium">Additional services:</span>{" "}
              precision sheet metal fabrication, welding, and powder coating remain
              available as sub-contract manufacturing for select customers.{" "}
              <Link to="/contact" className="text-primary hover:underline">Enquire</Link>
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-display font-bold uppercase tracking-tight text-3xl text-foreground mb-4">
              Ready To Automate?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Tell us about your process and we'll propose the right robot cell.
            </p>
            <Link
              to="/contact"
              className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden"
            >
              <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                Contact Us
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

export default About;
