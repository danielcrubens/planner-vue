// Contratos das respostas da API plann.er (ver backend/planner — Swagger em /api/docs)

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiParticipant {
  id: string;
  tripId: string;
  email: string;
  name?: string | null;
  isOwner: boolean;
  isConfirmed: boolean;
  accountId?: string | null;
  createdAt: string;
}

export interface ApiActivity {
  id: string;
  tripId: string;
  title: string;
  occursAt: string;
  createdAt: string;
}

export interface ApiLink {
  id: string;
  tripId: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface ApiTrip {
  id: string;
  destination: string;
  startsAt: string;
  endsAt: string;
  ownerId: string;
  participants: ApiParticipant[];
  activities: ApiActivity[];
  links: ApiLink[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiTripSummary {
  id: string;
  destination: string;
  startsAt: string;
  endsAt: string;
  ownerId: string;
  owner: Pick<ApiUser, 'id' | 'name' | 'email'>;
  counts: { participants: number; activities: number; links: number };
}

export interface ApiPaginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/** Erro padrão do AllExceptionsFilter do backend */
export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
}
