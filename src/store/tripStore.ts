import { defineStore } from 'pinia';
import { api } from '@/services/api/axios';
import type { ApiActivity, ApiLink, ApiPaginated, ApiParticipant, ApiTrip, ApiTripSummary } from '@/types/api';

export interface CreateTripPayload {
  destination: string;
  starts_at: string;
  ends_at: string;
  emails_to_invite?: string[];
}

/** Cache do servidor: as views leem daqui, as actions falam com a API. */
export const useTripStore = defineStore('trip', {
  state: () => ({
    trip: null as ApiTrip | null,
    trips: [] as ApiTripSummary[],
    isLoading: false,
    error: '' as string,
  }),
  actions: {
    async createTrip(payload: CreateTripPayload): Promise<ApiTrip> {
      const { data } = await api.post<ApiTrip>('/trips', payload);
      return data;
    },

    async fetchTrips(page = 1) {
      const { data } = await api.get<ApiPaginated<ApiTripSummary>>('/trips', { params: { page } });
      this.trips = data.data;
      return data;
    },

    async fetchTrip(id: string): Promise<ApiTrip> {
      this.isLoading = true;
      this.error = '';
      try {
        const { data } = await api.get<ApiTrip>(`/trips/${id}`);
        this.trip = data;
        return data;
      } catch (e) {
        this.trip = null;
        this.error = errorMessage(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async updateTrip(id: string, patch: { destination?: string; starts_at?: string; ends_at?: string }) {
      const { data } = await api.patch<ApiTrip>(`/trips/${id}`, patch);
      this.trip = data;
    },

    async addActivity(tripId: string, payload: { title: string; occurs_at: string }): Promise<ApiActivity> {
      const { data } = await api.post<ApiActivity>(`/trips/${tripId}/activities`, payload);
      this.trip?.activities.push(data);
      return data;
    },

    async invite(tripId: string, emails: string[]): Promise<ApiParticipant[]> {
      const { data } = await api.post(`/trips/${tripId}/invites`, { emails });
      if (this.trip) this.trip.participants = data.participants;
      return data.participants;
    },

    async removeParticipant(tripId: string, participantId: string) {
      await api.delete(`/trips/${tripId}/participants/${participantId}`);
      if (this.trip) {
        this.trip.participants = this.trip.participants.filter((p) => p.id !== participantId);
      }
    },

    async addLink(tripId: string, payload: { title: string; url: string }): Promise<ApiLink> {
      const { data } = await api.post<ApiLink>(`/trips/${tripId}/links`, payload);
      this.trip?.links.push(data);
      return data;
    },

    async removeLink(linkId: string) {
      await api.delete(`/links/${linkId}`);
      if (this.trip) {
        this.trip.links = this.trip.links.filter((l) => l.id !== linkId);
      }
    },
  },
});

export function errorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'response' in e) {
    const data = (e as { response?: { data?: { message?: string | string[] } } }).response?.data;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(', ') : data.message;
    }
  }
  // erro sem resposta (exceção local / rede): mensagem real em dev, genérica em prod
  if (e instanceof Error && e.message && import.meta.env.DEV) {
    return `Erro inesperado: ${e.message}`;
  }
  return 'Não foi possível concluir a operação. Tente novamente.';
}
