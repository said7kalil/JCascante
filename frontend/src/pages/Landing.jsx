import { ReactLenis } from "lenis/react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Testimonials } from "@/components/landing/Testimonials";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer, WhatsAppFab } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <ReactLenis root options={{ lerp: 0.09, duration: 1.2, smoothWheel: true, anchors: true }}>
      <main className="relative bg-white overflow-x-hidden">
        <LandingHeader />
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <ContactSection />
        <Footer />
        <WhatsAppFab />
      </main>
    </ReactLenis>
  );
}
