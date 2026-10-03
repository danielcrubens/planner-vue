<template>
  <div v-if="props.isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="w-full max-w-md rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">Entrar na aplicação</h2>
        <button @click="$emit('closer')">
          <X class="size-5 text-zinc-400" />
        </button>
      </div>

      <p class="text-sm text-zinc-400">
        Faça login com sua conta Google para convidar amigos e planejar sua viagem.
      </p>

      <button
        type="button"
        class="w-full h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center gap-3 text-zinc-100 font-medium hover:bg-zinc-800 transition-colors"
        @click="goGoogle"
      >
        <svg viewBox="0 0 24 24" class="size-5" aria-hidden="true">
          <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 1.8 14.96.75 12 .75 7.62.75 3.84 3.27 1.98 6.96l3.66 2.84C6.54 7.14 9.03 5.04 12 5.04z" />
          <path fill="#4285F4" d="M23.25 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.68 2.85c2.15-1.99 3.5-4.92 3.5-8.67z" />
          <path fill="#FBBC05" d="M5.64 14.2a6.9 6.9 0 0 1 0-4.4L1.98 6.96a11.26 11.26 0 0 0 0 10.08l3.66-2.84z" />
          <path fill="#34A853" d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.68-2.85c-1.02.69-2.33 1.1-3.78 1.1-2.97 0-5.46-2.1-6.36-4.97l-3.66 2.84C3.84 20.73 7.62 23.25 12 23.25z" />
        </svg>
        Entrar com Google
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { API_BASE_URL } from '@/services/api/axios';

const props = defineProps<{ isOpen: boolean }>();
defineEmits<{ (e: 'closer'): void }>();

const goGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};
</script>
