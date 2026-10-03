<template>
  <div class="space-y-6 mt-7 md:mt-0">
      <h2 class="font-semibold text-xl">Links importantes</h2>

      <div class="space-y-5">
        <div v-for="link in links" :key="link.id" class="flex items-center justify-between gap-4">
          <div class="space-y-1.5 min-w-0">
            <span class="block font-medium text-zinc-100">{{ link.title }}</span>
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-xs text-zinc-400 truncate hover:text-zinc-200"
            >
              {{ link.url }}
            </a>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">
              <Link2 class="text-zinc-400 size-5 hover:text-zinc-200" />
            </a>
            <button v-if="isOwner" type="button" @click="removeLink(link.id)">
              <X class="text-zinc-400 size-4 hover:text-zinc-200" />
            </button>
          </div>
        </div>
        <p v-if="links.length === 0" class="text-sm text-zinc-400">Nenhum link cadastrado ainda.</p>
      </div>

      <p v-if="linkError" class="text-red-500 text-xs">{{ linkError }}</p>

      <Button v-if="isOwner" variant="secondary" size="full" @click="isFormOpen = !isFormOpen">
        <Plus class="size-5" />
        Cadastrar novo link
      </Button>

      <form v-if="isFormOpen" @submit.prevent="submitLink" class="space-y-3">
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
          <CalendarClock class="text-zinc-400 size-5" />
          <input
            v-model="form.title"
            type="text"
            placeholder="Título do link"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1"
          />
        </div>
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
          <Link2 class="text-zinc-400 size-5" />
          <input
            v-model="form.url"
            type="url"
            placeholder="URL"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1"
          />
          <div v-if="formError" class="text-red-500 px-2 text-xs absolute -bottom-1">{{ formError }}</div>
        </div>
        <Button type="submit" variant="primary" size="full" :disabled="isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar link' }}
        </Button>
      </form>
    </div>
</template>

<script setup>
  import { computed, reactive, ref } from "vue";
  import { Plus, Link2, X, CalendarClock } from "lucide-vue-next";
  import Button from "../components/Button/Button.vue";
  import { useTripStore } from '@/store/tripStore';
  import { useAuthStore } from '@/store/authStore';
  import { errorMessage as toMessage } from '@/store/tripStore';

  const tripStore = useTripStore();
  const auth = useAuthStore();

  const isFormOpen = ref(false);
  const isSaving = ref(false);
  const formError = ref('');
  const linkError = ref('');
  const form = reactive({ title: '', url: '' });

  const links = computed(() => tripStore.trip?.links ?? []);
  const isOwner = computed(() => tripStore.trip?.ownerId === auth.user?.id);

  const submitLink = async () => {
    formError.value = '';
    if (!form.title.trim() || !form.url.trim()) {
      formError.value = 'Informe título e URL';
      return;
    }
    isSaving.value = true;
    try {
      await tripStore.addLink(tripStore.trip.id, { title: form.title.trim(), url: form.url.trim() });
      form.title = '';
      form.url = '';
      isFormOpen.value = false;
    } catch (e) {
      formError.value = toMessage(e);
    } finally {
      isSaving.value = false;
    }
  };

  const removeLink = async (linkId) => {
    linkError.value = '';
    try {
      await tripStore.removeLink(linkId);
    } catch (e) {
      linkError.value = toMessage(e);
    }
  };
</script>
