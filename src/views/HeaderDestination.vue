<template>
 <div class="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
        <div class="flex items-center gap-2">
          <MapPin class="size-5 text-zinc-400" />
          <span class="text-zinc-100">Florianópolis, Brasil</span>
        </div>

        <div class="flex items-center gap-5">
          <div class="flex items-center gap-2">
            <Calendar class="size-5 text-zinc-400" />
            <span class="text-zinc-100">17 a 23 de Agosto</span>
          </div>

          <div class="w-px h-6 bg-zinc-800" />

         <Button  variant="secondary">
          Alterar local/data"
          <Settings2 class="size-5" />
          </Button>
        </div>
      </div>
</template>

<script setup>
  import { Settings2, MapPin, Calendar } from "lucide-vue-next";
  import Button from "../components/Button/Button.vue";
</script>
