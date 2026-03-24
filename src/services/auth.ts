import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async login(email: string, password: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async getEmail(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.email ?? null;
  },
};
