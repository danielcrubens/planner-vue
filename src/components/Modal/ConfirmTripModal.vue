<template>
  <div v-if="props.isConfirmTripModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center">
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
            <span class="font-semibold text-zinc-100">Florianópolis, Brasil</span>
            nas datas de
            <span class="font-semibold text-zinc-100">16 a 27 de Agosto de 2024</span>
            preencha seus dados abaixo:
          </p>
        </div>
        <form @submit.prevent="createTrip" class="space-y-3">
          <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User class="text-zinc-400 size-5" />
            <input type="text" name="name" placeholder="Seu nome completo"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
          </div>

          <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Mail class="text-zinc-400 size-5" />
            <input type="email" name="email" placeholder="Seu e-mail pessoal"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
          </div>

          <Button variant="primary">
            Confirmar criação da viagem
          </Button>
        </form>
      </div>
  </div>
</template>
<script setup lang="ts">
import {  User, X } from "lucide-vue-next";
import Button from "@/components/Button/Button.vue";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: string[];
  isConfirmTripModalOpen: boolean;
}
const props = defineProps<ConfirmTripModalProps>();  

</script>