import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useContactForm } from "@/hooks/useContactForm";
import { GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_PLACE_URL } from "@/lib/location";

const Contact = () => {
  const { formData, updateField, handleSubmit, isSubmitting, isSuccess } = useContactForm();

  const contactJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: "https://www.texsonics.net/contact",
      mainEntity: { "@id": "https://www.texsonics.net/#localbusiness" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.texsonics.net/" },
        { "@type": "ListItem", position: 2, name: "Contact", item: "https://www.texsonics.net/contact" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Contact Texsonics Coimbatore | Get an Industrial Robot Quote"
        description="Contact Texsonics for industrial robot and automation quotes. Call +91 94426 24304 or email dharmar@texsonics.net. Coimbatore, Tamil Nadu — Mon–Sat 9 AM–6 PM."
        canonical="/contact"
        keywords="contact Texsonics, industrial robot quote India, robot cell enquiry Coimbatore, automation quote Tamil Nadu, Texsonics phone email"
        jsonLd={contactJsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tech-label inline-block text-primary mb-4">Contact Us</span>
            <h1 className="font-display font-bold uppercase tracking-tight text-4xl md:text-5xl text-foreground mb-6">Get In Touch</h1>
            <p className="text-muted-foreground text-lg">Ready to start your next project? Contact us for a free consultation and quote.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6 mb-8">
                {[
                  { icon: Phone, title: "Phone", details: ["+91 94426 24304"] },
                  { icon: Mail, title: "Email", details: ["dharmar@texsonics.net"] },
                  { icon: MapPin, title: "Address", details: ["1/6 - 1, KEERAKARAN THOTTAM,", "KEERANATHAM, COIMBATORE - 641035", "TAMIL NADU, INDIA"] },
                  { icon: Clock, title: "Working Hours", details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"] }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border/50">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><item.icon className="w-5 h-5 text-primary" /></div>
                    <div><h4 className="font-semibold text-foreground mb-1">{item.title}</h4>{item.details.map((d, j) => <p key={j} className="text-sm text-muted-foreground">{d}</p>)}</div>
                  </div>
                ))}
              </div>
              <div className="relative rounded-xl overflow-hidden border border-border/50 h-[300px]">
                <iframe
                  src={GOOGLE_MAPS_EMBED_SRC}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Texsonics Location"
                  className="pointer-events-none"
                />
                <a
                  href={GOOGLE_MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Texsonics Systems India location in Google Maps"
                  className="absolute inset-0 z-10 flex items-end justify-end p-3 hover:bg-black/10 transition-colors"
                >
                  <span className="inline-flex items-center gap-2 bg-background/90 backdrop-blur border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground">
                    <Navigation className="w-4 h-4 text-primary" />
                    Get Directions
                  </span>
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg h-fit">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h3>
              
              {isSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
                      <Input required value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="John Doe" className="bg-background" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <Input required type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@company.com" className="bg-background" disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <Input value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 94426 24304" className="bg-background" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                      <Input value={formData.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Your Company" className="bg-background" disabled={isSubmitting} />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea required value={formData.message} onChange={(e) => updateField("message", e.target.value)} placeholder="Tell us about your project..." className="bg-background min-h-[150px]" disabled={isSubmitting} />
                  </div>
                  <Button type="submit" size="lg" className="w-full group" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Contact;
