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
        <form class="space-y-3">
          <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag class="text-zinc-400 size-5" />
            <input type="text" name="title" placeholder="Qual a atividade?"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
          </div>
          <div class="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Calendar class="text-zinc-400 size-5" />
            <input type="datetime-local" name="occurs_at" placeholder="Data e horário da atividade"
              class="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
          </div>
          <Button variant="primary" size="full">
           Salvar atividade
          </Button>
        </form>
      </div>
      </div>
</template>

<script setup lang="ts">
import { Tag,Calendar,X } from "lucide-vue-next";
import Button from "@/components/Button/Button.vue";
interface CreateActivityProps {
  closeCreateActivityModal: () => void;
  isCreateActivityModalOpen: boolean;
}

const props = defineProps<CreateActivityProps>();
</script>