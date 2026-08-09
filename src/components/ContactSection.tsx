import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle, ArrowUpRight, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { useContactForm } from "@/hooks/useContactForm";
import { GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_PLACE_URL } from "@/lib/location";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 94426 24304"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["dharmar@texsonics.net"],
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["1/6 - 1, Keerakaran Thottam,", "Keeranatham, Coimbatore - 641035"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
  },
];

const inputClass =
  "bg-background border-border rounded-none h-12 px-4 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-colors";

const ContactSection = () => {
  const { formData, updateField, handleSubmit, isSubmitting, isSuccess } = useContactForm();

  const headerRef = useScrollAnimation<HTMLDivElement>({ animation: "fadeUp" });
  const infoRef = useStaggerAnimation<HTMLDivElement>({ animation: "fadeUp", stagger: 0.08 });
  const formRef = useScrollAnimation<HTMLDivElement>({ animation: "fadeUp", delay: 0.15 });

  return (
    <section id="contact" className="py-24 md:py-36 bg-background relative overflow-hidden noise">
      <div className="absolute inset-0 blueprint-grid opacity-40" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="grid md:grid-cols-2 gap-6 items-end mb-14 md:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="tech-label text-primary">Contact Us</span>
            </div>
            <h2 className="font-display font-bold uppercase tracking-tight leading-[0.95] text-4xl md:text-5xl lg:text-6xl text-foreground">
              Automate
              <br />
              <span className="text-gradient-brand">Your Line</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg max-w-md md:justify-self-end">
            Tell us about the process you want to automate — part, cycle time,
            and volume — and our engineers will propose a robot cell with a
            budget within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Contact info */}
          <div className="lg:col-span-2">
            <div ref={infoRef} className="border border-border bg-border grid gap-px mb-8">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="group flex gap-5 p-5 bg-card transition-colors duration-300 hover:bg-background"
                >
                  <div className="w-11 h-11 border border-border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-primary group-hover:bg-primary">
                    <item.icon className="w-4 h-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="tech-label text-muted-foreground mb-1.5">{item.title}</h4>
                    {item.details.map((detail, i) => (
                      <p key={i} className="text-sm text-foreground">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map — click anywhere to open directions in Google Maps */}
            <div className="relative overflow-hidden border border-border h-48 mb-6 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe
                src={GOOGLE_MAPS_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Texsonics Location"
                className="pointer-events-none"
              />
              <a
                href={GOOGLE_MAPS_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Texsonics Systems India location in Google Maps"
                className="absolute inset-0 z-10 flex items-end justify-end p-3 hover:bg-background/10 transition-colors"
              >
                <span className="inline-flex items-center gap-2 bg-background/90 backdrop-blur border border-border px-3 py-2 tech-label text-foreground">
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions
                </span>
              </a>
            </div>

            <Link
              to="/contact"
              className="group flex items-center justify-between border border-border px-5 py-4 hover:border-primary transition-colors duration-300"
            >
              <span className="tech-label text-foreground group-hover:text-primary transition-colors">
                View Full Contact Page
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>

          {/* Form */}
          <div ref={formRef} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="relative bg-card border border-border p-6 md:p-10"
            >
              {/* Corner brackets */}
              <span className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-primary" />
              <span className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-primary" />

              <div className="flex items-baseline justify-between mb-8">
                <h3 className="font-display font-bold uppercase tracking-tight text-2xl text-foreground">
                  Request a Quote
                </h3>
                <span className="tech-label text-muted-foreground/60 hidden sm:block">FORM-01</span>
              </div>

              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-14 h-14 text-primary mx-auto mb-5" />
                  <h4 className="font-display font-bold uppercase text-xl text-foreground mb-2">
                    Message Sent
                  </h4>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="tech-label text-muted-foreground block mb-2.5">
                        Your Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="John Doe"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="tech-label text-muted-foreground block mb-2.5">
                        Email Address *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@company.com"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="tech-label text-muted-foreground block mb-2.5">
                        Phone Number
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+91 94426 24304"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="tech-label text-muted-foreground block mb-2.5">
                        Company Name
                      </label>
                      <Input
                        value={formData.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="Your Company"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="tech-label text-muted-foreground block mb-2.5">
                      Automation Requirement *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="What process do you want to automate? Part weight, cycle time, shifts per day..."
                      className={`${inputClass} min-h-[130px] py-3`}
                      disabled={isSubmitting}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground font-display font-semibold uppercase tracking-wider text-sm px-8 py-4 overflow-hidden disabled:opacity-60"
                  >
                    <span className="absolute inset-0 bg-foreground origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
                    {isSubmitting ? (
                      <>
                        <Loader2 className="relative z-10 w-4 h-4 animate-spin" />
                        <span className="relative z-10">Sending…</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10 group-hover:text-background transition-colors duration-300">
                          Send Message
                        </span>
                        <Send className="relative z-10 w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background" />
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
