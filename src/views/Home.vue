<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
    <div class="max-w-3xl w-full px-6 text-center space-y-10">
      <div class="flex flex-col items-center gap-3">
        <img src="/logo.svg" alt="plann.er" />
        <p class="text-zinc-300 text-lg">
          Convide seus amigos e planeje sua próxima viagem!
        </p>
      </div>

      <div class="space-y-4">
        <div class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
          <div class="flex items-center gap-2 flex-1">
            <MapPin class="size-5 text-zinc-400" />
            <input v-model="destination" :disabled="isGuestsInputOpen" type="text" placeholder="Para onde você vai?"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
          </div>

          <div class="flex items-center gap-2">
            <Calendar class="size-5 text-zinc-400" />
            <input v-model="date" :disabled="isGuestsInputOpen" type="text" placeholder="Quando?"
              class="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none" />
          </div>

          <div class="w-px h-6 bg-zinc-800" />

          <button v-if="isGuestsInputOpen" @click="closeGuestsInput"
            class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700">
            Alterar local/data
            <Settings2 class="size-5" />
          </button>

          <button v-else @click="openGuestsInput"
            class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
            Continuar
            <ArrowRight class="size-5" />
          </button>
        </div>

        <div v-if="isGuestsInputOpen" class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
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
      </div>

      <p class="text-sm text-zinc-500">
        Ao planejar sua viagem pela plann.er você automaticamente concorda
        <br />
        com nossos
        <a href="#" class="text-zinc-300 underline">termos de uso</a> e
        <a href="#" class="text-zinc-300 underline">políticas de privacidade</a>.
      </p>
    </div>

    <InviteGuestsModal 
    :isGuestsModalOpen="isGuestsModalOpen" 
    @closer="closeGuestsModal"
    :emailsToInvite="emailsToInvite" 
    @addNewEmailToInvite="addNewEmailToInvite"
    @removeEmailFromInvites="removeEmailFromInvites" 
    @emailAlreadyAdded="emailAlreadyAdded" 
    v-model:newEmail="newEmail" />


    <ConfirmTripModalOpen
    :isConfirmTripModalOpen="isConfirmTripModalOpen"
    @closeConfirmTripModal="closeConfirmTripModal"
    />

  </div>
</template>

<script setup>
import { defineProps } from 'vue';

import InviteGuestsModal from "@/components/Modal/InviteGuestsModal.vue";
import ConfirmTripModalOpen from "@/components/Modal/ConfirmTripModal.vue";
import { ref } from "vue";
import { useRouter } from 'vue-router';

import {
  ArrowRight,
  AtSign,
  Calendar,
  MapPin,
  Plus,
  Settings2,
  UserRoundPlus,
  X,
  User,
  Mail,
} from "lucide-vue-next";

const isGuestsInputOpen = ref(false);
const isGuestsModalOpen = ref(false);
const destination = ref("");
const date = ref("");
const newEmail = ref("");
const emailsToInvite = ref(["daniel@rubens.com.br", "john@acme.com"]);
const isConfirmTripModalOpen = ref(false);

const openGuestsInput = () => {
  isGuestsInputOpen.value = true;
};
const closeGuestsInput = () => {
  isGuestsInputOpen.value = false;
};
const openGuestsModal = () => {
  isGuestsModalOpen.value = true;
};
const closeGuestsModal = () => {
  isGuestsModalOpen.value = false;
};
const openConfirmTripModal = () => {
  isConfirmTripModalOpen.value = true;
};
const closeConfirmTripModal = () => {
  isConfirmTripModalOpen.value = false;
};
const emailAlreadyAdded = ref(false);

const addNewEmailToInvite = (event) => {
  event.preventDefault();
  if (!newEmail.value) return;

  if (emailsToInvite.value.includes(newEmail.value)) {
    emailAlreadyAdded.value = true;
    setTimeout(() => {
      emailAlreadyAdded.value = false;
    }, 3000);
    return;
  }

  emailsToInvite.value.push(newEmail.value);
  newEmail.value = "";
};

const removeEmailFromInvites = (emailToRemove) => {
  emailsToInvite.value = emailsToInvite.value.filter(
    (email) => email !== emailToRemove
  );
};

const router = useRouter();

// Programmatic navigation
const createTrip = () => {
  router.push('/trips/123');
}

</script>