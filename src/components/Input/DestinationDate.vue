<template>
  <div class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center  gap-3">
    <div class="flex items-center gap-2 flex-1">
      <MapPin class="size-5 text-zinc-400" />
      <input v-model="localDestination" :disabled="props.isGuestsInputOpen" type="text" placeholder="Para onde você vai?"
        class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
    </div>

    <div class="flex items-center gap-2">
      <Calendar class="size-5 text-zinc-400" />
      <input v-model="localDate" :disabled="props.isGuestsInputOpen" type="text" placeholder="Quando?"
        class="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none" />
    </div>

    <div class="w-px h-6 bg-zinc-800" />

    <button v-if="props.isGuestsInputOpen" @click="closeGuestsInput"
      class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700">
      Alterar local/data
      <Settings2 class="size-5" />
    </button>

    <button v-else @click="handleContinue"
      class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
      Continuar
      <ArrowRight class="size-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Settings2, Calendar, MapPin } from "lucide-vue-next";
import { ref, watch } from 'vue';

interface DestinationDateProps {
  isGuestsInputOpen: boolean;
  closeGuestsInput: () => void;
  openGuestsInput: () => void;
  date: string;
  destination: string;
  
}
const props = defineProps<DestinationDateProps>();
  const localDestination = ref(props.destination);
const localDate = ref(props.date);

const handleContinue = () => {
  props.openGuestsInput();
};

watch(localDestination, (newValue) => {
  props.destination = newValue;
});

watch(localDate, (newValue) => {
  props.date = newValue;
});

</script>