import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CTA } from "../components/home/CTA";
import { Features } from "../components/home/Features";
import { Hero } from "../components/home/Hero";
import { Integrations } from "../components/home/Integrations";

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
