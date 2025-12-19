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
