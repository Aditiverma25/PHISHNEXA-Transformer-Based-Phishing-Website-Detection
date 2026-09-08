import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Landing from "@/pages/Landing";
import ScannerPage from "@/pages/ScannerPage";
import Dashboard from "@/pages/Dashboard";
import HistoryPage from "@/pages/HistoryPage";
import LabsPage from "@/pages/LabsPage";
import BatchPage from "@/pages/BatchPage";
import ComparisonPage from "@/pages/ComparisonPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ModelsPage from "@/pages/ModelsPage";
import ResearchPage from "@/pages/ResearchPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#222831] text-[#EEEEEE] font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scanner" element={<ScannerPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/batch" element={<BatchPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
