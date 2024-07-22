<template>
  <div class="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
    <div class="flex items-center gap-2">
      <MapPin class="size-5 text-zinc-400" />
      <span class="text-zinc-100"> {{ destination }} </span>
    </div>
    <div class="flex items-center gap-5">
      <div class="flex items-center gap-2">
        <Calendar class="size-5 text-zinc-400" />
        <span class="text-zinc-100">
          {{ formattedDate }}
        </span>
      </div>
      <div class="w-px h-6 bg-zinc-800" />
      <Button variant="secondary">
        Alterar local/data
        <Settings2 class="size-5" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { Settings2, MapPin, Calendar } from "lucide-vue-next";
import { useTripStore } from '@/store/tripStore';
import { computed } from 'vue';
import { format } from 'date-fns';  

const tripStore = useTripStore();

const destination = computed(() => tripStore.destination);

const formattedDate = computed(() => {
  const dateArray = tripStore.date;
  if (dateArray && dateArray[0]) {
    return format(new Date(dateArray[0]), 'dd/MM/yyyy');
  }
  return '';
});
</script>
