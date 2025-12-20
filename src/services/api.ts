import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";
import type { TransferRequest } from "../types/transfer";

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
  async transfer(request: TransferRequest): Promise<void> {
    await delay(1000);
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Transfer failed due to network error');
    }
    
    // In a real app, this would POST to an API
    console.log('Transfer successful:', request);
    
    // Don't log sensitive data in production
    const safeLog = {
      ...request,
      amount: `$${request.amount}`,
    };
    console.log('Transfer:', safeLog);
  },
};
