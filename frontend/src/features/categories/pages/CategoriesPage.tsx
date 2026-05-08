import { Navbar } from "../../landing/components/Navbar";
import { Footer } from "../../landing/components/Footer";
import { ListCategories } from "../components/ListCategories";
import type { Category } from "../types/categorie.type";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const handleContinue = (selected: Category[]) => {
    const category = selected[0];

    if (!category) {
      return;
    }

    navigate("/forms/create", { state: { category } });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <ListCategories onContinue={handleContinue} />
      </main>
      <Footer />
    </div>
  );
}
