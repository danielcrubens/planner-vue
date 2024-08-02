<template>
  <div class="md:h-16  md:bg-zinc-900 md:px-4 rounded-xl grid grid-cols-1 gap-4 md:flex md:items-center md:gap-3 relative">
    <div class="flex items-center gap-2 bg-zinc-900   flex-1  py-3 px-2  rounded-lg relative">
      <MapPin class="size-5 text-zinc-400" />
      <input
        v-model="localDestination"
        :disabled="props.isGuestsInputOpen"
        @input="handleDestinationInput"
        type="text"
        placeholder="Para onde você vai?"
        class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1"
      />
      <div v-if="errorMessageDestination" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageDestination }}</div>
    </div>
    <div class="flex items-center gap-2 bg-zinc-900 py-3 px-2  rounded-lg relative">
      <Calendar class="size-5 text-zinc-400" />
      <VueDatePicker
        v-model="localDate"
        :disabled="props.isGuestsInputOpen"
        @update:model-value="handleDateInput"
        class="picker"
        placeholder="Quando?"
        range
        :enable-time-picker="false"
      />
      <div v-if="errorMessageDate" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageDate }}</div>
    </div>

    <button
      v-if="props.isGuestsInputOpen"
      @click="closeGuestsInput"
      class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700"
    >
      Alterar local/data
      <Settings2 class="size-5" />
    </button>

    <button v-else
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
import { useTripStore } from '../../store/tripStore';
import { z } from 'zod';

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
const errorMessageDestination = ref('');
const errorMessageDate = ref('');

const destinationSchema = z.string().min(1, { message: "O destino é obrigatório" });
const dateSchema = z.string().nonempty('A data é obrigatória');

const handleContinue = () => {
  errorMessageDestination.value = '';
  errorMessageDate.value = '';
  try {
    destinationSchema.parse(localDestination.value);
  } catch (e) {
    if (e instanceof z.ZodError) {
      errorMessageDestination.value = e.errors.map(err => err.message).join(', ');
    }
  }
  try {
    dateSchema.parse(localDate.value ? localDate.value.toString() : '');
  } catch (e) {
    if (e instanceof z.ZodError) {
      errorMessageDate.value = e.errors.map(err => err.message).join(', ');
    }
  }
  if (!errorMessageDestination.value && !errorMessageDate.value) {
    tripStore.setDestination(localDestination.value);
    tripStore.setDate(localDate.value);
    props.openGuestsInput();
  }
};

const handleDestinationInput = () => {
  errorMessageDestination.value = '';
};

const handleDateInput = () => {
  errorMessageDate.value = '';
};

watch(() => props.destination, (newValue) => {
  localDestination.value = newValue;
});

watch(() => props.date, (newValue) => {
  localDate.value = newValue;
});
</script>

<style  scss>
.dp__input_wrap input::placeholder {
  color: #e4e0e0!important;
  font-weight: 300;
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
    @media screen and (max-width: 640px) {
      font-size: 1rem;
    }
  }
  svg {
    display: none !important;
  }
  .dp__disabled {
    background: transparent;
  }
}
</style>