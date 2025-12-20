import { DollarSign } from "lucide-react";
import SingleAccount from "./SingleAccount";
import useStore from "../store/useStore";

const AccountSummary = () => {
  const { accounts } = useStore();
   const totalBalance = useStore(state => state.getTotalBalance());
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Balance Card */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-600 text-sm">Total Balance</p>
            <h2 className="md:text-3xl text-2xl font-bold mt-2">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>
          <div className="p-3 bg-orange-50 rounded-full">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Across {accounts?.length} accounts
        </p>
      </div>

      {/* Individual Accounts */}
      {accounts?.map((account) => (
        <SingleAccount key={account.id} account={account} />
      ))}
    </section>
  );
};

export default AccountSummary;
