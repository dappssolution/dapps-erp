import { PARTNERS } from '@/types';
import type { Expense } from '@/types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['hsl(263,70%,58%)', 'hsl(270,60%,50%)', 'hsl(280,50%,60%)', 'hsl(250,60%,55%)'];

interface Props {
  expenses: Expense[];
}

export default function ExpenseCharts({ expenses }: Props) {
  const partnerData = PARTNERS.map(p => ({
    name: p.split(' ')[0],
    amount: expenses.filter(e => e.partner === p).reduce((s, e) => s + e.amount, 0),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
        <h3 className="font-semibold mb-4">Partner Expense Share</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={partnerData}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
        <h3 className="font-semibold mb-4">Expense Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={partnerData.filter(d => d.amount > 0)} dataKey="amount" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
              {partnerData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
