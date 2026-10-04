<template>
  <div class="space-y-2">
    <div class="md:px-4 px-1 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div class="flex items-center gap-2">
        <MapPin class="size-5 text-zinc-400" />
        <input
          v-model="localDestination"
          :readonly="!isEditing"
          type="text"
          class="text-zinc-100 focus:outline-none focus:border-lime-300 bg-transparent w-full"
          placeholder="Destino"
        />
      </div>
      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <Calendar class="size-5 text-zinc-400" />
          <VueDatePicker
            v-model="localDate"
            :disabled="!isEditing"
            class="picker"
            placeholder="Quando?"
            range
            :enable-time-picker="false"
            format="dd/MM/yyyy"
            :format-locale="formatLocale"
          />
        </div>
        <div class="w-px h-6 bg-zinc-800" />
        <Button v-if="isOwner" variant="secondary" :disabled="isSaving" @click="toggleEditing">
          {{ isSaving ? 'Salvando...' : isEditing ? 'Salvar' : 'Alterar local/data' }}
          <Settings2 class="size-5" />
        </Button>
      </div>
    </div>

    <p v-if="errorMessage" class="text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Settings2, MapPin, Calendar } from "lucide-vue-next";
import { ptBR } from 'date-fns/locale';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { errorMessage as toMessage } from '@/store/tripStore';
import Button from "../components/Button/Button.vue";

const tripStore = useTripStore();
const auth = useAuthStore();
const formatLocale = ptBR;
const isEditing = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');

const isOwner = computed(() => tripStore.trip?.ownerId === auth.user?.id);

const localDestination = ref(tripStore.trip?.destination ?? '');
const localDate = ref([]);

/** Datas do banco são meia-noite UTC (= dia anterior à noite no Brasil).
 *  O picker trabalha com dias LOCAIS — converte para meia-noite local do mesmo dia. */
const toLocalMidnight = (iso) => {
  const d = new Date(iso);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

/** Serializa com as partes LOCAIS (toISOString deslocaria o dia pelo fuso). */
const toISODate = (value) => {
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const toggleEditing = async () => {
  errorMessage.value = '';
  if (isEditing.value) {
    if (!localDestination.value || !localDate.value || localDate.value.length < 2) {
      errorMessage.value = 'Informe destino e período completos';
      return;
    }
    isSaving.value = true;
    const payload = {
      destination: localDestination.value,
      starts_at: toISODate(localDate.value[0]),
      ends_at: toISODate(localDate.value[1]),
    };
    try {
      await tripStore.updateTrip(tripStore.trip.id, payload);
    } catch (e) {
      errorMessage.value = toMessage(e);
      // reverte o formulário para o estado real (evita divergência com o banco)
      localDestination.value = tripStore.trip.destination;
      localDate.value = [toLocalMidnight(tripStore.trip.startsAt), toLocalMidnight(tripStore.trip.endsAt)];
      isSaving.value = false;
      return;
    }
    isSaving.value = false;
  }
  isEditing.value = !isEditing.value;
};

watch(
  () => tripStore.trip,
  (trip) => {
    if (!trip) return;
    localDestination.value = trip.destination;
    localDate.value = [toLocalMidnight(trip.startsAt), toLocalMidnight(trip.endsAt)];
  },
  { immediate: true },
);
</script>
