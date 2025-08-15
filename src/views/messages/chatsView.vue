<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center ">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full ">
    <!---->
    <add-chat-modal :users="useStudent.parents" />

    <div class="w-full h-full flex flex-col gap-3 overflow-hidden px-6  bg-white pt-3 border-t border-border-color">

      <div class="flex flex-col gap-3">
        <div class="w-full pb-4 border-b border-border-color  flex items-center justify-between mt-1 mb-3">
          <span class="pixa-title-3">Nouvelle Discussion</span>

          <button @click="useWidget.addChat = true" class="btn btn-sm btn-primary w-10 p-1">
            <plus class="fill-white w-5" />
          </button>
        </div>
      </div>

      <div v-if="useMessages.filtredChats.length > 0" class="w-full flex-1 overflow-hidden">
        <div class="h-full overflow-auto hidden-scrollbar">
          <div class="h-fit flex flex-col gap-1">
            <chatItem v-for="item in useMessages.filtredChats" :item="item" :key="item.id" />
          </div>
        </div>
      </div>
      <commun-no-data v-else />
    </div>

  </div>
</template>

<script setup>
import communNoData from "@/components/commun/communNoData.vue";
import { useMessagesStore } from "@/stores/messages";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/users";
import addChatModal from "@/components/messages/addChatModal.vue";
import chatItem from '@/components/messages/chatItem.vue'
import plus from "@/assets/icons/plus.vue";
import { useWidgetStore } from "@/stores/widget";
import { useStudentStore } from "@/stores/students";

const useMessages = useMessagesStore()
const useWidget = useWidgetStore()
const useUsers = useUserStore()
const useStudent = useStudentStore()
const loading = ref(true)
const usersTypes = ref(
  [
    {
      id: 'PARENT',
      designation: 'Parent'
    }, {
      id: 'PROF',
      designation: 'Proffesseur'
    }
  ]
)

onMounted(async () => {
  try {
    // await useMessages.getInterviews()
    await useMessages.getChats()
    await useStudent.getParents()
    console.log(useStudent.parents)

    console.log(useMessages.chats)

    useMessages.filtredChats = useMessages.chats

    loading.value = false
  } catch (error) {
    console.error(error)
  }

})

</script>

<style lang="scss" scoped></style>
