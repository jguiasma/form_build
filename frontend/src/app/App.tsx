import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import ProductPage from "../features/landing/pages/ProductPage";
import PricingPage from "../features/pricing/pages/PricingPage";
import SolutionsPage from "../features/landing/pages/SolutionsPage";
import { EmailValidationForm } from "../features/auth/components/EmailValidationForm";
import CompleteProfile from "../features/profile/pages/CompleteProfile";
import Dashboard from "../features/dashboard/pages/Dashboard";
import VisualEditor from "../features/form-editor/pages/VisualEditor";
import PublicForm from "../features/public-form/pages/PublicForm";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import "../styles/index.css";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing / Product Page */}
          <Route path="/" element={<ProductPage />} />

          {/*Pricing page */}
          <Route path="/pricing" element={<PricingPage />} />
          
          <Route path="/solutions" element={<SolutionsPage />} />

          <Route path="/categories" element={<CategoriesPage />} />
          
          {/* Auth Flow */}
          <Route path="/auth" element={<EmailValidationForm />} />
          
          {/* Profile Completion */}
          <Route path="/complete-profile" element={<CompleteProfile />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor" element={<VisualEditor />} />
          <Route path="/editor/:id" element={<VisualEditor />} />
          
          <Route path="/f/:uuid" element={<PublicForm />} />
          
          {/* Redirect any other route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
