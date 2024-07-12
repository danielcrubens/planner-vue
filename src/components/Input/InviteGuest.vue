<template>
<div v-if="props.isGuestsInputOpen" class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
          <button @click="openGuestsModal" class="flex items-center gap-2 flex-1 text-left">
            <UserRoundPlus class="size-5 text-zinc-400" />
            <span v-if="emailsToInvite.length > 0"
              :class="{ 'text-zinc-500 text-lg flex-1': emailsToInvite.length > 0 }">
              {{ emailsToInvite.length }} pessoa(s) convidada(s)
            </span>
            <span v-else :class="{ 'text-zinc-400 text-lg flex-1': !emailsToInvite.length }">
              Quem estará na viagem?
            </span>
          </button>

          <div class="w-px h-6 bg-zinc-800" />

          <button @click="openConfirmTripModal"
            class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
            Confirmar viagem
            <ArrowRight class="size-5" />
          </button>
        </div>
</template>

<script setup lang="ts">
  import { ArrowRight, UserRoundPlus } from "lucide-vue-next";
  interface InviteGuestProps {
    isGuestsInputOpen: boolean;
    openGuestsModal: () => void;
    openConfirmTripModal: () => void;
    emailsToInvite: string[];
  }
  const props = defineProps<InviteGuestProps>();

</script>

