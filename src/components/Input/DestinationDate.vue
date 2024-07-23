<template>
  <div class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center gap-3 relative">
    <div class="flex items-center gap-2 flex-1">
      <MapPin class="size-5 text-zinc-400" />
      <input
        v-model="localDestination"
        :disabled="props.isGuestsInputOpen"
        @input="handleDestinationInput"
        type="text"
        placeholder="Para onde você vai?"
        class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
      />
    </div>
    <div v-if="errors.destination" class="text-red-500 px-2 text-xs absolute -bottom-0 ">
      {{ errors.destination }}
    </div>

    <div class="flex items-center gap-2">
      <Calendar class="size-5 text-zinc-400" />
      <VueDatePicker
        v-model="localDate"
        :disabled="props.isGuestsInputOpen"
        @input="handleDateInput"
        class="picker"
        placeholder="Quando?"
        range
        :enable-time-picker="false"
      />
    </div>
    <div v-if="errors.date" class="text-red-500 px-2 text-xs absolute -bottom-0 right-0">
      {{ errors.date }}
    </div>

    <button
      v-if="props.isGuestsInputOpen"
      @click="closeGuestsInput"
      class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700"
    >
      Alterar local/data
      <Settings2 class="size-5" />
    </button>

    <button
      v-else
      @click="handleContinue"
      class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
    >
      Continuar
      <ArrowRight class="size-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, Settings2, Calendar, MapPin } from "lucide-vue-next";
import { ref, watch } from 'vue';
import { useTripStore } from '@/store/tripStore';
import { z } from 'zod';

const validationSchema = z.object({
  destination: z.string().min(1, { message: "O destino é obrigatório" }),
  /* date: z.array(z.string()).min(1, { message: "A data é obrigatória" }) */
});

interface DestinationDateProps {
  isGuestsInputOpen: boolean;
  closeGuestsInput: () => void;
  openGuestsInput: () => void;
  date: string[];
  destination: string;
}
const props = defineProps<DestinationDateProps>();
const localDestination = ref(props.destination);
const localDate = ref(props.date);
const tripStore = useTripStore();
const errors = ref<{ destination?: string; date?: string }>({});

const handleContinue = async () => {
  errors.value = {};
  try {
    validationSchema.parse({
      destination: localDestination.value,
      date: localDate.value
    });
    tripStore.setDestination(localDestination.value);
    tripStore.setDate(localDate.value);
    props.openGuestsInput();
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        errors.value[err.path[0]] = err.message;
      });
    }
  }
};

const handleDestinationInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (errors.value.destination) {
    errors.value.destination = '';
  }
};

const handleDateInput = (value: string[]) => {
  if (errors.value.date) {
    errors.value.date = '';
  }
  localDate.value = value;
};

watch(() => props.destination, (newValue) => {
  localDestination.value = newValue;
});

watch(() => props.date, (newValue) => {
  localDate.value = newValue;
});
</script>

<style  scss>
.picker {
  &::placeholder {
    color: #fff;
  }
}
.dp__theme_light {
  outline: none;
  --dp-background-color: #18181b;
  --dp-text-color: #fff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #fff;
  --dp-primary-color: #a3e635;
  --dp-primary-text-color: #18181b;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
}
.dp__action_buttons {
  display: block;
  flex: auto;
  white-space: nowrap;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: auto;
}
.dp__input_wrap {
  .dp__input {
    border: none !important;
  }
  input {
    font-size: 1.125rem;
    font-family: Inter, sans-serif;
    padding: 0;
  }
  svg {
    display: none !important;
  }
  .dp__disabled {
    background: transparent;
  }
}
</style>