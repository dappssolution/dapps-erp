// ==================== Business Numbers ====================
export const REQUIREMENT_OPTIONS = [
  'webDevelopment', 'appDevelopment', 'marketing', 'seo',
  'video', 'photo', 'eCommerce', 'erp', 'crm', 'aiServices'
] as const;

export type RequirementType = typeof REQUIREMENT_OPTIONS[number];

export interface BusinessNumber {
  id: string;
  businessName: string;
  agentName: string;
  role: string;
  number: string;
  number2: string;
  location: string;
  requirements: RequirementType[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Expenses ====================
export const PARTNERS = ['Saleel VT', 'Anfas Sir', 'Shamna Madam', 'Sabith Boss'] as const;
export type Partner = typeof PARTNERS[number];

export const EXPENSE_CATEGORIES = [
  'Office', 'Travel', 'Food', 'Software', 'Hardware', 'Marketing', 'Salary', 'Utilities', 'Miscellaneous'
] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export interface Expense {
  id: string;
  partner: Partner;
  amount: number;
  reason: string;
  category: ExpenseCategory;
  date: string;
  isCompanyExpense: boolean;
  createdAt: string;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  createdAt: string;
}

// ==================== Leave ====================
export const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Half Day', 'Absent'] as const;
export type LeaveType = typeof LEAVE_TYPES[number];

export interface LeaveRecord {
  id: string;
  partner: Partner;
  date: string;
  leaveType: LeaveType;
  reason: string;
  createdAt: string;
}
