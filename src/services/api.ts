import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";

// network delay simulation
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async getAccounts(): Promise<Account[]> {
    await delay(500);
    const res = await fetch("/data/accounts.json");
    if (!res.ok) {
      throw new Error("Failed to fetch accounts");
    }
    return res.json();
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(500);
    const res = await fetch("/data/transactions.json");
    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return res.json();
  },
};
