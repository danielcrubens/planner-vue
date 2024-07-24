<template>
  <div v-if="props.isCreateActivityModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-lg font-semibold">Cadastrar atividade</h2>
          <button>
            <X class="size-5 text-zinc-400" @click="$emit('closeCreateActivityModal')"/>
          </button>
        </div>
        <p class="text-sm text-zinc-400">
          Todos convidados podem visualizar as atividades.
        </p>
      </div>
      <form @submit.prevent="createActivity" class="space-y-3">
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
          <Tag class="text-zinc-400 size-5" />
          <input type="text" v-model="formData.title" name="title" placeholder="Qual a atividade?"
            class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
        </div>
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
          <Calendar class="text-zinc-400 size-5" />
          <VueDatePicker
            v-model="formData.occurs_at"
            class="picker"
            placeholder="Horário da atividade"
            :is24="true"
            time-picker
            
            format="HH:mm"
          />
        </div>
        <Button type="submit" variant="primary" size="full">
          Salvar atividade
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tag, X, Calendar } from "lucide-vue-next";
import Button from "@/components/Button/Button.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from "vue";

interface CreateActivityProps {
  closeCreateActivityModal: () => void;
  isCreateActivityModalOpen: boolean;
  submitActivity: (formData: { title: string; occurs_at: string }) => void;
}

const props = defineProps<CreateActivityProps>();
const formData = ref({ title: '', occurs_at: '' });

const createActivity = () => {
  props.submitActivity(formData.value);
  console.log("Form data submitted:", formData.value);
  formData.value = { title: '', occurs_at: { hours: 0, minutes: 0 } }; 
};
</script>

<style  scss>
.picker {
  &::placeholder {
    color: #fff;
  }
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
  }
  svg {
    display: none !important;
  }
  .dp__disabled {
    background: transparent;
  }
}
</style>