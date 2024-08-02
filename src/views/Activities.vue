<template>
  <div class="space-y-8">
    <div v-for="activity in props.activities" :key="activity.title" class="space-y-2.5">
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
import { ActivityListProps } from '../types/Activity';
import { formatTime } from '../utils/timeUtils';

const props = defineProps<ActivityListProps>();
</script>
