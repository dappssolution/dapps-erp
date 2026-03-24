import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export default function ExpenseStats({ totalIncome, totalExpense, netProfit }: Props) {
  const stats = [
    { title: 'Total Income (This Month)', value: totalIncome, icon: TrendingUp, type: 'income' as const },
    { title: 'Total Expenses (This Month)', value: totalExpense, icon: TrendingDown, type: 'expense' as const },
    { title: 'Net Profit (This Month)', value: netProfit, icon: DollarSign, type: 'profit' as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(s => (
        <motion.div key={s.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5 glow-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{s.title}</p>
              <p className="text-2xl font-bold mt-1">₹{s.value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-xl ${s.type === 'income' ? 'bg-success/20 text-success' : s.type === 'expense' ? 'bg-destructive/20 text-destructive' : netProfit >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
