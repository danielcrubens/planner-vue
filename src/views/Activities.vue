<template>
  <div class="space-y-8">
    <div v-for="day in days" :key="day.date" class="space-y-2.5">
      <div class="space-x-2.5">
        <span class="text-zinc-100 text-lg font-bold">Dia {{ day.dayNumber }}</span>
        <span class="text-zinc-400 text-sm">{{ day.dayName }}</span>
      </div>
      <div
        v-for="activity in day.activities"
        :id="'activity-' + activity.id"
        :key="activity.id"
        class="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3 transition-colors"
        :class="{ 'ring-1 ring-lime-300/70 bg-zinc-800': activity.id === highlightId }"
      >
        <CircleCheck class="size-5 text-lime-300 shrink-0" />
        <span class="text-zinc-100">{{ activity.title }}</span>
        <span class="text-zinc-400 text-sm ml-auto">{{ formatHour(activity.occursAt) }}</span>
        <template v-if="isOwner">
          <Button variant="ghost" type="Button" @click="$emit('edit', activity)" aria-label="Editar atividade">
            <Pencil class="size-4 text-zinc-400 hover:text-zinc-200" />
          </Button>
          <Button
            variant="ghost"
            type="Button"
            :disabled="isRemoving === activity.id"
            @click="removeActivity(activity)"
            aria-label="Excluir atividade"
          >
            <Trash2 class="size-4 text-zinc-400 hover:text-red-400" />
          </Button>
        </template>
      </div>
    </div>

    <p v-if="removeError" class="text-red-500 text-xs">{{ removeError }}</p>

    <p v-if="days.length === 0" class="text-zinc-400 text-sm">
      Nenhuma atividade cadastrada ainda.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { CircleCheck, Pencil, Trash2 } from "lucide-vue-next";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityListProps } from '../types/Activity';
import type { ApiActivity } from '@/types/api';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { errorMessage as toMessage } from '@/store/tripStore';
import Button from '@/components/Button/Button.vue';

const props = defineProps<ActivityListProps & { highlightId?: string }>();
const emit = defineEmits<{ (e: 'edit', activity: ApiActivity): void }>();
const tripStore = useTripStore();
const auth = useAuthStore();

const isRemoving = ref('');
const removeError = ref('');

const isOwner = computed(() => tripStore.trip?.ownerId === auth.user?.id);

// rola até a atividade destacada (link de notificação: /trips/:id?activity=<id>)
watch(
  () => [props.highlightId, props.activities.length] as const,
  ([highlightId]) => {
    if (!highlightId) return;
    nextTick(() => {
      setTimeout(() => {
        document.getElementById(`activity-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  },
  { immediate: true },
);

const removeActivity = async (activity: ApiActivity) => {
  if (!window.confirm(`Excluir a atividade "${activity.title}"?`)) return;
  removeError.value = '';
  isRemoving.value = activity.id;
  try {
    await tripStore.removeActivity(tripStore.trip!.id, activity.id);
  } catch (e) {
    removeError.value = toMessage(e);
  } finally {
    isRemoving.value = '';
  }
};

const days = computed(() => {
  const grouped = new Map<string, typeof props.activities>();
  for (const activity of [...props.activities].sort(
    (a, b) => new Date(a.occursAt).getTime() - new Date(b.occursAt).getTime(),
  )) {
    const date = activity.occursAt.slice(0, 10);
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(activity);
  }

  return [...grouped.entries()].map(([date, activities]) => ({
    date,
    dayNumber: format(new Date(`${date}T12:00:00`), 'dd'),
    dayName: capitalize(format(new Date(`${date}T12:00:00`), 'EEEE', { locale: ptBR })),
    activities,
  }));
});

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const formatHour = (occursAt: string) => format(new Date(occursAt), 'HH:mm');
</script>
