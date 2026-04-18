<template>
  <div class="w-full h-full overflow-hidden">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificationBadge } from '@/stores/notifications'

const useNotif = useNotificationBadge()
onMounted(() => useNotif.markTypesRead(['ABSENCE_RETARD_ELEVE', 'STATUE_PRESENCE_ELEVE', 'CONVOCATION', 'ANNONCE', 'BULLETIN_DISPONIBLE']))
</script>

<style lang="scss" scoped></style>
