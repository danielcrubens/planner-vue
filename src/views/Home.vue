<template>
  <div class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center overflow-y-auto relative">
    <div v-if="firstName" class="absolute top-6 right-6 flex items-center gap-3">
      <span class="hidden md:block text-sm text-zinc-400">{{ auth.user?.email }}</span>
      <button
        @click="logout"
        class="flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg px-3 py-2 transition-colors"
      >
        <LogOut class="size-4" />
        Sair
      </button>
    </div>

    <div class="max-w-3xl w-full px-6 py-10 text-center space-y-10">
      <div class="flex flex-col items-center gap-3">
        <img src="/logo.svg" alt="plann.er" />
        <p class="text-zinc-300 text-lg">
          <template v-if="firstName">
            Olá <span class="text-lime-300 font-semibold">{{ firstName }}</span>, convide seus amigos e planeje sua próxima viagem!
          </template>
          <template v-else>
            Convide seus amigos e planeje sua próxima viagem!
          </template>
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
        :emailsToInvite="emailsToInvite"/>
      </div>

      <div v-if="firstName && trips.length > 0" class="space-y-3 text-left">
        <h2 class="font-semibold text-xl">Suas viagens</h2>
        <RouterLink
          v-for="trip in trips"
          :key="trip.id"
          :to="`/trips/${trip.id}`"
          class="flex items-center justify-between px-4 py-3 bg-zinc-900 rounded-xl shadow-shape hover:bg-zinc-800 transition-colors"
        >
          <span class="flex items-center gap-2 text-zinc-100">
            <MapPin class="size-5 text-zinc-400" />
            {{ trip.destination }}
          </span>
          <span class="text-sm text-zinc-400">{{ formatDateRange(trip.startsAt, trip.endsAt) }}</span>
        </RouterLink>
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
    @removeEmailFromInvites="removeEmailFromInvites" />


    <ConfirmTripModalOpen
    :ConfirmTripModalOpen="isConfirmTripModalOpen"
    @closeConfirmTripModal="closeConfirmTripModal"
    @confirmTrip="submitTrip"
    :destination="destination"
    :formattedDate="formattedDate"
    :invitedCount="emailsToInvite.length"
    :isSubmitting="isCreatingTrip"
    :errorMessage="createError"/>

    <AuthModal
    :isOpen="isAuthModalOpen"
    @closer="closeAuthModal"
    @authenticated="onAuthenticated"/>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, RouterLink } from 'vue-router';
import { MapPin, LogOut } from "lucide-vue-next";
import InviteGuestsModal from "@/components/Modal/InviteGuestsModal.vue";
import ConfirmTripModalOpen from "@/components/Modal/ConfirmTripModal.vue";
import AuthModal from "@/components/Modal/AuthModal.vue";
import DestinationDate from '@/components/Input/DestinationDate.vue';
import InviteGuests from '@/components/Input/InviteGuest.vue';
import { format } from 'date-fns';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { errorMessage as toMessage } from '@/store/tripStore';

const tripStore = useTripStore();
const auth = useAuthStore();
const router = useRouter();

const isGuestsInputOpen = ref(false);
const isGuestsModalOpen = ref(false);
const isAuthModalOpen = ref(false);
const pendingContinue = ref(false);
const destination = ref("");
const date = ref([]);
const emailsToInvite = ref([]);
const isConfirmTripModalOpen = ref(false);
const isCreatingTrip = ref(false);
const createError = ref('');
const trips = computed(() => tripStore.trips);

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? '');

const openGuestsInput = () => {
  if (!auth.isAuthenticated) {
    pendingContinue.value = true;
    isAuthModalOpen.value = true;
    return;
  }
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
const closeAuthModal = () => {
  isAuthModalOpen.value = false;
  pendingContinue.value = false;
};

const onAuthenticated = () => {
  isAuthModalOpen.value = false;
  if (pendingContinue.value) {
    pendingContinue.value = false;
    isGuestsInputOpen.value = true;
  }
  tripStore.fetchTrips().catch(() => {});
};

const addNewEmailToInvite = (email) => {
  emailsToInvite.value.push(email);
};

const logout = async () => {
  await auth.logout();
  window.location.assign('/');
};

const removeEmailFromInvites = (emailToRemove) => {
  emailsToInvite.value = emailsToInvite.value.filter(
    (email) => email !== emailToRemove
  );
};

const formattedDate = computed(() => {
  const startDate = date.value?.[0];
  const endDate = date.value?.[1];
  if (!startDate) return '';
  const formattedStartDate = format(startDate, 'dd/MM/yyyy');
  return endDate ? `${formattedStartDate} a ${format(endDate, 'dd/MM/yyyy')}` : formattedStartDate;
});

const formatDateRange = (startsAt, endsAt) => {
  const start = format(new Date(startsAt), 'dd/MM/yyyy');
  const end = format(new Date(endsAt), 'dd/MM/yyyy');
  return end === start ? start : `${start} - ${end}`;
};

const submitTrip = async () => {
  isCreatingTrip.value = true;
  createError.value = '';
  try {
    const trip = await tripStore.createTrip({
      destination: destination.value,
      starts_at: new Date(date.value[0]).toISOString().slice(0, 10),
      ends_at: new Date(date.value[1]).toISOString().slice(0, 10),
      emails_to_invite: emailsToInvite.value,
    });
    closeConfirmTripModal();
    router.push(`/trips/${trip.id}`);
  } catch (e) {
    createError.value = toMessage(e);
  } finally {
    isCreatingTrip.value = false;
  }
};

watch(firstName, (value) => {
  if (value && trips.value.length === 0) {
    tripStore.fetchTrips().catch(() => {});
  }
});

onMounted(() => {
  if (auth.isAuthenticated) {
    tripStore.fetchTrips().catch(() => {
      // sem viagens ainda ou falha de rede — a Home segue utilizável
    });
  }
});
</script>
