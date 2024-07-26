<template>
  <div class="space-y-6">
      <h2 class="font-semibold text-xl">Organizador</h2>

      <div class="space-y-5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-2.5 ">
            <div class="px-2 py-2.5 space-x-2 bg-zinc-900 rounded-xl shadow-shape flex items-center">
            <User class="size-5 text-lime-300"/>   <span class="block font-medium text-zinc-100">{{ ownerName }} </span>
          </div>
            <span class="px-2 py-2.5 space-x-2 bg-zinc-900 rounded-xl shadow-shape flex items-center ">
            <Mail class="size-5 text-lime-300"/>  <span class="block text-sm text-zinc-400 truncate">{{ ownerEmail}}</span>
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
              <span class="block text-sm text-zinc-400 truncate">{{ emailsToInvite.join(', ') }}</span>
          </div>

          <CircleDashed class="text-zinc-400 size-5 shrink-0" />
        </div>

       
      </div>
      

      <Button variant="secondary" size="full">
        <UserCog class="size-5" />
        Gerenciar convidados
      </Button>
    </div>
</template>

<script setup>
  import { CircleDashed, UserCog, Mail, User } from "lucide-vue-next";
  import Button from "../components/Button/Button.vue";
  import { useTripStore } from '@/store/tripStore';
import { computed } from 'vue';
  const tripStore = useTripStore();

const ownerName = computed(() => tripStore.ownerName);
const ownerEmail = computed(() => tripStore.ownerEmail);
const emailsToInvite = computed(() => tripStore.emailsToInvite);
</script>

