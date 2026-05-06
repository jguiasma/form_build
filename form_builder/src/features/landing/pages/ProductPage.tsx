import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";

import { Features } from "../components/Features";
import { Integrations } from "../components/Integrations";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Integrations />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

