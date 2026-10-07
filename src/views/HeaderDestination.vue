<template>
  <div class="space-y-2">
    <div
      class="md:px-4 px-1 py-2 sm:py-0 sm:h-16 rounded-xl bg-zinc-900 shadow-shape grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-wrap sm:justify-between sm:gap-5"
    >
      <div class="col-start-1 row-start-1 flex w-full items-center gap-2 min-w-0 sm:w-auto sm:flex-1">
        <MapPin class="size-5 text-zinc-400 shrink-0" />
        <!-- Mobile (visualização): span ocupa a linha inteira se o nome for longo,
             empurrando a data para a linha de baixo via flex-wrap -->
        <span v-if="!isEditing" class="sm:hidden text-zinc-100 truncate max-w-full shrink-0">{{ localDestination }}</span>
        <input
          v-model="localDestination"
          :readonly="!isEditing"
          type="text"
          class="text-zinc-100 focus:outline-none focus:border-lime-300 bg-transparent w-full min-w-0"
          :class="isEditing ? '' : 'hidden sm:block'"
          placeholder="Destino"
        />
        <span
          v-if="role"
          class="hidden md:inline-flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-xs font-medium border"
          :class="roleStyle"
        >
          <component :is="roleIcon" class="size-3.5" />
          {{ roleLabel }}
        </span>
      </div>

      <div class="col-start-1 row-start-2 flex items-center gap-2 shrink-0" :class="isEditing ? 'w-full sm:w-auto' : ''">
        <Calendar class="size-5 text-zinc-400 shrink-0" />
        <span v-if="!isEditing" class="sm:hidden text-sm text-zinc-100 whitespace-nowrap">{{ dateRangeLabel }}</span>
        <VueDatePicker
          v-model="localDate"
          :disabled="!isEditing"
          class="picker"
          :class="isEditing ? 'w-full sm:w-auto' : 'hidden sm:block'"
          placeholder="Quando?"
          range
          :enable-time-picker="false"
          format="dd/MM/yyyy"
          :format-locale="formatLocale"
        />
      </div>

      <div class="w-px h-6 bg-zinc-800 hidden sm:block" />

      <Button
        v-if="isOwner"
        variant="secondary"
        :disabled="isSaving"
        :aria-label="isEditing ? 'Salvar local e data' : 'Alterar local e data'"
        class="min-h-11 sm:min-h-0 px-3 sm:px-5 shrink-0"
        :class="isEditing ? 'col-span-2 w-full sm:w-auto' : 'row-start-1 row-span-2 col-start-2 min-w-11'"
        @click="toggleEditing"
      >
        <Pencil v-if="!isEditing" class="size-5 sm:hidden" />
        <Save v-else class="size-5 sm:hidden" />
        <span class="hidden sm:inline whitespace-nowrap">
          {{ isSaving ? 'Salvando...' : isEditing ? 'Salvar' : 'Alterar local/data' }}
        </span>
        <Settings2 class="size-5 hidden sm:block" />
      </Button>
    </div>

    <p v-if="errorMessage" class="text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Settings2, MapPin, Calendar, Pencil, Save } from "lucide-vue-next";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { errorMessage as toMessage } from '@/store/tripStore';
import { getMyRole, ROLE_ICON, ROLE_LABEL, ROLE_STYLE } from '@/utils/tripRole';
import Button from "../components/Button/Button.vue";

const tripStore = useTripStore();
const auth = useAuthStore();
const formatLocale = ptBR;
const isEditing = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');

const isOwner = computed(() => tripStore.trip?.ownerId === auth.user?.id);

/** Papel do usuário nesta viagem: organizador, convidado confirmado ou convite pendente */
const role = computed(() =>
  tripStore.trip && auth.user ? getMyRole(tripStore.trip, auth.user.id) : null,
);

const roleLabel = computed(() => (role.value ? ROLE_LABEL[role.value] : ''));
const roleIcon = computed(() => (role.value ? ROLE_ICON[role.value] : null));
const roleStyle = computed(() => (role.value ? ROLE_STYLE[role.value] : ''));

const localDestination = ref(tripStore.trip?.destination ?? '');
const localDate = ref<Date[]>([]);

/** Rótulo do intervalo exibido no mobile em modo visualização (o picker fica oculto) */
const dateRangeLabel = computed(() => {
  const [start, end] = localDate.value ?? [];
  if (!start || !end) return 'Quando?';
  return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
});

/** Datas do banco são meia-noite UTC (= dia anterior à noite no Brasil).
 *  O picker trabalha com dias LOCAIS — converte para meia-noite local do mesmo dia. */
const toLocalMidnight = (iso: string): Date => {
  const d = new Date(iso);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

/** Serializa com as partes LOCAIS (toISOString deslocaria o dia pelo fuso). */
const toISODate = (value: Date): string => {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
};

const toggleEditing = async (): Promise<void> => {
  const trip = tripStore.trip;
  if (!trip) return;
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
      await tripStore.updateTrip(trip.id, payload);
    } catch (e) {
      errorMessage.value = toMessage(e);
      // reverte o formulário para o estado real (evita divergência com o banco)
      localDestination.value = trip.destination;
      localDate.value = [toLocalMidnight(trip.startsAt), toLocalMidnight(trip.endsAt)];
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
