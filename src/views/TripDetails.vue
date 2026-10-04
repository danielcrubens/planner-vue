<template>
  <div class="md:max-w-6xl md:px-6 px-3 py-10 mx-auto md:space-x-8">
    <UserMenu />

    <p v-if="tripStore.isLoading" class="text-zinc-400 py-10">Carregando viagem...</p>

    <div v-else-if="tripStore.error" class="py-10 space-y-3">
      <p class="text-red-500">{{ tripStore.error }}</p>
      <RouterLink to="/" class="text-lime-300 underline">Voltar para as viagens</RouterLink>
    </div>

    <template v-else-if="trip">
      <HeaderDestination/>
      <main class="md:flex gap-16 py-10 px-4 overflow-x-hidden">
        <div class="flex-1 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="md:text-3xl text-2xl font-semibold">Atividades</h2>
            <button v-if="isOwner" @click="openCreateActivityModal" class="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400">
              <Plus class="size-5" />
              Cadastrar atividade
            </button>
          </div>
          <Activities :activities="trip.activities" @edit="onEditActivity" />
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
        :activityToEdit="editingActivity"
        :tripStartsAt="trip.startsAt"
        :tripEndsAt="trip.endsAt"
      />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { Plus } from "lucide-vue-next";
import ImportantLinks from "../views/ImportantLinks.vue";
import Activities from "../views/Activities.vue";
import Guests from "../views/Guests.vue";
import HeaderDestination from "../views/HeaderDestination.vue";
import CreateActivity from "../components/Modal/CreateActivity.vue";
import UserMenu from '@/components/UserMenu.vue';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';

const route = useRoute();
const tripStore = useTripStore();
const auth = useAuthStore();

const trip = computed(() => tripStore.trip);
const isOwner = computed(() => tripStore.trip?.ownerId === auth.user?.id);
const isCreateActivityModalOpen = ref(false);
const editingActivity = ref(null);

const loadTrip = () => tripStore.fetchTrip(route.params.id);

onMounted(loadTrip);
watch(() => route.params.id, loadTrip);

const openCreateActivityModal = () => {
  editingActivity.value = null;
  isCreateActivityModalOpen.value = true;
};

const onEditActivity = (activity) => {
  editingActivity.value = activity;
  isCreateActivityModalOpen.value = true;
};

const closeCreateActivityModal = () => {
  isCreateActivityModalOpen.value = false;
};

const handleActivitySubmit = async (formData, activityId) => {
  if (activityId) {
    await tripStore.updateActivity(trip.value.id, activityId, formData);
  } else {
    await tripStore.addActivity(trip.value.id, formData);
  }
  closeCreateActivityModal();
};
</script>
