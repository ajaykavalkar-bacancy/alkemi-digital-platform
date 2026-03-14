import { AppShell } from "@/components/app-shell";
import { TransactionList } from "@/components/transaction-list";
import { getTransactions } from "@/lib/data";
import { requireViewer } from "@/lib/session";

export default async function TransactionsPage() {
  const viewer = await requireViewer();
  const transactions = await getTransactions(viewer);

  return (
    <AppShell
      viewer={viewer}
      title="Transactions"
      description="Search, filter, and paginate every debit and credit across your MoneyMind accounts."
    >
      <TransactionList transactions={transactions} />
    </AppShell>
  );
}
