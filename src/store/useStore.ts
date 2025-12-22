import { createJSONStorage, persist } from "zustand/middleware";

import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";
import type { TransferRequest } from "../types/transfer";
import { api } from "../services/api";
import { create } from "zustand";

interface StoreState {
  // state
  accounts: Account[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // actions
  loadData: () => Promise<void>;
  transferMoney: (transfer: TransferRequest) => Promise<void>;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // initial state
      accounts: [],
      transactions: [],
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
