import { useState, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import ThemeToggle from "@/components/ThemeToggle";
import { DownloadGateProvider } from "@/components/DownloadGate";
import Index from "./pages/Index";

const Robots = lazy(() => import("./pages/Robots"));
const RobotDetail = lazy(() => import("./pages/RobotDetail"));
const SheetMetal = lazy(() => import("./pages/SheetMetal"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Technology = lazy(() => import("./pages/Technology"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Downloads = lazy(() => import("./pages/Downloads"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
        {!isLoading && (
        <div className="overflow-x-hidden">
          <BrowserRouter>
            <ScrollToTop />
            <BackToTop />
            <ThemeToggle />
            <DownloadGateProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/robots" element={<Robots />} />
                  <Route path="/robots/:id" element={<RobotDetail />} />
                  <Route path="/sheet-metal" element={<SheetMetal />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/technology" element={<Technology />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/downloads" element={<Downloads />} />
                  {/* Legacy fabrication-era URLs */}
                  <Route path="/products" element={<Navigate to="/robots" replace />} />
                  <Route path="/products/*" element={<Navigate to="/robots" replace />} />
                  <Route path="/services" element={<Navigate to="/solutions" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </DownloadGateProvider>
          </BrowserRouter>
        </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
