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
          <DestinationDate
          :closeGuestsInput="closeGuestsInput"
          :isGuestsInputOpen="isGuestsInputOpen"
          :openGuestsInput="openGuestsInput"
          v-model:destination="destination"
          v-model:date="date"
          />

        <InviteGuests
        :isGuestsInputOpen="isGuestsInputOpen" 
        :openGuestsModal="openGuestsModal"
        :openConfirmTripModal="openConfirmTripModal"
        :openGuestsInput="openGuestsInput"
        :closeGuestsInput="closeGuestsInput"
        v-model:emailsToInvite="emailsToInvite"/>
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
    :ConfirmTripModalOpen="isConfirmTripModalOpen"
    @closeConfirmTripModal="closeConfirmTripModal"
    :createTrip="createTrip"
    v-model:ownerName="ownerName"
    v-model:ownerEmail="ownerEmail"/>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import InviteGuestsModal from "@/components/Modal/InviteGuestsModal.vue";
import ConfirmTripModalOpen from "@/components/Modal/ConfirmTripModal.vue";
import DestinationDate from '@/components/Input/DestinationDate.vue';
import InviteGuests from '@/components/Input/InviteGuest.vue';
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useTripStore } from '@/store/tripStore';


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
const date = ref([]);
const newEmail = ref('');
const ownerEmail = ref('');
const ownerName = ref('');
const emailsToInvite = ref([]);
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

const removeEmailFromInvites = (emailToRemove) => {
  emailsToInvite.value = emailsToInvite.value.filter(
    (email) => email !== emailToRemove
  );
};

const router = useRouter();
const tripStore = useTripStore();
const createTrip = () => {
  tripStore.setOwnerName(ownerName.value);
  tripStore.setOwnerEmail(ownerEmail.value)
  tripStore.setEmailsToInvite(emailsToInvite.value)
  router.push({ name: 'Trips' });
};
</script>