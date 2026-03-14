export type AccountType = "checking" | "savings" | "credit";
export type TransactionType = "debit" | "credit";
export type TransferStatus = "pending" | "completed" | "failed";
export type CardStatus = "active" | "frozen";
export type NotificationType = "transaction" | "transfer" | "warning" | "insight";
export type AppRole = "customer" | "admin";

export interface Viewer {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_type: AccountType;
  balance: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type: TransactionType;
  description: string;
  category: string;
  amount: number;
  created_at: string;
  account_type?: AccountType;
}

export interface TransferRecord {
  id: string;
  from_account: string;
  to_account: string;
  amount: number;
  status: TransferStatus;
  created_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  card_number: string;
  status: CardStatus;
  online_payments_enabled: boolean;
  international_enabled: boolean;
}

export interface AppNotification {
  id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  created_at: string;
}

export interface FinancialInsight {
  spending_insight: string;
  saving_tip: string;
  anomaly_detection: string;
  predicted_balance_7_days: number;
}

export interface DashboardSnapshot {
  accounts: Account[];
  transactions: Transaction[];
  notifications: AppNotification[];
  cards: Card[];
}

export interface AdminSnapshot {
  users: UserProfile[];
  transactions: Transaction[];
  totalVolume: number;
  userCount: number;
}
