import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { type Account, type AdminSnapshot, type AppNotification, type Card, type DashboardSnapshot, type Transaction, type UserProfile, type Viewer } from "@/lib/types";

function normalizeAccount(record: Record<string, unknown>): Account {
  return {
    id: String(record.id),
    user_id: String(record.user_id),
    account_type: String(record.account_type) as Account["account_type"],
    balance: Number(record.balance ?? 0),
    created_at: String(record.created_at),
  };
}

function normalizeTransaction(record: Record<string, unknown>, accountType?: Account["account_type"]): Transaction {
  return {
    id: String(record.id),
    account_id: String(record.account_id),
    type: String(record.type) as Transaction["type"],
    description: String(record.description),
    category: String(record.category),
    amount: Number(record.amount ?? 0),
    created_at: String(record.created_at),
    account_type: accountType,
  };
}

function normalizeCard(record: Record<string, unknown>): Card {
  return {
    id: String(record.id),
    user_id: String(record.user_id),
    card_number: String(record.card_number),
    status: String(record.status) as Card["status"],
    online_payments_enabled: Boolean(record.online_payments_enabled),
    international_enabled: Boolean(record.international_enabled),
  };
}

function normalizeNotification(record: Record<string, unknown>): AppNotification {
  return {
    id: String(record.id),
    user_id: String(record.user_id),
    message: String(record.message),
    type: String(record.type) as AppNotification["type"],
    created_at: String(record.created_at),
  };
}

function emptySnapshot(): DashboardSnapshot {
  return {
    accounts: [],
    transactions: [],
    notifications: [],
    cards: [],
  };
}

export async function getDashboardSnapshot(viewer: Viewer): Promise<DashboardSnapshot> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return emptySnapshot();
  }

  const { data: accountRowsData } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", viewer.id)
    .order("created_at", { ascending: true });
  const accountRows = accountRowsData ?? [];

  const accounts = accountRows.map((row) => normalizeAccount(row));
  const accountIds = accounts.map((account) => account.id);

  const { data: transactionRowsData } = accountIds.length
    ? await supabase
        .from("transactions")
        .select("*")
        .in("account_id", accountIds)
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: [] as Record<string, unknown>[] };
  const transactionRows = transactionRowsData ?? [];

  const accountMap = new Map(accounts.map((account) => [account.id, account.account_type]));

  const transactions = transactionRows.map((row) =>
    normalizeTransaction(row, accountMap.get(String(row.account_id))),
  );

  const { data: notificationRowsData } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", viewer.id)
    .order("created_at", { ascending: false })
    .limit(25);
  const notificationRows = notificationRowsData ?? [];

  const { data: cardRowsData } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", viewer.id)
    .order("id", { ascending: true });
  const cardRows = cardRowsData ?? [];

  return {
    accounts,
    transactions,
    notifications: notificationRows.map((row) => normalizeNotification(row)),
    cards: cardRows.map((row) => normalizeCard(row)),
  };
}

export async function getAccounts(viewer: Viewer) {
  return (await getDashboardSnapshot(viewer)).accounts;
}

export async function getTransactions(viewer: Viewer) {
  return (await getDashboardSnapshot(viewer)).transactions;
}

export async function getCards(viewer: Viewer) {
  return (await getDashboardSnapshot(viewer)).cards;
}

export async function getNotifications(viewer: Viewer) {
  return (await getDashboardSnapshot(viewer)).notifications;
}

export async function getAdminSnapshot(): Promise<AdminSnapshot> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      users: [],
      transactions: [],
      totalVolume: 0,
      userCount: 0,
    };
  }

  const { data: usersData } = await supabase
    .from("users")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });
  const users = usersData ?? [];

  const { data: transactionRowsData } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const transactionRows = transactionRowsData ?? [];

  const { data: accountRowsData } = await supabase.from("accounts").select("id, account_type");
  const accountRows = accountRowsData ?? [];
  const accountMap = new Map(accountRows.map((row) => [String(row.id), String(row.account_type) as Account["account_type"]]));

  const transactions = transactionRows.map((row) =>
    normalizeTransaction(row, accountMap.get(String(row.account_id))),
  );

  return {
    users: users as UserProfile[],
    transactions,
    totalVolume: transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    userCount: users.length,
  };
}
