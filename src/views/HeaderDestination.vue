<template>
  <div class="md:px-4 px-1 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
    <div class="flex items-center gap-2">
      <MapPin class="size-5 text-zinc-400" />
      <input 
        v-model="localDestination" 
        :readonly="!isEditing" 
        type="text" 
        class="text-zinc-100 focus:outline-none focus:border-lime-300 bg-transparent w-full" 
        placeholder="Destino" 
      />
    </div>
    <div class="flex items-center gap-5">
      <div class="flex items-center gap-2">
        <Calendar class="size-5 text-zinc-400" />
        <VueDatePicker
          v-model="localDate"
          :disabled="!isEditing"
          @update:model-value="handleDateInput"
          class="picker"
          placeholder="Quando?"
          range
          :enable-time-picker="false"
        />
      </div>
      <div class="w-px h-6 bg-zinc-800" />
      <Button class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700"variant="secondary" @click="toggleEditing">
        {{ isEditing ? 'Salvar' : 'Alterar local/data' }}
        <Settings2 class="size-5" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Settings2, MapPin, Calendar } from "lucide-vue-next";
import { useTripStore } from '@/store/tripStore';
import { format } from 'date-fns';

const tripStore = useTripStore();
const isEditing = ref(false);

const localDestination = ref(tripStore.destination);
const localDate = ref(tripStore.date);

const formattedDate = computed(() => {
  if (!localDate.value || localDate.value.length === 0) return '';
  const formattedStartDate = format(new Date(localDate.value[0]), 'dd/MM/yyyy');
  const formattedEndDate = localDate.value[1] ? format(new Date(localDate.value[1]), 'dd/MM/yyyy') : '';
  return formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : formattedStartDate;
});

const toggleEditing = () => {
  if (isEditing.value) {
    // Salvar as alterações no tripStore
    tripStore.setDestination(localDestination.value);
    tripStore.setDate(localDate.value);
  }
  isEditing.value = !isEditing.value;
};

const handleDateInput = (selectedDates) => {
  localDate.value = selectedDates;
};

// Observar mudanças no store e atualizar os valores locais
watch(() => tripStore.destination, (newDestination) => {
  localDestination.value = newDestination;
});

watch(() => tripStore.date, (newDate) => {
  localDate.value = newDate;
});
</script>

