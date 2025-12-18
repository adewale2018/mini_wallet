export interface Account {
  id: string;
  name: string;
  type: "main" | "savings";
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: "debit" | "credit" | "transfer";
  status: "pending" | "completed" | "failed";
  transferToAccountId?: string; // This applies to transfers only
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

export interface Filters {
  category: string;
  dateRange: { start: Date | null; end: Date | null };
  searchTerm: string;
  accountId: string | 'all';
}
