<template>
  <div class="max-w-6xl px-6 py-10 mx-auto space-x-8">
    <HeaderDestination/>
    <main class="flex gap-16 py-10 px-4">
      <div class="flex-1 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-semibold">Atividades</h2>
          <button @click="openCreateActivityModal" class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
            <Plus class="size-5" />
            Cadastrar atividade
          </button>
        </div>
        <Activities :activities="tripStore.activities" />
      </div>
      <div class="w-80 space-y-6">
        <ImportantLinks />
        <div class="w-full h-px bg-zinc-800" />
        <Guests />
      </div>
    </main>
    <CreateActivity
      :isCreateActivityModalOpen="isCreateActivityModalOpen"
      @closeCreateActivityModal="closeCreateActivityModal"
      :submitActivity="handleActivitySubmit"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Plus } from "lucide-vue-next";
import ImportantLinks from "../views/ImportantLinks.vue";
import Activities from "../views/Activities.vue";
import Guests from "../views/Guests.vue";
import HeaderDestination from "../views/HeaderDestination.vue";
import CreateActivity from "../components/Modal/CreateActivity.vue";
import { useTripStore } from '@/store/tripStore';

const tripStore = useTripStore();

const isCreateActivityModalOpen = ref(false);

const openCreateActivityModal = () => {
  isCreateActivityModalOpen.value = true;
};

const closeCreateActivityModal = () => {
  isCreateActivityModalOpen.value = false;
};

const handleActivitySubmit = (formData) => {
  tripStore.addActivity(formData);
  console.log("Form data received and added to store:", formData);
  closeCreateActivityModal();
};
</script>
