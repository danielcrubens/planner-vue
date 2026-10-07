<template>
  <div v-if="ConfirmTripModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
    <div class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-lg font-semibold">Confirmar criação de viagem</h2>
          <Button>
            <X class="size-5 text-zinc-400" @click="$emit('closeConfirmTripModal')" />
          </Button>
        </div>
        <p class="text-sm text-zinc-400">
          Para concluir a criação da viagem para
          <span class="font-semibold text-zinc-100">{{ destination }}</span>
          nas datas de
          <span class="font-semibold text-zinc-100">{{ formattedDate }}</span>
          <template v-if="invitedCount > 0">
            com {{ invitedCount }} pessoa(s) convidada(s)
          </template>, confirme abaixo:
        </p>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-xs">{{ errorMessage }}</p>

      <Button type="Button" variant="primary" :disabled="isSubmitting" @click="$emit('confirmTrip')">
        {{ isSubmitting ? 'Criando viagem...' : 'Confirmar criação da viagem' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import Button from "@/components/Button/Button.vue";
import { ConfirmTripModalProps } from '../../types/ConfirmTripModal';

defineProps<ConfirmTripModalProps>();
defineEmits<{ (e: 'closeConfirmTripModal'): void; (e: 'confirmTrip'): void }>();
</script>
