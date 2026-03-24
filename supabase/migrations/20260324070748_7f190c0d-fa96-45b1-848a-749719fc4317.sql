-- Create timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================== Business Numbers ====================
CREATE TABLE public.business_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL DEFAULT '',
  agent_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  number TEXT NOT NULL DEFAULT '',
  number2 TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.business_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own business numbers" ON public.business_numbers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own business numbers" ON public.business_numbers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own business numbers" ON public.business_numbers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own business numbers" ON public.business_numbers FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_business_numbers_updated_at BEFORE UPDATE ON public.business_numbers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== Expenses ====================
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_company_expense BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- ==================== Incomes ====================
CREATE TABLE public.incomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own incomes" ON public.incomes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own incomes" ON public.incomes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own incomes" ON public.incomes FOR DELETE USING (auth.uid() = user_id);

-- ==================== Leaves ====================
CREATE TABLE public.leaves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  leave_type TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own leaves" ON public.leaves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own leaves" ON public.leaves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own leaves" ON public.leaves FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own leaves" ON public.leaves FOR DELETE USING (auth.uid() = user_id);