<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <p class="text-zinc-300 text-lg">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const message = ref('Concluindo login com o Google...');
const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
  // access token vem no fragment (#access_token=...) — não trafega para servidores
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const token = hash.get('access_token');

  if (!token) {
    message.value = 'Não recebemos o token do Google. Tente entrar novamente.';
    return;
  }

  try {
    await auth.loginWithGoogle(token);
    // volta para onde o usuário estava antes do Google (ex.: página do convite)
    const redirect = sessionStorage.getItem('planner.auth_redirect');
    sessionStorage.removeItem('planner.auth_redirect');
    router.replace(redirect ?? '/');
  } catch {
    message.value = 'Não foi possível concluir o login. Tente novamente.';
  }
});
</script>
