import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Download } from "lucide-react";
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

const STORAGE_KEY = "texsonics-download-details";

interface DownloadDetails {
  name: string;
  phone: string;
  company: string;
}

interface PendingRequest {
  url: string;
  filename: string;
  label: string;
}

interface DownloadGateValue {
  request: (req: PendingRequest) => void;
}

const DownloadGateContext = createContext<DownloadGateValue | null>(null);

const triggerDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getStoredDetails = (): DownloadDetails | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.name && parsed?.phone && parsed?.company) return parsed;
  } catch {
    /* fall through */
  }
  return null;
};

const notifyBackend = async (details: DownloadDetails, downloading: string) => {
  try {
    await fetch("/submit-brochure-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...details, downloading }),
    });
  } catch (err) {
    console.error("Notify submit-brochure-download failed:", err);
  }
};

export const DownloadGateProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [pending, setPending] = useState<PendingRequest | null>(null);
  const [formData, setFormData] = useState<DownloadDetails>({
    name: "",
    phone: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const request = useCallback((req: PendingRequest) => {
    const stored = getStoredDetails();
    if (stored) {
      // Fire-and-forget notification; don't block the download.
      notifyBackend(stored, req.label);
      triggerDownload(req.url, req.filename);
      toast({
        title: "Download started",
        description: `${req.label} is downloading.`,
      });
      return;
    }
    setPending(req);
  }, [toast]);

  const isValid =
    formData.name.trim() && formData.phone.trim() && formData.company.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !pending) return;
    setSubmitting(true);
    try {
      await notifyBackend(formData, pending.label);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch {
        /* private mode etc — ignore */
      }
      triggerDownload(pending.url, pending.filename);
      toast({
        title: "Download started",
        description: `${pending.label} is downloading. Thank you!`,
      });
      setPending(null);
      setFormData({ name: "", phone: "", company: "" });
    } catch (err) {
      console.error("Download-gate submit failed:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DownloadGateContext.Provider value={{ request }}>
      {children}
      <Dialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open && !submitting) setPending(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Before you download</DialogTitle>
            <DialogDescription>
              {pending
                ? `Please share a few details so we can send you the ${pending.label} and follow up if needed.`
                : "Share your details to continue."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="dg-name">Full Name *</Label>
              <Input
                id="dg-name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dg-phone">Contact Number *</Label>
              <Input
                id="dg-phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dg-company">Company Name *</Label>
              <Input
                id="dg-company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll only ask once — subsequent downloads in this session skip
              this dialog.
            </p>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !isValid}
            >
              {submitting ? (
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
    </DownloadGateContext.Provider>
  );
};

export const useDownloadGate = () => {
  const ctx = useContext(DownloadGateContext);
  if (!ctx) {
    throw new Error("useDownloadGate must be used inside DownloadGateProvider");
  }
  return ctx.request;
};
