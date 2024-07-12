<template>
<div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block font-medium text-zinc-100">Jessica White</span>
            <span className="block text-sm text-zinc-400 truncate">
              jessica.white44@yahoo.com
            </span>
          </div>

          <CircleDashed className="text-zinc-400 size-5 shrink-0" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block font-medium text-zinc-100">Dr. Rita Pacocha</span>
            <span className="block text-sm text-zinc-400 truncate">
              lacy.stiedemann@gmail.com
            </span>
          </div>

          <CircleDashed className="text-zinc-400 size-5 shrink-0" />
        </div>
      </div>

      <Button variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
    </div>
</template>

<script setup>
  import { CircleDashed, UserCog } from "lucide-vue-next";
  import Button from "../components/Button/Button.vue";
</script>

