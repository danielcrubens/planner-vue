<template>
  <div class="space-y-8">
    <div v-for="activity in activities" :key="activity.title" class="space-y-2.5">
      <div class="flex gap-2 items-baseline">
      </div>
      <div class="space-y-2.5">
        <div class="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
          <CircleCheck class="size-5 text-lime-300" />
          <span class="text-zinc-100">{{ activity.title }}</span>
          <span class="text-zinc-400 text-sm ml-auto">{{ formatTime(activity.occurs_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheck } from "lucide-vue-next";
import { defineProps } from "vue";

interface Activity {
  title: string;
  occurs_at: { hours: number; minutes: number; seconds: number };
}

const props = defineProps<{ activities: Activity[] }>();

const formatTime = (time: { hours: number; minutes: number }) => {
  const hours = time.hours.toString().padStart(2, '0');
  const minutes = time.minutes.toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
</script>
