import { AlertCircle, ArrowLeftRight, Home, RefreshCw } from "lucide-react";

import AccountSummary from "./components/AccountSummary";
import Filters from "./components/Filters";
import TransactionsList from "./components/TransactionList";
import { useEffect } from "react";
import useStore from "./store/useStore";

function App() {
  const { loadData, isLoading, error } = useStore();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AccountSummary />
        <Filters />
        <TransactionsList />
      </div>
    </div>
  );
}

export default App;
