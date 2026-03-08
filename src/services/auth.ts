// 🔧 Hardcoded credentials — change these or move to backend later
const DEFAULT_EMAIL = 'saleelvt57@gmail.com';
const DEFAULT_PASSWORD = 'saleel@1212';
const TOKEN_KEY = 'crm_auth_token';
const SESSION_HOURS = 24;

interface AuthToken {
  email: string;
  exp: number; // expiry timestamp
}

export const authService = {
  login(email: string, password: string): boolean {
    if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      const token: AuthToken = {
        email,
        exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return false;
    try {
      const token: AuthToken = JSON.parse(raw);
      if (Date.now() > token.exp) {
        localStorage.removeItem(TOKEN_KEY);
        return false;
      }
      return true;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
  },

  getEmail(): string | null {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw).email;
    } catch {
      return null;
    }
  },

  getRemainingMs(): number {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return 0;
    try {
      const token: AuthToken = JSON.parse(raw);
      return Math.max(0, token.exp - Date.now());
    } catch {
      return 0;
    }
  },
};
