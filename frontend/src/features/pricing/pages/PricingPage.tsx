import { Footer } from "../../landing/components/layout/Footer";
import { Navbar } from "../../landing/components/layout/Navbar";
import { AskedQuestions } from "../components/AskedQuestions";
import { CompareFeatures } from "../components/CompareFeatures";
import { Packs } from "../components/Packs";
import { PremiumFeatures } from "../components/PremiumFeatures";


export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <Packs />
        <PremiumFeatures />
        <CompareFeatures />
        <AskedQuestions />
      </main>
      <Footer />
    </div>
  );
}
