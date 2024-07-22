<template>
  <div class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center  gap-3">
    <div class="flex items-center gap-2 flex-1">
      <MapPin class="size-5 text-zinc-400" />
      <input v-model="localDestination" :disabled="props.isGuestsInputOpen" @input="$emit('update:isGuestsInputOpen', $event.target.value)" type="text" placeholder="Para onde você vai?"
        class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
    </div>

    <div class="flex items-center gap-2">
      <Calendar class="size-5 text-zinc-400" />
      <VueDatePicker v-model="localDate" :disabled="props.isGuestsInputOpen"@input="$emit('update:isGuestsInputOpen', $event.target.value)" class="picker"placeholder="Quando?"  range />
    </div>

    <div class="" /><!-- w-px h-6 bg-zinc-800 -->

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
import { useTripStore } from '@/store/tripStore';



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
const tripStore = useTripStore();


const handleContinue = () => {
  console.log('Destiono',localDestination.value);
  console.log('Data',localDate.value);
  tripStore.setDestination(localDestination.value);
  tripStore.setDate(localDate.value);

  props.openGuestsInput();
};

// Watchers to sync local values with props
watch(() => props.destination, (newValue) => {
  localDestination.value = newValue;
});

watch(() => props.date, (newValue) => {
  localDate.value = newValue;
});
</script>

<style scss>
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
      --dp-hover-icon-color: #959595;
      --dp-primary-color: #005cb2;
      --dp-primary-disabled-color: #61a8ea;
      --dp-primary-text-color: #fff;
      --dp-secondary-color: #a9a9a9;
      --dp-border-color: #2d2d2d;
      --dp-menu-border-color: #2d2d2d;
      --dp-border-color-hover: #aaaeb7;
      --dp-border-color-focus: #aaaeb7;
      --dp-disabled-color: #737373;
      --dp-disabled-color-text: #d0d0d0;
      --dp-scroll-bar-background: #212121;
      --dp-scroll-bar-color: #484848;
      --dp-success-color: #00701a;
      --dp-success-color-disabled: #428f59;
      --dp-icon-color: #959595;
      --dp-danger-color: #e53935;
      --dp-marker-color: #e53935;
      --dp-tooltip-color: #3e3e3e;
      --dp-highlight-color: rgb(0 92 178 / 20%);
      --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
      --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
      --dp-range-between-border-color: var(--dp-hover-color, #fff);
      

  } 

  .dp__input_wrap{
    .dp__input{
    border: none!important;
    
  }
  input{
    font-size: 1.125rem;
    font-family: Inter, sans-serif;
    padding: 0;
    color: red;
    &::placeholder{
      color: pink;
    }
  }
    width: 11rem;
    svg{
    display: none!important;
  } 
  .dp__disabled{
    background: transparent;
  }
  } 

</style>