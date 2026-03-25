import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Expense, Income } from '@/types';
import { expensesApi, incomeApi } from '@/services/api';
import { toast } from 'sonner';

interface ExpenseState {
  expenses: Expense[];
  incomes: Income[];
  loading: boolean;
}

const initialState: ExpenseState = { expenses: [], incomes: [], loading: false };

export const fetchExpenses = createAsyncThunk('expense/fetchAll', async (_, { rejectWithValue }) => {
  try { return await expensesApi.getAll(); } catch (e: any) { toast.error('Failed to load expenses: ' + e.message); return rejectWithValue(e.message); }
});
export const addExpense = createAsyncThunk('expense/add', async (item: Expense, { rejectWithValue }) => {
  try { const result = await expensesApi.create(item); toast.success('Expense added!'); return result; } catch (e: any) { toast.error('Failed to add expense: ' + e.message); return rejectWithValue(e.message); }
});
export const updateExpense = createAsyncThunk('expense/update', async (item: Expense, { rejectWithValue }) => {
  try { const result = await expensesApi.update(item); toast.success('Expense updated!'); return result; } catch (e: any) { toast.error('Failed to update: ' + e.message); return rejectWithValue(e.message); }
});
export const deleteExpense = createAsyncThunk('expense/delete', async (id: string, { rejectWithValue }) => {
  try { await expensesApi.delete(id); toast.success('Expense deleted!'); return id; } catch (e: any) { toast.error('Failed to delete: ' + e.message); return rejectWithValue(e.message); }
});

export const fetchIncomes = createAsyncThunk('expense/fetchIncomes', async (_, { rejectWithValue }) => {
  try { return await incomeApi.getAll(); } catch (e: any) { toast.error('Failed to load incomes: ' + e.message); return rejectWithValue(e.message); }
});
export const addIncome = createAsyncThunk('expense/addIncome', async (item: Income, { rejectWithValue }) => {
  try { const result = await incomeApi.create(item); toast.success('Income added!'); return result; } catch (e: any) { toast.error('Failed to add income: ' + e.message); return rejectWithValue(e.message); }
});
export const deleteIncome = createAsyncThunk('expense/deleteIncome', async (id: string, { rejectWithValue }) => {
  try { await incomeApi.delete(id); toast.success('Income deleted!'); return id; } catch (e: any) { toast.error('Failed to delete: ' + e.message); return rejectWithValue(e.message); }
});

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (s) => { s.loading = true; })
      .addCase(fetchExpenses.fulfilled, (s, a) => { s.expenses = a.payload; s.loading = false; })
      .addCase(fetchExpenses.rejected, (s) => { s.loading = false; })
      .addCase(addExpense.fulfilled, (s, a) => { s.expenses.push(a.payload); })
      .addCase(updateExpense.fulfilled, (s, a) => {
        const idx = s.expenses.findIndex(i => i.id === a.payload.id);
        if (idx >= 0) s.expenses[idx] = a.payload;
      })
      .addCase(deleteExpense.fulfilled, (s, a) => { s.expenses = s.expenses.filter(i => i.id !== a.payload); })
      .addCase(fetchIncomes.fulfilled, (s, a) => { s.incomes = a.payload; })
      .addCase(addIncome.fulfilled, (s, a) => { s.incomes.push(a.payload); })
      .addCase(deleteIncome.fulfilled, (s, a) => { s.incomes = s.incomes.filter(i => i.id !== a.payload); });
  },
});

export default expenseSlice.reducer;
