import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useShallow } from "zustand/react/shallow";
import useStore from "../store/useStore";

const TransactionList = () => {
  const { isLoading } = useStore();
  const { transactions, accounts } = useStore(
    useShallow((state) => ({
      transactions: state.transactions,
      accounts: state.accounts,
    }))
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (searchTerm) {
      list = list.filter((t) =>
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "all") {
      list = list.filter((t) => t.category === category);
    }

    // Sort newest first
    list.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Calculate running balance per account
    const balances: Record<string, number> = {};
    accounts.forEach((a) => (balances[a.id] = a.balance));

    return list.map((t) => {
      // const prev = balances[t.accountId];
      const delta =
        t.type === "debit" ? -t.amount : t.type === "credit" ? t.amount : 0;
      balances[t.accountId] += delta;
      return { ...t, runningBalance: balances[t.accountId] };
    });
  }, [transactions, accounts, searchTerm, category]);

  const categories = ["all", "income", "transfer", "food", "transport"];

  const getAccountName = (accountId: string) => {
    return accounts.find((a) => a.id === accountId)?.name || accountId;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (transactions?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">No transactions found</div>
        <p className="text-gray-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search merchant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all"
                  ? "All Categories"
                  : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Merchant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Running Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered?.map((transaction) => {
              const isDebit = transaction.type === "debit";
              const isCredit = transaction.type === "credit";
              const isTransfer = transaction.type === "transfer";

              return (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.merchant}
                    </div>
                    {isTransfer && transaction.transferToAccountId && (
                      <div className="text-xs text-gray-500">
                        → {getAccountName(transaction.transferToAccountId)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction?.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAccountName(transaction.accountId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {isDebit && (
                        <ArrowUp className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      {isCredit && (
                        <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                      )}
                      {/* {isTransfer && (
                        <RefreshCw className="w-4 h-4 text-blue-500 mr-1" />
                      )} */}
                      <span
                        className={`text-sm font-medium ${
                          isDebit
                            ? "text-red-600"
                            : isCredit
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {isDebit ? "-" : isCredit ? "+" : "⇄"}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    ${transaction?.runningBalance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
