import { Link } from "react-router-dom";
import { Home, ArrowRight, Bot, Cog, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const NotFound = () => {
  const suggestions = [
    { icon: Bot, label: "Robot Lineup", to: "/robots", desc: "4–6 axis arms, cobots & AMRs" },
    { icon: Cog, label: "Solutions", to: "/solutions", desc: "Turnkey automation cells" },
    { icon: Mail, label: "Contact Us", to: "/contact", desc: "Get a quote for your project" },
  ];

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Page Not Found (404) | Texsonics Systems India"
        description="The page you're looking for doesn't exist. Browse our industrial robots and automation solutions instead."
        noindex
      />
      <Navbar />
      <section className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-block text-primary font-bold text-sm tracking-widest uppercase mb-4">
              Error 404
            </div>
            <h1 className="text-7xl md:text-9xl font-bold text-foreground mb-6 leading-none">
              4<span className="text-primary">0</span>4
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              This page wandered outside the robot's work envelope.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto group">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto group">
                  Contact Support
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-6">
              Or try one of these
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {suggestions.map((s, i) => (
                <Link
                  key={i}
                  to={s.to}
                  className="group bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {s.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
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

export default NotFound;
