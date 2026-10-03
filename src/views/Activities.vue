<template>
  <div class="space-y-8">
    <div v-for="day in days" :key="day.date" class="space-y-2.5">
      <div class="space-x-2.5">
        <span class="text-zinc-100 text-lg font-bold">Dia {{ day.dayNumber }}</span>
        <span class="text-zinc-400 text-sm">{{ day.dayName }}</span>
      </div>
      <div
        v-for="activity in day.activities"
        :key="activity.id"
        class="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3"
      >
        <CircleCheck class="size-5 text-lime-300" />
        <span class="text-zinc-100">{{ activity.title }}</span>
        <span class="text-zinc-400 text-sm ml-auto">{{ formatHour(activity.occursAt) }}</span>
      </div>
    </div>

    <p v-if="days.length === 0" class="text-zinc-400 text-sm">
      Nenhuma atividade cadastrada ainda.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CircleCheck } from "lucide-vue-next";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityListProps } from '../types/Activity';

const props = defineProps<ActivityListProps>();

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
