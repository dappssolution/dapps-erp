import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchBusinessNumbers } from '@/store/businessSlice';
import { fetchExpenses, fetchIncomes } from '@/store/expenseSlice';
import { fetchLeaves } from '@/store/leaveSlice';
import { PARTNERS } from '@/types';
import { Button } from '@/components/ui/button';
import { Users, Wallet, CalendarDays, Plus, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: businesses } = useAppSelector(s => s.business);
  const { expenses, incomes } = useAppSelector(s => s.expense);
  const { records: leaves } = useAppSelector(s => s.leave);

  useEffect(() => {
    dispatch(fetchBusinessNumbers());
    dispatch(fetchExpenses());
    dispatch(fetchIncomes());
    dispatch(fetchLeaves());
  }, [dispatch]);

  const now = new Date();
  const thisMonth = (d: string) => { const dt = new Date(d); return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear(); };
  const today = now.toISOString().split('T')[0];

  const monthBusiness = businesses.filter(b => thisMonth(b.createdAt));
  const monthExpenses = expenses.filter(e => thisMonth(e.date));
  const monthIncomes = incomes.filter(i => thisMonth(i.date));
  const totalExpense = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
  const todayLeaves = leaves.filter(l => l.date === today);

  const recentBusiness = [...businesses].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentExpenses = [...expenses].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const stats = [
    { label: 'Total Contacts', value: businesses.length, sub: `${monthBusiness.length} this month`, icon: Users, color: 'text-primary' },
    { label: 'Total Income', value: `₹${totalIncome.toLocaleString()}`, sub: 'This month', icon: TrendingUp, color: 'text-success' },
    { label: 'Total Expenses', value: `₹${totalExpense.toLocaleString()}`, sub: 'This month', icon: TrendingDown, color: 'text-destructive' },
    { label: 'Net Profit', value: `₹${(totalIncome - totalExpense).toLocaleString()}`, sub: 'This month', icon: DollarSign, color: totalIncome - totalExpense >= 0 ? 'text-success' : 'text-destructive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => navigate('/business')}><Plus className="w-4 h-4 mr-1" />Business</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/expenses')}><Plus className="w-4 h-4 mr-1" />Expense</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/leave')}><Plus className="w-4 h-4 mr-1" />Leave</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 glow-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
              <div className={`p-3 rounded-xl bg-primary/10 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leave Summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Today's Attendance</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PARTNERS.map(p => {
            const absent = todayLeaves.find(l => l.partner === p);
            return (
              <div key={p} className={`p-3 rounded-lg border ${absent ? 'border-destructive/30 bg-destructive/5' : 'border-success/30 bg-success/5'}`}>
                <p className="text-sm font-medium">{p}</p>
                <p className={`text-xs mt-1 ${absent ? 'text-destructive' : 'text-success'}`}>
                  {absent ? absent.leaveType : '✓ Present'}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Recent Contacts</h2>
          </div>
          {recentBusiness.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No contacts yet</p>
          ) : (
            <div className="space-y-3">
              {recentBusiness.map(b => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{b.businessName}</p>
                    <p className="text-xs text-muted-foreground">{b.agentName} · {b.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{b.number}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Recent Expenses</h2>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No expenses yet</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map(e => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{e.reason}</p>
                    <p className="text-xs text-muted-foreground">{e.partner} · {e.category}</p>
                  </div>
                  <span className="text-sm font-medium text-destructive">₹{e.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
