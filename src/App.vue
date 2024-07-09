<template>
  <div
    class="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center"
  >
    <div class="max-w-3xl w-full px-6 text-center space-y-10">
      <div class="flex flex-col items-center gap-3">
        <img src="/logo.svg" alt="plann.er" />
        <p class="text-zinc-300 text-lg">
          Convide seus amigos e planeje sua próxima viagem!
        </p>
      </div>

      <div class="space-y-4">
        <div
          class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3"
        >
          <div class="flex items-center gap-2 flex-1">
            <MapPin class="size-5 text-zinc-400" />
            <input
              v-model="destination"
              :disabled="isGuestsInputOpen"
              type="text"
              placeholder="Para onde você vai?"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>

          <div class="flex items-center gap-2">
            <Calendar class="size-5 text-zinc-400" />
            <input
              v-model="date"
              :disabled="isGuestsInputOpen"
              type="text"
              placeholder="Quando?"
              class="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none"
            />
          </div>

          <div class="w-px h-6 bg-zinc-800" />

          <button
            v-if="isGuestsInputOpen"
            @click="closeGuestsInput"
            class="bg-zinc-800 text-zinc-200 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-zinc-700"
          >
            Alterar local/data
            <Settings2 class="size-5" />
          </button>

          <button
            v-else
            @click="openGuestsInput"
            class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
          >
            Continuar
            <ArrowRight class="size-5" />
          </button>
        </div>

        <div
          v-if="isGuestsInputOpen"
          class="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3"
        >
          <button
            @click="openGuestsModal"
            class="flex items-center gap-2 flex-1 text-left"
          >
            <UserRoundPlus class="size-5 text-zinc-400" />
            <span class="text-zinc-400 text-lg flex-1"
              >Quem estará na viagem?</span
            >
          </button>

          <div class="w-px h-6 bg-zinc-800" />

          <button
            class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
          >
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
        <a href="#" class="text-zinc-300 underline">políticas de privacidade</a
        >.
      </p>
    </div>

    <div
      v-if="isGuestsModalOpen"
      class="fixed inset-0 bg-black/60 flex items-center justify-center"
    >
      <div
        class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h2 class="font-lg font-semibold">Selecionar convidados</h2>
            <button @click="closeGuestsModal">
              <X class="size-5 text-zinc-400" />
            </button>
          </div>

          <p class="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na
            viagem.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <div
            v-for="email in emailsToInvite"
            :key="email"
            class="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
          >
            <span class="text-zinc-300">{{ email }}</span>
            <button @click="removeEmailFromInvites(email)" type="button">
              <X class="size-4 text-zinc-400" />
            </button>
          </div>
        </div>

        <div class="w-full h-px bg-zinc-800" />

        <form
          @submit.prevent="addNewEmailToInvite"
          class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2"
        >
          <div class="px-2 flex items-center flex-1 gap-2">
            <AtSign class="text-zinc-400 size-5" />
            <input
              v-model="newEmail"
              type="email"
              placeholder="Digite o e-mail do convidado"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>

          <button
            type="submit"
            class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
          >
            Convidar
            <Plus class="size-5" />
          </button>
        </form>
      </div>
    </div>
    <div
      v-if="emailAlreadyAdded"
      class="fixed mx-auto top-5 inset-x-0 bg-red/60 max-w-sm w-full"
    >
      <div role="alert" class="rounded-xl border-s-4 border-red-500 bg-red-50 p-4">
        <strong class="block font-bold text-red-800 text-center">
          Este e-mail já foi adicionado!
        </strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  ArrowRight,
  AtSign,
  Calendar,
  MapPin,
  Plus,
  Settings2,
  UserRoundPlus,
  X,
} from "lucide-vue-next"; 

const isGuestsInputOpen = ref(false);
const isGuestsModalOpen = ref(false);
const destination = ref("");
const date = ref("");
const newEmail = ref("");
const emailsToInvite = ref(["daniel@rubens.com.br", "john@acme.com"]);

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
</script>
