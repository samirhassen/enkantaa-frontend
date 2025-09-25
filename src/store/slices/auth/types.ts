export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { name: string } | null;
  loading: boolean;
  error: string | null;
  initializing: boolean;
}
