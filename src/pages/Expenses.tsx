import { useEffect, useState } from 'react';
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
import ExpenseCharts from '@/components/expenses/ExpenseCharts';
import ExpenseStats from '@/components/expenses/ExpenseStats';
import IncomeList from '@/components/expenses/IncomeList';

export default function Expenses() {
  const dispatch = useAppDispatch();
  const { expenses, incomes } = useAppSelector(s => s.expense);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [filterPartner, setFilterPartner] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
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

  // Filtered expenses for the list
  const filteredExpenses = expenses.filter(e => {
    const partnerMatch = filterPartner === 'all' || e.partner === filterPartner;
    const monthMatch = filterMonth === 'all' || e.date.substring(0, 7) === filterMonth;
    return partnerMatch && monthMatch;
  });

  // Get unique months from expenses
  const uniqueMonths = [...new Set(expenses.map(e => e.date.substring(0, 7)))].sort().reverse();

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
      <ExpenseStats totalIncome={totalIncome} totalExpense={totalExpense} netProfit={netProfit} />

      {/* Charts */}
      <ExpenseCharts expenses={monthExpenses} />

      {/* Filters */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <h2 className="font-semibold text-lg">All Expenses</h2>
          <div className="flex gap-3 flex-wrap">
            <Select value={filterPartner} onValueChange={setFilterPartner}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Filter partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                {PARTNERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Filter month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {uniqueMonths.map(m => <SelectItem key={m} value={m}>{new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-3 text-sm text-muted-foreground">
          Showing {filteredExpenses.length} expenses · Total: ₹{filteredExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Date</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.sort((a, b) => b.date.localeCompare(a.date)).map(e => (
              <TableRow key={e.id} className="border-border">
                <TableCell>{e.date}</TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{e.partner}</span>
                </TableCell>
                <TableCell>{e.reason}</TableCell>
                <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{e.category}</span></TableCell>
                <TableCell className="font-medium text-destructive">₹{e.amount.toLocaleString()}</TableCell>
                <TableCell><button onClick={() => dispatch(deleteExpense(e.id))} className="p-1 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button></TableCell>
              </TableRow>
            ))}
            {filteredExpenses.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No expenses found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Income List */}
      <IncomeList incomes={incomes} onDelete={(id) => dispatch(deleteIncome(id))} />

      {/* Partner Tabs - per partner summary */}
      <Tabs defaultValue={PARTNERS[0]} className="glass-card p-5">
        <h2 className="font-semibold text-lg mb-3">Partner-wise Breakdown</h2>
        <TabsList className="bg-muted mb-4">
          {PARTNERS.map(p => <TabsTrigger key={p} value={p} className="text-xs sm:text-sm">{p.split(' ')[0]}</TabsTrigger>)}
        </TabsList>
        {PARTNERS.map(p => {
          const partnerExpenses = expenses.filter(e => e.partner === p);
          const partnerTotal = partnerExpenses.reduce((s, e) => s + e.amount, 0);
          return (
            <TabsContent key={p} value={p}>
              <div className="mb-3 flex flex-wrap gap-4 text-sm">
                <span className="text-muted-foreground">Total Expenses: <strong className="text-foreground">₹{partnerTotal.toLocaleString()}</strong></span>
                <span className="text-muted-foreground">Entries: <strong className="text-foreground">{partnerExpenses.length}</strong></span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Date</TableHead><TableHead>Reason</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerExpenses.sort((a, b) => b.date.localeCompare(a.date)).map(e => (
                    <TableRow key={e.id} className="border-border">
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.reason}</TableCell>
                      <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{e.category}</span></TableCell>
                      <TableCell className="font-medium">₹{e.amount.toLocaleString()}</TableCell>
                      <TableCell><button onClick={() => dispatch(deleteExpense(e.id))} className="p-1 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button></TableCell>
                    </TableRow>
                  ))}
                  {partnerExpenses.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No expenses for {p}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          );
        })}
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
