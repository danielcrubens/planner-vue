<template>
  <div v-if="props.isGuestsModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-lg font-semibold">Selecionar convidados</h2>
          <button @click="$emit('closer')">
            <X class="size-5 text-zinc-400" />
          </button>
        </div>
        <p class="text-sm text-zinc-400">
          Os convidados irão receber e-mails para confirmar a participação na viagem.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="email in props.emailsToInvite" :key="email" class="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2">
          <span class="text-zinc-300">{{ email }}</span>
          <button @click="$emit('removeEmailFromInvites', email)" type="button">
            <X class="size-4 text-zinc-400" />
          </button>
        </div>
      </div>
      <div class="w-full h-px bg-zinc-800" />
      <form @submit.prevent="addNewEmailToInvite" class="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
        <div class="px-2 flex items-center flex-1 gap-2">
          <AtSign class="text-zinc-400 size-5" />
          <input v-model="newEmail" type="email" placeholder="Digite o e-mail do convidado"
            class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
        </div>
        <button @click="addNewEmailToInvite" type="submit"
          class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
          Convidar
          <Plus class="size-5" />
        </button>
      </form>
    </div>
  </div>
  <div v-if="props.emailAlreadyAdded" class="fixed mx-auto top-5 inset-x-0 bg-red/60 max-w-sm w-full">
    <div role="alert" class="rounded-xl border-s-4 border-red-500 bg-red-50 p-4">
      <strong class="block font-bold text-red-800 text-center">
        Este e-mail já foi adicionado!
      </strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AtSign, Plus, X } from "lucide-vue-next";
import { defineProps, ref } from 'vue';

interface InviteGuestsModalProps {
  isGuestsModalOpen: boolean;
  emailsToInvite: string[];
  emailAlreadyAdded: boolean;
}

const props = defineProps<InviteGuestsModalProps>();

const newEmail = ref(props.newEmail);
const addNewEmailToInvite = (event) => {
  event.preventDefault();
  if (!newEmail.value) return;

  if (props.emailsToInvite.includes(newEmail.value)) {
    emailAlreadyAdded.value = true;
    setTimeout(() => {
      emailAlreadyAdded.value = false;
    }, 3000);
    return;
  }

  props.emailsToInvite.push(newEmail.value);
  newEmail.value = "";
};

/* const removeEmailFromInvites = (emailToRemove) => {
  props.emailsToInvite = props.emailsToInvite.filter(
    (email) => email !== emailToRemove
  );
}; */
</script>
