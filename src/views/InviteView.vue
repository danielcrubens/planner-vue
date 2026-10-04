<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <div class="max-w-md w-full px-6 text-center space-y-5">
      <img src="/logo.svg" alt="plann.er" class="mx-auto" />

      <div v-if="state === 'loading'" class="space-y-3">
        <p class="text-zinc-300 text-lg">Entrando na viagem...</p>
        <div class="mx-auto size-6 border-2 border-zinc-600 border-t-lime-300 rounded-full animate-spin" />
      </div>

      <div v-else class="rounded-xl bg-zinc-900 shadow-shape p-6 space-y-4">
        <p :class="isFatal ? 'text-red-500' : 'text-zinc-300'">{{ message }}</p>

        <button
          v-if="code === 'EMAIL_MISMATCH'"
          type="button"
          class="w-full h-11 bg-lime-300 text-lime-950 rounded-lg font-medium hover:bg-lime-400 transition-colors"
          :disabled="isRetrying"
          @click="switchAccount"
        >
          {{ isRetrying ? 'Entrando...' : 'Entrar com o e-mail do convite' }}
        </button>

        <RouterLink
          v-else-if="code === 'INVITE_ALREADY_USED'"
          to="/"
          class="block h-11 leading-[2.75rem] bg-zinc-800 text-zinc-200 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
        >
          Ir para minhas viagens
        </RouterLink>

        <RouterLink
          v-else
          to="/"
          class="text-lime-300 underline text-sm inline-block"
        >
          Voltar para o plann.er
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const state = ref<'loading' | 'error'>('loading');
const code = ref('');
const message = ref('');
const isRetrying = ref(false);

// fatal = nenhuma ação local resolve; senão oferecemos caminho de saída
const isFatal = ref(true);

const token = route.params.token as string;

const friendly = (inviteCode: string): string => {
  switch (inviteCode) {
    case 'INVITE_EXPIRED':
      return 'Este convite expirou. Peça um novo convite ao organizador.';
    case 'INVITE_ALREADY_USED':
      return 'Este convite já foi utilizado. Se foi você quem aceitou, sua viagem está em "Suas viagens".';
    case 'INVITE_INVALID':
      return 'Este link de convite é inválido. Confira o link recebido por e-mail.';
    case 'EMAIL_MISMATCH':
      return 'Você está logado com um e-mail diferente do convidado.';
    default:
      return 'Não foi possível aceitar o convite. Tente novamente.';
  }
};

const accept = async () => {
  state.value = 'loading';
  try {
    const { tripId } = await auth.acceptInvite(token);
    router.replace(`/trips/${tripId}`);
  } catch (e) {
    code.value = (e as { response?: { data?: { code?: string } } }).response?.data?.code ?? '';
    message.value = friendly(code.value);
    isFatal.value = code.value !== 'EMAIL_MISMATCH' && code.value !== 'INVITE_ALREADY_USED';
    state.value = 'error';
  }
};

/** EMAIL_MISMATCH: sai da sessão atual e refaz o aceite com o e-mail do convite */
const switchAccount = async () => {
  isRetrying.value = true;
  await auth.logout();
  await accept();
};

onMounted(accept);
</script>
