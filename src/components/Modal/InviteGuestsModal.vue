<template>
  <div v-if="props.isGuestsModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 h-[50vh]">
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
      <form @submit.prevent="addNewEmail" class="p-2.5 lg:bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col md:flex-row md:items-center gap-2">
        <div class="lg:px-2 lg:py-0 py-2.5 px-2.5  flex items-center flex-1 border lg:border-0 border-zinc-800 rounded-lg gap-y-7 gap-x-2 relative bg-zinc-950">
          <AtSign class="text-zinc-400 size-5" />
          <input 
            v-model="newEmail"  
            placeholder="Digite o e-mail do convidado"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1" 
            @input="clearValidationError"
          />
          <div v-if="validationError" class="text-red-500 px-2 text-xs absolute -bottom-4 ">
            {{ validationError }}
          </div>
        </div>
        <button type="submit"
          class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 mt-4 lg:mt-0 font-medium flex items-center gap-2 hover:bg-lime-400">
          Convidar
          <Plus class="size-5" />
        </button>
      </form>
    </div>
  </div>
  <div v-if="emailAlreadyAdded" class="fixed mx-auto top-5 inset-x-0 bg-red/60 max-w-sm w-full">
    <div role="alert" class="rounded-xl border-s-4 border-red-500 bg-red-50 p-4">
      <strong class="block font-bold text-red-500 text-center">
        Este e-mail já foi adicionado!
      </strong>
    </div>
  </div>
</template>


<script setup lang="ts">
import { AtSign, Plus, X } from "lucide-vue-next";
import { defineProps, ref } from 'vue';
import { z } from 'zod';
import { InviteGuestsModalProps } from '../../types/InviteGuestsModal';

const validationSchema = z.object({
  email: z.string().email({ message: "O e-mail fornecido não é válido" }),
});


const props = defineProps<InviteGuestsModalProps>();

const newEmail = ref("");
const emailAlreadyAdded = ref(false);
const validationError = ref<string | null>(null);

const addNewEmail = async () => {
  const email = newEmail.value.trim();

  const result = validationSchema.safeParse({ email });

  if (!result.success) {
    validationError.value = result.error.errors[0].message;
    return;
  }

  if (props.emailsToInvite.includes(email)) {
    emailAlreadyAdded.value = true; 
    setTimeout(() => {
      emailAlreadyAdded.value = false;
    }, 3000);
  } else {
    props.emailsToInvite.push(email);
    newEmail.value = "";
    emailAlreadyAdded.value = false;
    validationError.value = null;
  }
};

const clearValidationError = () => {
  validationError.value = null;
};
</script>
