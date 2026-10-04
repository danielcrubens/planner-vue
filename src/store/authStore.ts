import { defineStore } from 'pinia';
import { api } from '@/services/api/axios';
import type { ApiUser } from '@/types/api';

/** Uma única promessa compartilhada: evita refresh em paralelo por múltiplos guards. */
let ensurePromise: Promise<boolean> | null = null;

/**
 * Sessão do usuário: access token vive só em memória (XSS não rouba);
 * a renovação usa o cookie httpOnly via POST /auth/refresh.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as ApiUser | null,
    accessToken: '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },
  actions: {
    setSession(user: ApiUser, accessToken: string) {
      this.user = user;
      this.accessToken = accessToken;
    },

    async login(email: string, password: string) {
      const { data } = await api.post('/auth/login', { email, password });
      this.setSession(data.user, data.accessToken);
    },

    async register(name: string, email: string, password: string) {
      const { data } = await api.post('/auth/register', { name, email, password });
      this.setSession(data.user, data.accessToken);
    },

    async loginWithGoogle(accessToken: string) {
      this.accessToken = accessToken;
      const { data } = await api.get('/auth/me');
      this.user = data;
    },

    async verifyMagicLink(token: string): Promise<string | null> {
      const { data } = await api.post(`/auth/magic-link/${token}/verify`);
      this.setSession(data.user, data.accessToken);
      return data.redirect ?? null;
    },

    /** O link de convite é a credencial: aceite + sessão num passo só. */
    async acceptInvite(token: string): Promise<{ tripId: string }> {
      const { data } = await api.post(`/invites/${token}/accept`);
      this.setSession(data.user, data.accessToken);
      return { tripId: data.tripId };
    },

    async refresh() {
      const { data } = await api.post('/auth/refresh');
      this.accessToken = data.accessToken;
      const me = await api.get('/auth/me');
      this.user = me.data;
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch {
        // sessão já inválida — segue o logout local
      }
      this.user = null;
      this.accessToken = '';
    },

    /** Uma única promessa compartilhada: evita refresh em paralelo por múltiplos guards. */
    ensureAuth(): Promise<boolean> {
      if (!ensurePromise) {
        ensurePromise = this.isAuthenticated
          ? Promise.resolve(true)
          : this.refresh()
              .then(() => true)
              .catch(() => false)
              .finally(() => {
                setTimeout(() => (ensurePromise = null), 0);
              });
      }
      return ensurePromise;
    },
  },
});
