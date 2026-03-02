import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Expense, Income } from '@/types';
import { expensesApi, incomeApi } from '@/services/api';

interface ExpenseState {
  expenses: Expense[];
  incomes: Income[];
  loading: boolean;
}

const initialState: ExpenseState = { expenses: [], incomes: [], loading: false };

export const fetchExpenses = createAsyncThunk('expense/fetchAll', () => expensesApi.getAll());
export const addExpense = createAsyncThunk('expense/add', (item: Expense) => expensesApi.create(item));
export const updateExpense = createAsyncThunk('expense/update', (item: Expense) => expensesApi.update(item));
export const deleteExpense = createAsyncThunk('expense/delete', async (id: string) => { await expensesApi.delete(id); return id; });

export const fetchIncomes = createAsyncThunk('expense/fetchIncomes', () => incomeApi.getAll());
export const addIncome = createAsyncThunk('expense/addIncome', (item: Income) => incomeApi.create(item));
export const deleteIncome = createAsyncThunk('expense/deleteIncome', async (id: string) => { await incomeApi.delete(id); return id; });

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (s) => { s.loading = true; })
      .addCase(fetchExpenses.fulfilled, (s, a) => { s.expenses = a.payload; s.loading = false; })
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
