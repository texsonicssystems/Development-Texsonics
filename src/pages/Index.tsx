import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const homepageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.texsonics.net/#webpage",
    url: "https://www.texsonics.net/",
    name: "Industrial Robots Made in India | Texsonics Systems India",
    description:
      "Texsonics manufactures 4–6 axis industrial robot arms, collaborative robots, and autonomous mobile robots in Coimbatore, India — with in-house controller, drives, and CAM software.",
    isPartOf: { "@id": "https://www.texsonics.net/#website" },
    about: { "@id": "https://www.texsonics.net/#organization" },
    inLanguage: "en-IN",
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Industrial Robotics & Automation",
    provider: { "@id": "https://www.texsonics.net/#organization" },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "City", name: "Coimbatore" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Robotics & Automation",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "TS Series 4–6 Axis Industrial Robots" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "TSCR Series Collaborative Robots" } },
        { "@type": "Offer", itemOffered: { "@type": "Product", name: "AMR Series Autonomous Mobile Robots" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Robot Control Systems & CAM Software" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Turnkey Automation Cells" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vision Inspection Systems" } },
      ],
    },
  },
];

const Index = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Industrial Robots Made in India | 4–6 Axis Arms | Texsonics"
        description="Texsonics manufactures 4–6 axis industrial robots, cobots, and AMRs in Coimbatore, India — with our own controller and CAM software. 27+ years, local support."
        canonical="/"
        keywords="industrial robot manufacturer India, robot arm made in India, 6 axis robot, collaborative robot India, AMR autonomous mobile robot, machine tending robot, welding robot, palletizing robot, robot controller India, factory automation Coimbatore"
        jsonLd={homepageJsonLd}
      />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
