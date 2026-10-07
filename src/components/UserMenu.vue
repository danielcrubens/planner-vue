<template>
  <div class="fixed top-6 right-6 left-6 z-40 flex items-center gap-2">
    <!-- Mobile: badge do papel do usuário ao lado do botão Sair (no desktop fica na barra de local/data) -->
    <span
      v-if="role"
      class="md:hidden inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
      :class="ROLE_STYLE[role]"
    >
      <component :is="ROLE_ICON[role]" class="size-3.5" />
      {{ ROLE_LABEL[role] }}
    </span>
    <Button
      v-if="auth.user"
      @click="logout"
      class="ml-auto flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors"
    >
      <LogOut class="size-4" />
      Sair
    </Button>
    <Button
      v-else
      @click="emit('login')"
      class="ml-auto flex items-center gap-2 text-sm text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg px-4 py-2 transition-colors"
    >
      <LogIn class="size-4" />
      Entrar
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { LogIn, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';
import { getMyRole, ROLE_ICON, ROLE_LABEL, ROLE_STYLE } from '@/utils/tripRole';
import Button from '@/components/Button/Button.vue';

const emit = defineEmits<{ (e: 'login'): void }>();
const auth = useAuthStore();
const tripStore = useTripStore();

const role = computed(() =>
  tripStore.trip && auth.user ? getMyRole(tripStore.trip, auth.user.id) : null,
);

const logout = async () => {
  await auth.logout();
  window.location.assign('/');
};
</script>
