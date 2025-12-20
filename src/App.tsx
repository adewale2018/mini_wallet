import { AlertCircle, RefreshCw } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import TransferPage from "./pages/TransferPage";
import { useEffect } from "react";
import useStore from "./store/useStore";

function App() {
  const { loadData, error } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="md:w-12 md:h-12 text-red-500 mx-auto mb-4" />
          <h2 className="md:text-xl font-medium text-gray-900 mb-2">
            Failed to Load Data
          </h2>
          <button
            onClick={loadData}
            className="w-full py-3 bg-primary text-white hover:text-orange-500 rounded-lg hover:bg-white hover:border-orange-500 hover:border flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
