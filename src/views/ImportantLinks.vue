<template>
  <div class="space-y-6">
      <h2 class="font-semibold text-xl">Links importantes</h2>

      <div class="space-y-5">
        <div class="flex items-center justify-between gap-4">
          <div class="space-y-1.5">
            <span class="block font-medium text-zinc-100">Reserva do AirBnB</span>
            <a href="#" class="block text-xs text-zinc-400 truncate hover:text-zinc-200">
              https://www.airbnb.com.br/rooms/10470001139028321098312093821903812038910
            </a>
          </div>
          <Link2 class="text-zinc-400 size-5 shrink-0" />
        </div>
      </div>

      <Button variant="secondary" size="full">
        <Plus class="size-5" />
        Cadastrar novo link
      </Button>
    </div>
    </template>

<script setup>
  import {Plus, Link2} from "lucide-vue-next";
  import Button from "../components/Button/Button.vue";


</script>

