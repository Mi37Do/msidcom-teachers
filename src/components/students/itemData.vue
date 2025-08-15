<template>
  <router-link :to="{ name: 'student-view', params: { studentId: item.id } }"
    class="w-full py-2 border-b border-border-color hover:bg-slate-50 px-3 grid gap-1.5 grid-cols-3 h-14">
    <span class="my-auto truncate flex items-center gap-3">
      <span class="truncate">
        {{ item.prenom }} {{ item.nom }}</span>
    </span> <span class="my-auto truncate flex items-center gap-3">
      <span class="">
        {{ item.sexe }}</span>
    </span>
    <div class="my-auto truncate flex items-center gap-3">
      <span class="">
        {{ format(parse(item.birthday, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') }}</span>

      <angle-icon class="w-5 -rotate-90" />
    </div>
  </router-link>
</template>

<script setup>
import angleIcon from '@/assets/icons/angleIcon.vue';
import { format, parse } from 'date-fns';

const props = defineProps(['item'])

</script>

<style lang="scss" scoped></style>
