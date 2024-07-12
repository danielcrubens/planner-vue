<template>
  <button
    :class="{
      'rounded-lg px-5 font-medium flex items-center justify-center gap-2': true,
      ...variantclass,
      ...sizeclass
    }"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed,defineProps } from 'vue';
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator(value) {
      return ['primary', 'secondary'].includes(value);
    },
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'full'].includes(value);
    },
  },
});

const variantclass = computed(() => ({
  'bg-lime-300 text-lime-950 hover:bg-lime-400': props.variant === 'primary',
  'bg-zinc-800 text-zinc-200 hover:bg-zinc-700': props.variant === 'secondary',
}));

const sizeclass = computed(() => ({
  'py-2': props.size === 'default',
  'w-full h-11': props.size === 'full',
}));
</script>


