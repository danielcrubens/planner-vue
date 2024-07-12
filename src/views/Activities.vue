<template>
    <div class="space-y-8">
      <div class="space-y-2.5">
        <div class="flex gap-2 items-baseline">
          <span class="text-xl text-zinc-300 font-semibold">Dia 17</span>
          <span class="text-xs text-zinc-500">Sábado</span>
        </div>

        <p class="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
      </div>

      <div class="space-y-2.5">
        <div class="flex gap-2 items-baseline">
          <span class="text-xl text-zinc-300 font-semibold">Dia 18</span>
          <span class="text-xs text-zinc-500">Domingo</span>
        </div>
        <div class="space-y-2.5">
          <div class="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
            <CircleCheck class="size-5 text-lime-300" />
            <span class="text-zinc-100">Academia em grupo</span>
            <span class="text-zinc-400 text-sm ml-auto">08:00h</span>
          </div>
        </div>
        <div class="space-y-2.5">
          <div class="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
            <CircleCheck class="size-5 text-lime-300" />
            <span class="text-zinc-100">Academia em grupo</span>
            <span class="text-zinc-400 text-sm ml-auto">08:00h</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { CircleCheck} from "lucide-vue-next";

</script>

