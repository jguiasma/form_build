import { Navbar } from "../../landing/components/Navbar";
import { Footer } from "../../landing/components/Footer";
import { PremiumFeatures } from "../components/PremiumFeatures";
import { Packs } from "../components/Packs";
import { CompareFeatures } from "../components/CompareFeatures";
import { AskedQuestions } from "../components/AskedQuestions";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Packs/>
        <PremiumFeatures />
        <CompareFeatures />
        <AskedQuestions/>
      </main>
      <Footer />
    </div>
  );
}

