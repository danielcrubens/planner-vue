<template>
  <div v-if="props.isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="w-full max-w-md rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">Entrar na aplicação</h2>
        <Button variant="ghost" @click="$emit('closer')">
          <X class="size-5 text-zinc-400" />
        </Button>
      </div>

      <Button
        type="Button"
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
      </Button>

      <div class="flex items-center gap-3 text-zinc-500 text-xs">
        <div class="h-px flex-1 bg-zinc-800" />
        ou
        <div class="h-px flex-1 bg-zinc-800" />
      </div>

      <form v-if="!linkSent" @submit.prevent="sendMagicLink" class="space-y-3">
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
          <Mail class="text-zinc-400 size-5" />
          <input
            v-model="email"
            type="email"
            placeholder="Seu e-mail (qualquer provedor)"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1"
            @input="errorMessage = ''"
          />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-xs">{{ errorMessage }}</p>

        <Button type="submit" variant="primary" size="full" :disabled="isSending">
          {{ isSending ? 'Enviando...' : 'Enviar acesso' }}
        </Button>
      </form>

      <div v-else class="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-center space-y-1">
        <p class="text-lime-300 text-sm font-medium">Link enviado! ✉️</p>
        <p class="text-zinc-400 text-xs">
          Enviamos um link de acesso para <span class="text-zinc-200">{{ email }}</span>.
          Ele é válido por 15 minutos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Mail, X } from 'lucide-vue-next';
import { z } from 'zod';
import Button from '@/components/Button/Button.vue';
import { api, API_BASE_URL } from '@/services/api/axios';
import { errorMessage as toMessage } from '@/store/tripStore';

const props = defineProps<{ isOpen: boolean }>();
defineEmits<{ (e: 'closer'): void }>();

const route = useRoute();
const email = ref('');
const isSending = ref(false);
const errorMessage = ref('');
const linkSent = ref(false);

const emailSchema = z.string().email('O e-mail fornecido não é válido');

const goGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

const sendMagicLink = async () => {
  const parsed = emailSchema.safeParse(email.value.trim());
  if (!parsed.success) {
    errorMessage.value = parsed.error.errors[0].message;
    return;
  }

  isSending.value = true;
  errorMessage.value = '';
  try {
    // resposta é sempre 204 — não revela se o e-mail já tem conta.
    // redirect viaja DENTRO do link (sobrevive a outras abas/janelas).
    await api.post('/auth/magic-link', {
      email: email.value.trim(),
      redirect: route.fullPath,
    });
    linkSent.value = true;
  } catch (e) {
    errorMessage.value = toMessage(e);
  } finally {
    isSending.value = false;
  }
};
</script>
