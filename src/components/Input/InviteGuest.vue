<template>
<div v-if="props.isGuestsInputOpen" class="h-16 bg-zinc-900 md:px-4 px-1   rounded-xl flex items-center shadow-shape gap-3">
          <button @click="openGuestsModal" class="flex items-center gap-2 flex-1 text-left">
            <UserRoundPlus class="size-5 text-zinc-400" />
            <span v-if="emailsToInvite.length > 0"
              :class="{ 'text-zinc-500 md:text-lg flex-1': emailsToInvite.length > 0 }">
              {{ emailsToInvite.length }} pessoa(s) convidada(s)
            </span>
            <span v-else :class="{ 'text-zinc-400 md:text-lg flex-1': !emailsToInvite.length }">
              Quem estará na viagem?
            </span>
          </button>

          <div class="lg:w-px h-6 bg-zinc-800 hidden lg:block" />

          <button @click="openConfirmTripModal" :disabled="!isFormValid" :class="{'cursor-not-allowed': !isFormValid ,'opacity-60': !isFormValid}"
            class="bg-lime-300 text-lime-950 rounded-lg lg:px-5 px-2 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
            Confirmar viagem
            <ArrowRight class="size-5" />
          </button>
        </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
  import { ArrowRight, UserRoundPlus } from "lucide-vue-next";
  import {InviteGuestProps} from '../../types/InviteGuest';

  const props = defineProps<InviteGuestProps>();
const isFormValid = computed(() => {
  return props.emailsToInvite.length > 0;
})
</script>

