// 🔧 Service layer: Currently uses localStorage.
// To connect to MongoDB, replace each function body with fetch() calls to your Express API.
// Example: const res = await fetch(`${API_BASE}/business-numbers`); return res.json();

// 🔧 Uncomment and set your API base URL when you connect MongoDB:
// const API_BASE = "http://localhost:5000/api";

import { BusinessNumber, Expense, Income, LeaveRecord } from '@/types';

const getStore = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStore = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ==================== Business Numbers ====================
export const businessNumbersApi = {
  getAll: async (): Promise<BusinessNumber[]> => {
    // 🔧 MongoDB: return (await fetch(`${API_BASE}/business-numbers`)).json();
    return getStore<BusinessNumber>('businessNumbers');
  },
  create: async (item: BusinessNumber): Promise<BusinessNumber> => {
    // 🔧 MongoDB: return (await fetch(`${API_BASE}/business-numbers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(item) })).json();
    const items = getStore<BusinessNumber>('businessNumbers');
    items.push(item);
    setStore('businessNumbers', items);
    return item;
  },
  update: async (item: BusinessNumber): Promise<BusinessNumber> => {
    const items = getStore<BusinessNumber>('businessNumbers');
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item;
    setStore('businessNumbers', items);
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const items = getStore<BusinessNumber>('businessNumbers').filter(i => i.id !== id);
    setStore('businessNumbers', items);
  },
};

// ==================== Expenses ====================
export const expensesApi = {
  getAll: async (): Promise<Expense[]> => getStore<Expense>('expenses'),
  create: async (item: Expense): Promise<Expense> => {
    const items = getStore<Expense>('expenses');
    items.push(item);
    setStore('expenses', items);
    return item;
  },
  update: async (item: Expense): Promise<Expense> => {
    const items = getStore<Expense>('expenses');
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item;
    setStore('expenses', items);
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const items = getStore<Expense>('expenses').filter(i => i.id !== id);
    setStore('expenses', items);
  },
};

// ==================== Income ====================
export const incomeApi = {
  getAll: async (): Promise<Income[]> => getStore<Income>('incomes'),
  create: async (item: Income): Promise<Income> => {
    const items = getStore<Income>('incomes');
    items.push(item);
    setStore('incomes', items);
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const items = getStore<Income>('incomes').filter(i => i.id !== id);
    setStore('incomes', items);
  },
};

// ==================== Leave ====================
export const leaveApi = {
  getAll: async (): Promise<LeaveRecord[]> => getStore<LeaveRecord>('leaves'),
  create: async (item: LeaveRecord): Promise<LeaveRecord> => {
    const items = getStore<LeaveRecord>('leaves');
    items.push(item);
    setStore('leaves', items);
    return item;
  },
  update: async (item: LeaveRecord): Promise<LeaveRecord> => {
    const items = getStore<LeaveRecord>('leaves');
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) items[idx] = item;
    setStore('leaves', items);
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const items = getStore<LeaveRecord>('leaves').filter(i => i.id !== id);
    setStore('leaves', items);
  },
};
