<template>
  <div v-if="props.isCreateActivityModalOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
    <div class="md:w-[640px] w-11/12 rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-lg font-semibold">{{ activityToEdit ? 'Editar atividade' : 'Cadastrar atividade' }}</h2>
          <button>
            <X class="size-5 text-zinc-400" @click="$emit('closeCreateActivityModal')" />
          </button>
        </div>
        <p class="text-sm text-zinc-400">
          Todos convidados podem visualizar as atividades.
        </p>
        <p v-if="tripPeriod" class="text-xs text-zinc-500">
          Período da viagem: <span class="text-zinc-300">{{ tripPeriod }}</span>
        </p>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
          <Tag class="text-zinc-400 size-5" />
          <input type="text" v-model="formData.title" name="title" placeholder="Qual a atividade?"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1" @input="clearTitleError" />
          <div v-if="errorMessageTitle" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageTitle }}
          </div>
        </div>
        <div class="w-2/2 lg:flex gap-9 space-y-3 lg:space-y-0">
          <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
            <Clock3 class="text-zinc-400 size-5" />
            <VueDatePicker v-model="formData.occurs_at" id="dcr" placeholder="Horário da atividade" :is24="true"
              time-picker format="HH:mm" @update:model-value="clearTimeError" />
            <div v-if="errorMessageTime" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageTime }}
            </div>
          </div>
          <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
            <Calendar class="text-zinc-400 size-5" />
            <VueDatePicker v-model="formData.date" placeholder="Data" :format="dateFormat" :format-locale="formatLocale"
              :week-days="weekDays" auto-apply hide-time-header :min-date="minDate" :max-date="maxDate"
              @update:model-value="clearDateError" />
            <div v-if="errorMessageDate" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageDate }}
            </div>
          </div>
        </div>
        <p v-if="submitError" class="text-red-500 text-xs">{{ submitError }}</p>
        <Button type="submit" variant="primary" size="full" :disabled="isSubmitting">
          <Save class="size-5" />
          {{ isSubmitting ? 'Salvando...' : activityToEdit ? 'Salvar alterações' : 'Salvar atividade' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tag, X, Calendar, Clock3, Save } from "lucide-vue-next";
import Button from "@/components/Button/Button.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref, watch } from "vue";
import { z } from 'zod';
import { ptBR } from 'date-fns/locale';
import { CreateActivityProps } from '../../types/CreateActivity';
import { errorMessage as toMessage } from '@/store/tripStore';

const errorMessageTitle = ref('');
const errorMessageTime = ref('');
const errorMessageDate = ref('');
const isSubmitting = ref(false);
const submitError = ref('');
const props = defineProps<CreateActivityProps>();
const emit = defineEmits<{ (e: 'closeCreateActivityModal'): void }>();
const formData = ref({ title: '', occurs_at: null as Date | null, date: null as Date | null });

// modo edição: pré-preenche a partir da atividade selecionada
watch(
  () => props.activityToEdit,
  (activity) => {
    if (!activity) {
      formData.value = { title: '', occurs_at: null, date: null };
      return;
    }
    const occurs = new Date(activity.occursAt);
    formData.value = { title: activity.title, occurs_at: occurs, date: occurs };
  },
  { immediate: true },
);

const titleSchema = z.string().min(1, { message: "O nome da atividade é obrigatório" });

const handleSubmit = async () => {
  errorMessageTitle.value = '';
  errorMessageTime.value = '';
  errorMessageDate.value = '';
  submitError.value = '';

  const titleResult = titleSchema.safeParse(formData.value.title);
  if (!titleResult.success) {
    errorMessageTitle.value = titleResult.error.errors[0].message;
  }
  if (!formData.value.occurs_at) {
    errorMessageTime.value = 'A hora é obrigatória';
  }
  if (!formData.value.date) {
    errorMessageDate.value = 'A data é obrigatória';
  }
  if (errorMessageTitle.value || errorMessageTime.value || errorMessageDate.value) return;

  isSubmitting.value = true;
  try {
    await props.submitActivity(
      {
        title: formData.value.title,
        occurs_at: toISODateTime(formData.value.date!, formData.value.occurs_at!),
      },
      props.activityToEdit?.id,
    );
    formData.value = { title: '', occurs_at: null, date: null };
  } catch (e) {
    submitError.value = toMessage(e);
  } finally {
    isSubmitting.value = false;
  }
};

/** Data + hora dos dois pickers → ISO com timezone local.
 *  Tolerante aos formatos do VueDatePicker: Date, {hours,minutes} ou "HH:mm". */
const toISODateTime = (date: unknown, time: unknown): string => {
  const d = date instanceof Date ? date : new Date(String(date));

  let hours = 0;
  let minutes = 0;
  if (time instanceof Date) {
    hours = time.getHours();
    minutes = time.getMinutes();
  } else if (time && typeof time === 'object') {
    hours = Number((time as { hours: number }).hours ?? 0);
    minutes = Number((time as { minutes: number }).minutes ?? 0);
  } else {
    const [h, m] = String(time).split(':');
    hours = Number(h);
    minutes = Number(m ?? 0);
  }

  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes).toISOString();
};

const clearTitleError = () => {
  errorMessageTitle.value = '';
};

const clearTimeError = () => {
  errorMessageTime.value = '';
};
const clearDateError = () => {
  errorMessageDate.value = '';
};

const dateFormat = 'dd/MM/yyyy';
const formatLocale = ptBR;
const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

/** Datas do banco são meia-noite UTC; o dia gravado é o slice do ISO
 *  (formatar com Date local deslocaria um dia em fusos negativos). */
const storedDay = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/');
const localMidnight = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Limites do período da viagem (o backend continua validando como fonte de verdade).
 *  maxDate vai até o FIM do último dia — meia-noite cortaria o próprio dia final. */
const minDate = computed(() => (props.tripStartsAt ? localMidnight(props.tripStartsAt) : undefined));
const maxDate = computed(() => {
  if (!props.tripEndsAt) return undefined;
  const [y, m, d] = props.tripEndsAt.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59);
});
const tripPeriod = computed(() => {
  if (!props.tripStartsAt || !props.tripEndsAt) return '';
  const start = storedDay(props.tripStartsAt);
  const end = storedDay(props.tripEndsAt);
  return start === end ? start : `${start} – ${end}`;
});
</script>

<style scss>
.dp__input_wrap input::placeholder {
  color: #e4e0e0 !important;
  font-weight: 300;
}
.dp__btn.dp__button.dp__button_bottom {
  visibility: hidden;

}
.dp__theme_light {
  outline: none;
  --dp-background-color: #18181b;
  --dp-text-color: #fff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #fff;
  --dp-primary-color: #a3e635;
  --dp-primary-text-color: #18181b;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
}

.dp__action_buttons {
  display: block;
  flex: auto;
  white-space: nowrap;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: auto;
}

.dp__input_wrap {
  .dp__input {
    border: none !important;
  }

  input {
    font-size: 1.125rem;
    font-family: Inter, sans-serif;
    padding: 0;
    background: transparent;

    @media screen and (max-width: 640px) {
      font-size: 1rem;
    }
  }

  svg {
    display: none !important;
  }

  .dp__disabled {
    background: transparent;
  }
}
</style>
