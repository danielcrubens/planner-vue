import type { ApiActivity } from './api';

export interface ActivityFormPayload {
  title: string;
  occurs_at: string;
}

export interface CreateActivityProps {
  closeCreateActivityModal: () => void;
  isCreateActivityModalOpen: boolean;
  submitActivity: (formData: ActivityFormPayload, activityId?: string) => void;
  /** presente = modo edição (modal pré-preenchido, PATCH em vez de POST) */
  activityToEdit?: ApiActivity | null;
  /** Período da viagem — restringe o seletor de data e exibe o intervalo */
  tripStartsAt?: string;
  tripEndsAt?: string;
}
