<template>
  <div class="md:h-16  md:bg-zinc-900 md:px-4 rounded-xl grid grid-cols-1 gap-4 md:flex md:items-center md:gap-3 relative">
    <div class="flex items-center gap-2 bg-zinc-900   flex-1  py-3 px-2  rounded-lg relative">
      <MapPin class="size-5 text-zinc-400" />
      <input
        v-model="localDestination"
        :disabled="props.isGuestsInputOpen"
        @input="onDestinationInput"
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
        @update:model-value="onDateInput"
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
import { ref } from 'vue';
import { z } from 'zod';
import { DestinationDateProps } from '../../types/DestinationDate';


const props = defineProps<DestinationDateProps>();
const emit = defineEmits<{
  (e: 'update:destination', value: string): void;
  (e: 'update:date', value: Date[]): void;
}>();
const localDestination = ref(props.destination);
const localDate = ref<Date[]>(props.date);
const errorMessageDestination = ref('');
const errorMessageDate = ref('');

const destinationSchema = z.string().min(1, { message: "O destino é obrigatório" });

const handleContinue = () => {
  errorMessageDestination.value = '';
  errorMessageDate.value = '';

  const destinationResult = destinationSchema.safeParse(localDestination.value);
  if (!destinationResult.success) {
    errorMessageDestination.value = destinationResult.error.errors[0].message;
  }

  if (!localDate.value || localDate.value.length < 2) {
    errorMessageDate.value = 'Selecione o período da viagem (ida e volta)';
  }

  if (!errorMessageDestination.value && !errorMessageDate.value) {
    props.openGuestsInput();
  }
};

const onDestinationInput = (event: Event) => {
  errorMessageDestination.value = '';
  emit('update:destination', (event.target as HTMLInputElement).value);
};

const onDateInput = (value: Date[] | null) => {
  errorMessageDate.value = '';
  localDate.value = value ?? [];
  emit('update:date', localDate.value);
};
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
    background: transparent;
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
