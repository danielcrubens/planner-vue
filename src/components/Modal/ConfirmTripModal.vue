<template>
  <div v-if="props.ConfirmTripModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-lg font-semibold">Confirmar criação de viagem</h2>
          <button>
            <X class="size-5 text-zinc-400" @click="$emit('closeConfirmTripModal')" />
          </button>
        </div>
        <p class="text-sm text-zinc-400">
          Para concluir a criação da viagem para
          <span class="font-semibold text-zinc-100">{{ destination }}</span>
          nas datas de
          <span class="font-semibold text-zinc-100">{{ formattedDate }}</span>
          preencha seus dados abaixo:
        </p>
      </div>
      <form @submit.prevent="createTrip" class="space-y-3">
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
          <User class="text-zinc-400 size-5" />
          <input type="text" v-model="props.ownerName"
          @input="$emit('update:ownerName', ($event.target as HTMLInputElement)?.value ?? '')"
          name="name"
            placeholder="Seu nome completo"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1" />
        </div>
        <div class="text-red-500 text-xs" v-if="errors.name">{{ errors.name }}</div>
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
          <Mail class="text-zinc-400 size-5" />
          <input type="email" v-model="props.ownerEmail"
          @input="$emit('update:ownerEmail', ($event.target as HTMLInputElement)?.value ?? '')"
          name="email"
            placeholder="Seu e-mail pessoal"
            class="bg-transparent md:ext-lg placeholder-zinc-400 outline-none flex-1" />
        </div>
        <div class="text-red-500 text-xs" v-if="errors.email">{{ errors.email }}</div>
        <Button type="submit" variant="primary">
          Confirmar criação da viagem
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, X, Mail } from "lucide-vue-next";
import Button from "@/components/Button/Button.vue";
import { z } from 'zod';
import { ref, computed } from 'vue';
import {  useTripStore } from '../../store/tripStore'; 
import { format } from 'date-fns';

const tripStore = useTripStore();

const destination = computed(() => tripStore.destination);

const formattedDate = computed(() => {
  const dateArray = tripStore.date;
  const formattedStartDate = dateArray && dateArray[0] ? format(new Date(dateArray[0]), 'dd/MM/yyyy') : '';
  const formattedEndDate = dateArray && dateArray[1] ? format(new Date(dateArray[1]), 'dd/MM/yyyy') : '';
  return formattedEndDate ? `${formattedStartDate} a ${formattedEndDate}` : formattedStartDate;
});

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: () => void;
  ConfirmTripModalOpen: boolean;
  ownerName: string;
  ownerEmail: string;
}
const props = defineProps<ConfirmTripModalProps>();

const errors = ref<{ name?: string; email?: string }>({});

const schema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('O e-mail fornecido não é válido')
});

const createTrip = () => {
  const result = schema.safeParse({
    name: props.ownerName,
    email: props.ownerEmail,
  });

  if (!result.success) {
    errors.value = {};
    result.error.errors.forEach((err) => {
      errors.value[err.path[0] as keyof typeof errors.value] = err.message;
    });
    return;
  }

  props.createTrip();
};
</script>