<template>
  <div class="space-y-6">
      <h2 class="font-semibold text-xl">Organizador</h2>

      <div class="space-y-5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-2.5 ">
            <div class="px-2 py-2.5 space-x-2 bg-zinc-900 rounded-xl shadow-shape flex items-center">
            <User class="size-5 text-lime-300"/>   <span class="block font-medium text-zinc-100">{{ owner?.name ?? '—' }} </span>
          </div>
            <span class="px-2 py-2.5 space-x-2 bg-zinc-900 rounded-xl shadow-shape flex items-center ">
            <Mail class="size-5 text-lime-300"/>  <span class="block text-sm text-zinc-400 truncate">{{ owner?.email }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-px bg-zinc-800"></div>
    <div class="space-y-6">
      <h2 class="font-semibold text-xl">Convidados</h2>

      <div class="space-y-5">
        <div class="md:flex grid md:items-center justify-between gap-4">
          <div class="md:flex md:flex-wrap gap-2">
            <div
              v-for="guest in guests"
              :key="guest.id"
              class="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
            >
              <span class="text-zinc-300 text-sm truncate">{{ guest.email }}</span>
              <CircleCheck v-if="guest.isConfirmed" class="text-lime-300 size-4 shrink-0" />
              <CircleDashed v-else class="text-zinc-400 size-4 shrink-0" />
              <button
                v-if="isOwner"
                type="button"
                :disabled="isRemoving === guest.id"
                @click="removeGuest(guest.id)"
              >
                <X class="size-4 text-zinc-400 hover:text-zinc-200" />
              </button>
            </div>
            <span v-if="guests.length === 0" class="block text-sm text-zinc-400">
              Nenhum convidado ainda.
            </span>
          </div>
        </div>
      </div>

      <p v-if="guestError" class="text-red-500 text-xs">{{ guestError }}</p>

      <Button v-if="isOwner" variant="secondary" size="full" @click="isGuestsModalOpen = true">
        <UserCog class="size-5" />
        Gerenciar convidados
      </Button>
    </div>

    <InviteGuestsModal
      :isGuestsModalOpen="isGuestsModalOpen"
      :emailsToInvite="guestEmails"
      @closer="isGuestsModalOpen = false"
      @addNewEmailToInvite="inviteGuest"
      @removeEmailFromInvites="removeGuestByEmail"
    />
</template>

<script setup>
import { computed, ref } from "vue";
import { CircleDashed, CircleCheck, UserCog, Mail, User, X } from "lucide-vue-next";
import Button from "../components/Button/Button.vue";
import InviteGuestsModal from "@/components/Modal/InviteGuestsModal.vue";
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { errorMessage as toMessage } from '@/store/tripStore';

const tripStore = useTripStore();
const auth = useAuthStore();

const isGuestsModalOpen = ref(false);
const isRemoving = ref('');
const guestError = ref('');

const participants = computed(() => tripStore.trip?.participants ?? []);
const owner = computed(() => participants.value.find((p) => p.isOwner));
const guests = computed(() => participants.value.filter((p) => !p.isOwner));
const guestEmails = computed(() => guests.value.map((g) => g.email));
const isOwner = computed(() => tripStore.trip?.ownerId === auth.user?.id);

const inviteGuest = async (email) => {
  guestError.value = '';
  try {
    await tripStore.invite(tripStore.trip.id, [email]);
  } catch (e) {
    guestError.value = toMessage(e);
  }
};

const removeGuest = async (participantId) => {
  guestError.value = '';
  isRemoving.value = participantId;
  try {
    await tripStore.removeParticipant(tripStore.trip.id, participantId);
  } catch (e) {
    guestError.value = toMessage(e);
  } finally {
    isRemoving.value = '';
  }
};

const removeGuestByEmail = async (email) => {
  const guest = guests.value.find((g) => g.email === email);
  if (guest) await removeGuest(guest.id);
};
</script>
