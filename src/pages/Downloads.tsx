import { useState } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface DownloadFormData {
  name: string;
  phone: string;
  company: string;
}

const Downloads = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DownloadFormData>({
    name: "",
    phone: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof DownloadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name.trim() && formData.phone.trim() && formData.company.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "All fields are required",
        description: "Please fill in your name, contact, and company.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send notification email
      const response = await fetch("/submit-brochure-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to process request");
      }

      // Trigger the download
      const link = document.createElement("a");
      link.href = "/brochures/Texsonics_Brochure.pdf";
      link.download = "Texsonics_Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your brochure download has begun. Thank you!",
      });

      // Reset form and close dialog
      setFormData({ name: "", phone: "", company: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Download Texsonics Brochure PDF | Robots & Automation"
        description="Download the official Texsonics brochure (PDF): our robot lineup, collaborative robots, AMRs, automation solutions, and manufacturing capabilities."
        canonical="/downloads"
        keywords="Texsonics brochure PDF, robot catalog India, company profile Coimbatore, robotics capabilities download"
        jsonLd={downloadsJsonLd}
      />
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="tech-label inline-block text-primary mb-4">Downloads</span>
            <h1 className="font-display font-bold uppercase tracking-tight text-4xl md:text-5xl text-foreground mb-6">Company Brochure</h1>
            <p className="text-muted-foreground text-lg">Download our company brochure to learn more about our capabilities, services, and product offerings.</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-xl p-8 border border-border/50 hover:shadow-lg transition-shadow group text-center">
              <div className="w-20 h-20 rounded-xl bg-accent/50 flex items-center justify-center mb-6 mx-auto group-hover:bg-accent transition-colors">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Texsonics Company Brochure</h3>
              <p className="text-sm text-muted-foreground mb-6">Complete overview of our services, products, and manufacturing capabilities.</p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">PDF Format</span>
              </div>
              <Button 
                size="lg" 
                className="w-full group/btn"
                onClick={() => setIsDialogOpen(true)}
              >
                <Download className="w-5 h-5 mr-2 group-hover/btn:animate-bounce" />
                Download Brochure
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Download Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download Brochure</DialogTitle>
            <DialogDescription>
              Please fill in your details to download the brochure. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Submit & Download
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default Downloads;
