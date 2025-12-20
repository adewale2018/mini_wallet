// import { createJSONStorage, persist } from "zustand/middleware";

// import type { Account } from "../types/account";
// import type { Filters } from "../types/filters";
// import type { Transaction } from "../types/transaction";
// import type { TransferRequest } from "../types/transfer";
// import { api } from "../services/api";
// import { create } from "zustand";

// interface StoreState {
//   // sate
//   accounts: Account[];
//   transactions: Transaction[];
//   filters: Filters;
//   isLoading: boolean;
//   error: string | null;

//   // actions
//   loadData: () => Promise<void>;
//   transferMoney: (transfer: TransferRequest) => Promise<void>;
//   updateFilters: (newFilters: Partial<Filters>) => void;
//   resetFilters: () => void;

//   // derived state
//   // Derived/Computed state (getters)
//   get filteredTransactions: () => Transaction[];
//   get totalBalance: () => number;
//   get categories: () => string[];
// }

// const initialFilters: Filters = {
//   category: "all",
//   dateRange: { start: null, end: null },
//   searchTerm: "",
//   accountId: "all",
// };

// const useStore = create<StoreState>()(
//   persist(
//     (set, get) => ({
//       // initial state
//       accounts: [],
//       transactions: [],
//       filters: initialFilters,
//       isLoading: false,
//       error: null,

//       loadData: async () => {
//         const { accounts, transactions } = get();

//         // Only load from API if we don't have persisted data
//         if (accounts?.length === 0 || transactions?.length === 0) {
//           set({ isLoading: true, error: null });
//           try {
//             const [apiAccounts, apiTransactions] = await Promise.all([
//               api.getAccounts(),
//               api.getTransactions(),
//             ]);

//             // Sort transactions by date (newest first)
//             const sortedTransactions = apiTransactions.sort(
//               (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//             );

//             set({
//               accounts: apiAccounts,
//               transactions: sortedTransactions,
//               isLoading: false,
//             });
//           } catch (error) {
//             set({
//               error: "Failed to load initial data",
//               isLoading: false,
//             });
//           }
//         }
//       },

//       transferMoney: async (request: TransferRequest) => {
//         const { accounts } = get();

//         // 1. Validation
//         const fromAccount = accounts.find(
//           (a) => a.id === request.fromAccountId
//         );
//         const toAccount = accounts.find((a) => a.id === request.toAccountId);

//         if (!fromAccount || !toAccount) {
//           throw new Error("Invalid account selection");
//         }

//         if (request.amount <= 0) {
//           throw new Error("Amount must be positive");
//         }

//         if (request.amount > fromAccount.balance) {
//           throw new Error("Insufficient funds");
//         }

//         if (!/^\d+(\.\d{1,2})?$/.test(request.amount.toString())) {
//           throw new Error("Invalid amount format");
//         }

//         // 2. Generate optimistic transaction IDs
//         const tempId = `temp-${Date.now()}`;
//         const now = new Date().toISOString();

//         // 3. Create optimistic transactions
//         const fromTransaction: Transaction = {
//           id: tempId,
//           accountId: request.fromAccountId,
//           date: now,
//           merchant: `Transfer to ${toAccount.name}`,
//           category: "Transfer",
//           amount: request.amount,
//           type: "transfer",
//           transferToAccountId: request.toAccountId,
//           status: "pending",
//         };

//         const toTransaction: Transaction = {
//           id: `${tempId}-2`,
//           accountId: request.toAccountId,
//           date: now,
//           merchant: `Transfer from ${fromAccount.name}`,
//           category: "Transfer",
//           amount: request.amount,
//           type: "transfer",
//           transferToAccountId: request.fromAccountId,
//           status: "pending",
//         };

//         // 4. Optimistic update state (THIS WILL BE PERSISTED)
//         set((state) => ({
//           accounts: state.accounts.map((account) => {
//             if (account.id === request.fromAccountId) {
//               return { ...account, balance: account.balance - request.amount };
//             }
//             if (account.id === request.toAccountId) {
//               return { ...account, balance: account.balance + request.amount };
//             }
//             return account;
//           }),
//           transactions: [fromTransaction, toTransaction, ...state.transactions],
//         }));

//         // 5. Make API call (simulated)
//         try {
//           await api.transfer(request);

//           // 6. Update transactions to completed
//           set((state) => ({
//             transactions: state.transactions.map((t) =>
//               t.id === tempId || t.id === `${tempId}-2`
//                 ? { ...t, status: "completed" }
//                 : t
//             ),
//           }));
//         } catch (error) {
//           // 7. Revert on error
//           set((state) => ({
//             accounts: state.accounts.map((account) => {
//               if (account.id === request.fromAccountId) {
//                 return {
//                   ...account,
//                   balance: account.balance + request.amount,
//                 };
//               }
//               if (account.id === request.toAccountId) {
//                 return {
//                   ...account,
//                   balance: account.balance - request.amount,
//                 };
//               }
//               return account;
//             }),
//             transactions: state.transactions.filter(
//               (t) => t.id !== tempId && t.id !== `${tempId}-2`
//             ),
//           }));
//           throw error;
//         }
//       },

//       // To update filters
//       updateFilters: (newFilters) => {
//         set((state) => ({
//           filters: { ...state.filters, ...newFilters },
//         }));
//       },

//       // To reset filters
//       resetFilters: () => {
//         set({ filters: initialFilters });
//       },
//       // GETTERS (computed properties)
//       get filteredTransactions() {
//         const state = get();
//         const { transactions, filters } = state;

//         return transactions.filter(transaction => {
//           // Filter by category
//           if (filters.category !== 'all' && transaction.category !== filters.category) {
//             return false;
//           }

//           // Filter by account
//           if (filters.accountId !== 'all' && transaction.accountId !== filters.accountId) {
//             return false;
//           }

//           // Filter by search
//           if (filters.search && !transaction.merchant.toLowerCase().includes(filters.search.toLowerCase())) {
//             return false;
//           }

//           // Filter by date range
//           if (filters.dateRange.start || filters.dateRange.end) {
//             const transactionDate = new Date(transaction.date);
//             if (filters.dateRange.start && transactionDate < filters.dateRange.start) {
//               return false;
//             }
//             if (filters.dateRange.end && transactionDate > filters.dateRange.end) {
//               return false;
//             }
//           }

//           return true;
//         });
//       },

//       get totalBalance() {
//         const state = get();
//         return state.accounts.reduce((sum, account) => sum + account.balance, 0);
//       },

//       get categories() {
//         const state = get();
//         const categories = new Set(state.transactions.map(t => t.category));
//         return ['all', ...Array.from(categories)];
//       },
//     }),
//     {
//       name: "mini-wallet-storage",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         accounts: state.accounts,
//         transactions: state.transactions,
//       }),
//     }
//   )
// );

// export default useStore;

import { createJSONStorage, persist } from "zustand/middleware";

import type { Account } from "../types/account";
import type { Filters } from "../types/filters";
import type { Transaction } from "../types/transaction";
import type { TransferRequest } from "../types/transfer";
import { api } from "../services/api";
import { create } from "zustand";

interface StoreState {
  // state
  accounts: Account[];
  transactions: Transaction[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;

  // actions
  loadData: () => Promise<void>;
  transferMoney: (transfer: TransferRequest) => Promise<void>;
  updateFilters: (newFilters: Partial<Filters>) => void;
  resetFilters: () => void;

  // computed methods (not getters)
  getFilteredTransactions: () => Transaction[];
  getTotalBalance: () => number;
  getCategories: () => string[];
}

const initialFilters: Filters = {
  category: "all",
  dateRange: { start: null, end: null },
  searchTerm: "",
  accountId: "all",
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // initial state
      accounts: [],
      transactions: [],
      filters: initialFilters,
      isLoading: false,
      error: null,

      // actions
      loadData: async () => {
        const { accounts, transactions } = get();

        // Only load from API if we don't have persisted data
        if (accounts?.length === 0 || transactions?.length === 0) {
          set({ isLoading: true, error: null });
          try {
            const [apiAccounts, apiTransactions] = await Promise.all([
              api.getAccounts(),
              api.getTransactions(),
            ]);

            // Sort transactions by date (newest first)
            const sortedTransactions = apiTransactions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            set({
              accounts: apiAccounts,
              transactions: sortedTransactions,
              isLoading: false,
            });
          } catch (error) {
            console.log(error);
            set({
              error: "Failed to load initial data",
              isLoading: false,
            });
          }
        }
      },

      transferMoney: async (request: TransferRequest) => {
        const { accounts } = get();

        // 1. Validation
        const fromAccount = accounts.find(
          (a) => a.id === request.fromAccountId
        );
        const toAccount = accounts.find((a) => a.id === request.toAccountId);

        if (!fromAccount || !toAccount) {
          throw new Error("Invalid account selection");
        }

        if (request.amount <= 0) {
          throw new Error("Amount must be positive");
        }

        if (request.amount > fromAccount.balance) {
          throw new Error("Insufficient funds");
        }

        if (!/^\d+(\.\d{1,2})?$/.test(request.amount.toString())) {
          throw new Error("Invalid amount format");
        }

        // 2. Generate optimistic transaction IDs
        const tempId = `temp-${Date.now()}`;
        const now = new Date().toISOString();

        // 3. Create optimistic transactions
        const fromTransaction: Transaction = {
          id: tempId,
          accountId: request.fromAccountId,
          date: now,
          merchant: `Transfer to ${toAccount.name}`,
          category: "Transfer",
          amount: request.amount,
          type: "transfer",
          transferToAccountId: request.toAccountId,
          status: "pending",
        };

        const toTransaction: Transaction = {
          id: `${tempId}-2`,
          accountId: request.toAccountId,
          date: now,
          merchant: `Transfer from ${fromAccount.name}`,
          category: "Transfer",
          amount: request.amount,
          type: "transfer",
          transferToAccountId: request.fromAccountId,
          status: "pending",
        };

        // 4. Optimistic update state
        set((state) => ({
          accounts: state.accounts.map((account) => {
            if (account.id === request.fromAccountId) {
              return { ...account, balance: account.balance - request.amount };
            }
            if (account.id === request.toAccountId) {
              return { ...account, balance: account.balance + request.amount };
            }
            return account;
          }),
          transactions: [fromTransaction, toTransaction, ...state.transactions],
        }));

        // 5. Make API call
        try {
          await api.transfer(request);

          // 6. Update transactions to completed
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === tempId || t.id === `${tempId}-2`
                ? { ...t, status: "completed" }
                : t
            ),
          }));
        } catch (error) {
          // 7. Revert on error
          set((state) => ({
            accounts: state.accounts.map((account) => {
              if (account.id === request.fromAccountId) {
                return {
                  ...account,
                  balance: account.balance + request.amount,
                };
              }
              if (account.id === request.toAccountId) {
                return {
                  ...account,
                  balance: account.balance - request.amount,
                };
              }
              return account;
            }),
            transactions: state.transactions.filter(
              (t) => t.id !== tempId && t.id !== `${tempId}-2`
            ),
          }));
          throw error;
        }
      },

      updateFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: initialFilters });
      },

      // COMPUTED METHODS
      getFilteredTransactions: () => {
        const state = get();
        const { transactions, filters } = state;

        return transactions.filter((transaction) => {
          // Filter by category
          if (
            filters.category !== "all" &&
            transaction.category !== filters.category
          ) {
            return false;
          }

          // Filter by account
          if (
            filters.accountId !== "all" &&
            transaction.accountId !== filters.accountId
          ) {
            return false;
          }

          // Filter by search - NOTE: you have searchTerm in your interface
          if (
            filters.searchTerm &&
            !transaction.merchant
              .toLowerCase()
              .includes(filters.searchTerm.toLowerCase())
          ) {
            return false;
          }

          // Filter by date range
          if (filters.dateRange.start || filters.dateRange.end) {
            const transactionDate = new Date(transaction.date);
            if (
              filters.dateRange.start &&
              transactionDate < filters.dateRange.start
            ) {
              return false;
            }
            if (
              filters.dateRange.end &&
              transactionDate > filters.dateRange.end
            ) {
              return false;
            }
          }

          return true;
        });
      },

      getTotalBalance: () => {
        const state = get();
        return state.accounts.reduce(
          (sum, account) => sum + account.balance,
          0
        );
      },

      getCategories: () => {
        const state = get();
        const categories = new Set(state.transactions.map((t) => t.category));
        return ["all", ...Array.from(categories)];
      },
    }),
    {
      name: "mini-wallet-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        transactions: state.transactions,
      }),
    }
  )
);

export default useStore;
