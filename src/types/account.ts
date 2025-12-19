export interface Account {
  id: string;
  name: string;
  type: "main" | "savings";
  balance: number;
}
