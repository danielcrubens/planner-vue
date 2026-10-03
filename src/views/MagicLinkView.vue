<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <div class="max-w-md w-full px-6 text-center space-y-4">
      <img src="/logo.svg" alt="plann.er" class="mx-auto" />

      <p v-if="status === 'loading'" class="text-zinc-300 text-lg">Validando seu link de acesso...</p>

      <div v-else-if="status === 'error'" class="rounded-xl bg-zinc-900 shadow-shape p-6 space-y-3">
        <p class="text-red-500">{{ message }}</p>
        <RouterLink to="/" class="text-lime-300 underline text-sm">Voltar para o plann.er</RouterLink>
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

const status = ref<'loading' | 'error'>('loading');
const message = ref('');

onMounted(async () => {
  const token = route.params.token as string;
  try {
    // redirect vem gravado no próprio token (sobrevive a outras abas);
    // sessionStorage é só o fallback legado.
    const redirect = await auth.verifyMagicLink(token);
    router.replace(redirect ?? sessionStorage.getItem('planner.auth_redirect') ?? '/');
    sessionStorage.removeItem('planner.auth_redirect');
  } catch {
    status.value = 'error';
    message.value = 'Link de acesso inválido ou expirado. Solicite um novo na página de login.';
  }
});
</script>
