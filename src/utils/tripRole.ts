import type { Component } from 'vue';
import { Crown, CircleCheck, CircleDashed } from 'lucide-vue-next';
import type { ApiTrip } from '@/types/api';

export type TripRole = 'owner' | 'guest' | 'pending';

/** Papel do usuário na viagem: organizador, participante confirmado ou convite pendente */
export const getMyRole = (trip: ApiTrip, userId?: string): TripRole | null => {
  if (!userId) return null;
  if (trip.ownerId === userId) return 'owner';
  const me = trip.participants?.find((p) => p.accountId === userId);
  return me ? (me.isConfirmed ? 'guest' : 'pending') : null;
};

export const ROLE_LABEL: Record<TripRole, string> = {
  owner: 'Organizador',
  guest: 'Convidado',
  pending: 'Convite pendente',
};

export const ROLE_ICON: Record<TripRole, Component> = {
  owner: Crown,
  guest: CircleCheck,
  pending: CircleDashed,
};

export const ROLE_STYLE: Record<TripRole, string> = {
  owner: 'bg-lime-300/15 text-lime-300 border-lime-300/30',
  guest: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  pending: 'bg-zinc-800 text-zinc-400 border-dashed border-zinc-600',
};
