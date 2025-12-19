import { TrendingUp, Wallet } from "lucide-react";

import type { Account as AccountType } from "../types/account";

const SingleAccount = ({ account }: { account: AccountType }) => {
  return (
    <div
      key={account?.id}
      className="bg-white rounded-xl shadow p-6 border border-gray-200"
      style={{ borderLeftColor: account.color, borderLeftWidth: "4px" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{account?.name}</p>
          <h3 className="md:text-2xl text-xl font-semibold mt-2">
            $
            {account.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mt-2">
            {account?.type}
          </span>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${account?.color}20` }}
        >
          {account.type === "main" ? (
            <Wallet className="w-6 h-6" style={{ color: account?.color }} />
          ) : (
            <TrendingUp className="w-6 h-6" style={{ color: account?.color }} />
          )}
        </div>
      </div>
    </div>
  );
};
export default SingleAccount;
