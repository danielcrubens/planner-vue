<template>
  <div class="fixed top-6 right-6 z-40">
    <button
      v-if="auth.user"
      @click="logout"
      class="flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors"
    >
      <LogOut class="size-4" />
      Sair
    </button>
    <button
      v-else
      @click="emit('login')"
      class="flex items-center gap-2 text-sm text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg px-4 py-2 transition-colors"
    >
      <LogIn class="size-4" />
      Entrar
    </button>
  </div>
</template>

<script setup lang="ts">
import { LogIn, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/store/authStore';

const emit = defineEmits<{ (e: 'login'): void }>();
const auth = useAuthStore();

const logout = async () => {
  await auth.logout();
  window.location.assign('/');
};
</script>
