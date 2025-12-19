import { Account, Filters, Transaction, TransferRequest } from "../types";

import api from "../services/api";
import { create } from "zustand";

interface StoreState {
  // sate
  accounts: Account[];
  transactions: Transaction[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;

  // actions
  loadData: () => Promise<void>;
  transferFunds: (transfer: TransferRequest) => Promise<void>;
  updateFilters: (newFilters: Partial<Filters>) => void;
  resetFilters: () => void;

  // derived state
  filteredTransactions: () => Transaction[];
  totalBalance: () => number;
  categories: () => string[];
}

const initialFilters: Filters = {
  category: "all",
  dateRange: { start: null, end: null },
  searchTerm: "",
  accountId: "all",
};

const useStore = create<StoreState>((set, get) => ({
  accounts: [],
  transactions: [],
  filters: initialFilters,
  isLoading: false,
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [accounts, transactions] = await Promise.all([
        api.getAccounts(),
        api.getTransactions(),
      ]);
      // Sort transactions by date (newest first)
      const sortedTransactions = transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      set({ accounts, transactions: sortedTransactions, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useStore;
