import TransferForm from "../components/TransferForm";
import { useEffect } from "react";
import useStore from "../store/useStore";

function TransferPage() {
  const { loadData } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransferForm />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">
                Transfer Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-3"></div>
                  <span>Transfers are processed instantly</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-3"></div>
                  <span>No fees for transfers between your accounts</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-3"></div>
                  <span>Minimum transfer amount: $0.01</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-3"></div>
                  <span>Transfers may be reviewed for security</span>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl border border-orange-200 p-6">
              <h4 className="font-semibold text-orange-900 mb-2">Need Help?</h4>
              <p className="text-orange-700 text-sm mb-4">
                Contact support if you encounter any issues with transfers.
              </p>
              <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TransferPage;
