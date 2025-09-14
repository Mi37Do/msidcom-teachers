<template>
  <div class="w-full h-full flex flex-col gap-3 overflow-hidden px-6  pt-3">
    <div v-if="useMessages.interviews.length > 0" class="w-full flex-1 overflow-hidden">
      <div class="h-full overflow-auto hidden-scrollbar">
        <div class="h-fit flex flex-col gap-1">
          <interview-item v-for="item in useMessages.interviews" :item="item" :key="item.id" />
        </div>
      </div>
    </div>
    <commun-no-data v-else />
  </div>
</template>

<script setup>
import communNoData from "@/components/commun/communNoData.vue";
import { useMessagesStore } from "@/stores/messages";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/users";
import interviewItem from "@/components/messages/interviewItem.vue";
import { useWidgetStore } from "@/stores/widget";
import { useStudentStore } from "@/stores/students";

const useMessages = useMessagesStore()
const useWidget = useWidgetStore()
const useUsers = useUserStore()
const useStudent = useStudentStore()
const loading = ref(true)
const tempStudents = ref([])
const tempProfs = ref([])

onMounted(async () => {
  try {
    // await useMessages.getInterviews()
    await useMessages.getInterviews()
    await useUsers.getProfs()
    await useStudent.getStudents(null, `prof=${useWidget.authUser.userDetail.id}`)
    tempStudents.value = useStudent.filterdStudents.map(item => {
      return {
        id: item.id,
        designation: item.nom + ' ' + item.prenom
      }
    })

    tempProfs.value = useUsers.profs.map(item => {
      return {
        id: item.id,
        designation: item.first_name + ' ' + item.last_name
      }
    })

    loading.value = false
  } catch (error) {
    console.error(error)
  }

})
</script>

<style lang="scss" scoped></style>
