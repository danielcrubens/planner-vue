<template>
  <div v-if="props.isCreateActivityModalOpen" class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="md:w-[640px] w-11/12 rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
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
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
          <Tag class="text-zinc-400 size-5" />
          <input 
            type="text" 
            v-model="formData.title" 
            name="title" 
            placeholder="Qual a atividade?"
            class="bg-transparent md:text-lg placeholder-zinc-400 outline-none flex-1"
            @input="clearTitleError"
          />
          <div v-if="errorMessageTitle" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageTitle }}</div>
        </div>
        <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 relative">
          <Calendar class="text-zinc-400 size-5" />
          <VueDatePicker
            v-model="formData.occurs_at"
            id="dcr" 
            placeholder="Horário da atividade"
            :is24="true"
            time-picker
            format="HH:mm"
            @update:model-value="clearTimeError"
            
          />
          <div v-if="errorMessageTime" class="text-red-500 px-2 text-xs absolute -bottom-0">{{ errorMessageTime }}</div>
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
import { z } from 'zod';
import { CreateActivityProps } from '../../types/CreateActivity';


const errorMessageTitle = ref('');
const errorMessageTime = ref('');
const props = defineProps<CreateActivityProps>();
const formData = ref({ title: '', occurs_at: '' });



const titleSchema = z.string().min(1, { message: "O nome da atividade é obrigatório" });
const timeSchema = z.string().nonempty('A data é obrigatória');

const handleSubmit = () => {
  errorMessageTitle.value = '';
  errorMessageTime.value = '';
  try {
    titleSchema.parse(formData.value.title);
  } catch (e) {
    if (e instanceof z.ZodError) {
      errorMessageTitle.value = e.errors.map(err => err.message).join(', ');
    }
  }
  try {
    timeSchema.parse(formData.value.occurs_at ? formData.value.occurs_at.toString() : '');
  } catch (e) {
    if (e instanceof z.ZodError) {
      errorMessageTime.value = e.errors.map(err => err.message).join(', ');
    }
  }
  if (!errorMessageTitle.value && !errorMessageTime.value) {
    props.submitActivity(formData.value);
    formData.value = { title: '', occurs_at: '' };
  }
};

const clearTitleError = () => {
  errorMessageTitle.value = '';
};

const clearTimeError = () => {
  errorMessageTime.value = '';
};
</script>

<style   scss>
.dp__input_wrap input::placeholder {
  color: #e4e0e0!important;
  font-weight: 300;
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