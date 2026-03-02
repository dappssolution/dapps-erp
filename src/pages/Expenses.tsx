import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchExpenses, addExpense, deleteExpense, fetchIncomes, addIncome, deleteIncome } from '@/store/expenseSlice';
import { Expense, Income, PARTNERS, Partner, EXPENSE_CATEGORIES, ExpenseCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['hsl(263,70%,58%)', 'hsl(270,60%,50%)', 'hsl(280,50%,60%)', 'hsl(250,60%,55%)'];

export default function Expenses() {
  const dispatch = useAppDispatch();
  const { expenses, incomes } = useAppSelector(s => s.expense);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expForm, setExpForm] = useState({ partner: PARTNERS[0] as Partner, amount: '', reason: '', category: EXPENSE_CATEGORIES[0] as ExpenseCategory, date: new Date().toISOString().split('T')[0], isCompanyExpense: true });
  const [incForm, setIncForm] = useState({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => { dispatch(fetchExpenses()); dispatch(fetchIncomes()); }, [dispatch]);

  const now = new Date();
  const thisMonth = (d: string) => { const dt = new Date(d); return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear(); };

  const monthExpenses = expenses.filter(e => thisMonth(e.date));
  const monthIncomes = incomes.filter(i => thisMonth(i.date));
  const totalExpense = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = monthIncomes.reduce((s, i) => s + i.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const partnerData = PARTNERS.map(p => ({
    name: p.split(' ')[0],
    amount: monthExpenses.filter(e => e.partner === p).reduce((s, e) => s + e.amount, 0),
  }));

  const handleAddExpense = () => {
    dispatch(addExpense({ ...expForm, amount: Number(expForm.amount), id: crypto.randomUUID(), createdAt: new Date().toISOString() }));
    setExpenseOpen(false);
    setExpForm({ partner: PARTNERS[0], amount: '', reason: '', category: EXPENSE_CATEGORIES[0], date: new Date().toISOString().split('T')[0], isCompanyExpense: true });
  };

  const handleAddIncome = () => {
    dispatch(addIncome({ ...incForm, amount: Number(incForm.amount), id: crypto.randomUUID(), createdAt: new Date().toISOString() }));
    setIncomeOpen(false);
    setIncForm({ amount: '', source: '', date: new Date().toISOString().split('T')[0] });
  };

  const StatCard = ({ title, value, icon: Icon, type }: { title: string; value: number; icon: any; type: 'income' | 'expense' | 'profit' }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5 glow-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">₹{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl ${type === 'income' ? 'bg-success/20 text-success' : type === 'expense' ? 'bg-destructive/20 text-destructive' : netProfit >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Expenses & Income</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIncomeOpen(true)} variant="outline"><Plus className="w-4 h-4 mr-2" />Income</Button>
          <Button onClick={() => setExpenseOpen(true)}><Plus className="w-4 h-4 mr-2" />Expense</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Income (This Month)" value={totalIncome} icon={TrendingUp} type="income" />
        <StatCard title="Total Expenses (This Month)" value={totalExpense} icon={TrendingDown} type="expense" />
        <StatCard title="Net Profit (This Month)" value={netProfit} icon={DollarSign} type="profit" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
          <h3 className="font-semibold mb-4">Partner Expense Share</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={partnerData}>
              <XAxis dataKey="name" stroke="hsl(0,0%,55%)" fontSize={12} />
              <YAxis stroke="hsl(0,0%,55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0,0%,7%)', border: '1px solid hsl(0,0%,15%)', borderRadius: '8px' }} />
              <Bar dataKey="amount" fill="hsl(263,70%,58%)" radius={[4, 4, 0, 0]} />
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
              <Tooltip contentStyle={{ background: 'hsl(0,0%,7%)', border: '1px solid hsl(0,0%,15%)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Partner Tabs */}
      <Tabs defaultValue={PARTNERS[0]} className="glass-card p-5">
        <TabsList className="bg-muted mb-4">
          {PARTNERS.map(p => <TabsTrigger key={p} value={p} className="text-xs sm:text-sm">{p.split(' ')[0]}</TabsTrigger>)}
        </TabsList>
        {PARTNERS.map(p => (
          <TabsContent key={p} value={p}>
            <div className="mb-3 text-sm text-muted-foreground">
              Total: ₹{expenses.filter(e => e.partner === p).reduce((s, e) => s + e.amount, 0).toLocaleString()}
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Date</TableHead><TableHead>Reason</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.filter(e => e.partner === p).sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                  <TableRow key={e.id} className="border-border">
                    <TableCell>{e.date}</TableCell>
                    <TableCell>{e.reason}</TableCell>
                    <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{e.category}</span></TableCell>
                    <TableCell className="font-medium">₹{e.amount.toLocaleString()}</TableCell>
                    <TableCell><button onClick={() => dispatch(deleteExpense(e.id))} className="p-1 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button></TableCell>
                  </TableRow>
                ))}
                {expenses.filter(e => e.partner === p).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No expenses</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Expense Dialog */}
      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Partner</Label>
              <Select value={expForm.partner} onValueChange={v => setExpForm(f => ({ ...f, partner: v as Partner }))}>
                <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{PARTNERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input type="number" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Reason</Label>
              <Input value={expForm.reason} onChange={e => setExpForm(f => ({ ...f, reason: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={expForm.category} onValueChange={v => setExpForm(f => ({ ...f, category: v as ExpenseCategory }))}>
                <SelectTrigger className="bg-background border-border mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={expForm.date} onChange={e => setExpForm(f => ({ ...f, date: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <Button onClick={handleAddExpense} className="w-full">Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Income Dialog */}
      <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Add Income</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (₹)</Label>
              <Input type="number" value={incForm.amount} onChange={e => setIncForm(f => ({ ...f, amount: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Source</Label>
              <Input value={incForm.source} onChange={e => setIncForm(f => ({ ...f, source: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={incForm.date} onChange={e => setIncForm(f => ({ ...f, date: e.target.value }))} className="bg-background border-border mt-1" />
            </div>
            <Button onClick={handleAddIncome} className="w-full">Add Income</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
