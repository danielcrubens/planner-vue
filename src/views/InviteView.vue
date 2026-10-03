<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <div class="max-w-md w-full px-6 text-center space-y-6">
      <img src="/logo.svg" alt="plann.er" class="mx-auto" />

      <p v-if="isLoading" class="text-zinc-400 text-lg">Carregando convite...</p>

      <div v-else-if="error" class="rounded-xl bg-zinc-900 shadow-shape p-6 space-y-3">
        <p class="text-red-500">{{ error }}</p>
        <RouterLink to="/" class="text-lime-300 underline text-sm">Ir para o plann.er</RouterLink>
      </div>

      <div v-else-if="invite" class="rounded-xl bg-zinc-900 shadow-shape p-6 space-y-4">
        <p class="text-zinc-400">
          Você foi convidado para participar da viagem:
        </p>
        <h1 class="text-2xl font-semibold text-zinc-100">{{ invite.trip.destination }}</h1>
        <p class="text-zinc-400 text-sm">{{ formatDateRange(invite.trip) }}</p>
        <p class="text-zinc-500 text-xs">Convite enviado para {{ invite.email }}</p>

        <p v-if="acceptError" class="text-red-500 text-xs">{{ acceptError }}</p>

        <Button variant="primary" size="full" :disabled="isAccepting" @click="accept">
          {{ isAccepting ? 'Aceitando...' : 'Aceitar convite' }}
        </Button>
      </div>
    </div>

    <AuthModal :isOpen="isAuthModalOpen" @closer="isAuthModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { format } from 'date-fns';
import Button from '@/components/Button/Button.vue';
import AuthModal from '@/components/Modal/AuthModal.vue';
import { api } from '@/services/api/axios';
import { useAuthStore } from '@/store/authStore';
import { errorMessage as toMessage } from '@/store/tripStore';

interface InvitePreview {
  email: string;
  trip: { destination: string; startsAt: string; endsAt: string };
}

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const invite = ref<InvitePreview | null>(null);
const isLoading = ref(true);
const error = ref('');
const acceptError = ref('');
const isAccepting = ref(false);
const isAuthModalOpen = ref(false);

const token = route.params.token as string;
const REDIRECT_KEY = 'planner.auth_redirect';

const formatDateRange = (trip: InvitePreview['trip']) => {
  const start = format(new Date(trip.startsAt), 'dd/MM/yyyy');
  const end = format(new Date(trip.endsAt), 'dd/MM/yyyy');
  return end === start ? start : `${start} a ${end}`;
};

onMounted(async () => {
  try {
    const { data } = await api.get<InvitePreview>(`/invites/${token}`);
    invite.value = data;
  } catch (e) {
    error.value = toMessage(e);
  } finally {
    isLoading.value = false;
  }
});

const accept = async () => {
  acceptError.value = '';

  // Sem sessão: guarda para onde voltar depois do Google e pede login.
  if (!auth.isAuthenticated) {
    sessionStorage.setItem(REDIRECT_KEY, route.fullPath);
    isAuthModalOpen.value = true;
    return;
  }

  isAccepting.value = true;
  try {
    const { data } = await api.post<{ tripId: string }>(`/invites/${token}/accept`);
    router.replace(`/trips/${data.tripId}`);
  } catch (e) {
    acceptError.value = toMessage(e);
    isAuthModalOpen.value = false;
  } finally {
    isAccepting.value = false;
  }
};
</script>
