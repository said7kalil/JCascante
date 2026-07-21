import { Toaster } from "sonner";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MarqueeStrip } from "@/components/site/MarqueeStrip";
import { Manifesto } from "@/components/site/Manifesto";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Gallery } from "@/components/site/Gallery";
import { Contact } from "@/components/site/Contact";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

export default function Landing() {
  return (
    <main className="relative bg-brand-bg">
      <Header />
      <Hero />
      <MarqueeStrip />
      <Manifesto />
      <Services />
      <About />
      <Gallery />
      <Contact />
      <WhatsAppFab />
      <Toaster position="top-center" richColors />
    </main>
  );
}
