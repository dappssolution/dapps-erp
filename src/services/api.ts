import { supabase } from '@/integrations/supabase/client';
import { BusinessNumber, Expense, Income, LeaveRecord } from '@/types';

const getUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return session.user.id;
};

// ==================== Business Numbers ====================
export const businessNumbersApi = {
  getAll: async (): Promise<BusinessNumber[]> => {
    const { data, error } = await supabase.from('business_numbers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(r => ({
      id: r.id, businessName: r.business_name, agentName: r.agent_name, role: r.role,
      number: r.number, number2: r.number2, location: r.location,
      requirements: r.requirements as any, description: r.description,
      createdAt: r.created_at, updatedAt: r.updated_at,
    }));
  },
  create: async (item: BusinessNumber): Promise<BusinessNumber> => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('business_numbers').insert({
      user_id: userId, business_name: item.businessName, agent_name: item.agentName,
      role: item.role, number: item.number, number2: item.number2, location: item.location,
      requirements: item.requirements, description: item.description,
    }).select().single();
    if (error) throw error;
    return { ...item, id: data.id, createdAt: data.created_at, updatedAt: data.updated_at };
  },
  update: async (item: BusinessNumber): Promise<BusinessNumber> => {
    const { error } = await supabase.from('business_numbers').update({
      business_name: item.businessName, agent_name: item.agentName, role: item.role,
      number: item.number, number2: item.number2, location: item.location,
      requirements: item.requirements, description: item.description,
    }).eq('id', item.id);
    if (error) throw error;
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('business_numbers').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== Expenses ====================
export const expensesApi = {
  getAll: async (): Promise<Expense[]> => {
    const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(r => ({
      id: r.id, partner: r.partner as any, amount: Number(r.amount), reason: r.reason,
      category: r.category as any, date: r.date, isCompanyExpense: r.is_company_expense,
      createdAt: r.created_at,
    }));
  },
  create: async (item: Expense): Promise<Expense> => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('expenses').insert({
      user_id: userId, partner: item.partner, amount: item.amount, reason: item.reason,
      category: item.category, date: item.date, is_company_expense: item.isCompanyExpense,
    }).select().single();
    if (error) throw error;
    return { ...item, id: data.id, createdAt: data.created_at };
  },
  update: async (item: Expense): Promise<Expense> => {
    const { error } = await supabase.from('expenses').update({
      partner: item.partner, amount: item.amount, reason: item.reason,
      category: item.category, date: item.date, is_company_expense: item.isCompanyExpense,
    }).eq('id', item.id);
    if (error) throw error;
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== Income ====================
export const incomeApi = {
  getAll: async (): Promise<Income[]> => {
    const { data, error } = await supabase.from('incomes').select('*').order('date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(r => ({
      id: r.id, amount: Number(r.amount), source: r.source, date: r.date, createdAt: r.created_at,
    }));
  },
  create: async (item: Income): Promise<Income> => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('incomes').insert({
      user_id: userId, amount: item.amount, source: item.source, date: item.date,
    }).select().single();
    if (error) throw error;
    return { ...item, id: data.id, createdAt: data.created_at };
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== Leave ====================
export const leaveApi = {
  getAll: async (): Promise<LeaveRecord[]> => {
    const { data, error } = await supabase.from('leaves').select('*').order('date', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(r => ({
      id: r.id, partner: r.partner as any, date: r.date,
      leaveType: r.leave_type as any, reason: r.reason, createdAt: r.created_at,
    }));
  },
  create: async (item: LeaveRecord): Promise<LeaveRecord> => {
    const userId = await getUserId();
    const { data, error } = await supabase.from('leaves').insert({
      user_id: userId, partner: item.partner, date: item.date,
      leave_type: item.leaveType, reason: item.reason,
    }).select().single();
    if (error) throw error;
    return { ...item, id: data.id, createdAt: data.created_at };
  },
  update: async (item: LeaveRecord): Promise<LeaveRecord> => {
    const { error } = await supabase.from('leaves').update({
      partner: item.partner, date: item.date, leave_type: item.leaveType, reason: item.reason,
    }).eq('id', item.id);
    if (error) throw error;
    return item;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('leaves').delete().eq('id', id);
    if (error) throw error;
  },
};
