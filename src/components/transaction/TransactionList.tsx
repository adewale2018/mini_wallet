import { useMemo, useState } from "react";

import Filters from "../Filters";
import { RefreshCw } from "lucide-react";
import TransactionRow from "./TransactionRow";
import { useShallow } from "zustand/react/shallow";
import useStore from "../../store/useStore";

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
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

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

    // Filter by date range
    if (dateStart || dateEnd) {
      list = list.filter((t) => {
        const txDate = new Date(t.date);
        if (dateStart && txDate < new Date(dateStart)) return false;
        if (dateEnd) {
          const endDate = new Date(dateEnd);
          endDate.setHours(23, 59, 59, 999); // Include full end day
          if (txDate > endDate) return false;
        }
        return true;
      });
    }

    // Calculate running balance per account
    const balances: Record<string, number> = {};
    accounts.forEach((a) => (balances[a.id] = a.balance));

    return list.map((t) => {
      const delta =
        t.type === "debit" ? -t.amount : t.type === "credit" ? t.amount : 0;
      balances[t.accountId] += delta;
      return { ...t, runningBalance: balances[t.accountId] };
    });
  }, [transactions, accounts, searchTerm, category, dateStart, dateEnd]);

  const categories = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setDateStart("");
    setDateEnd("");
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
    <section className="bg-white rounded-xl shadow overflow-hidden">
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
        categories={categories}
        clearFilters={clearFilters}
      />
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
            {filtered?.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TransactionList;
