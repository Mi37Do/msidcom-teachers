<template>
  <div v-if="loading" class="w-full h-full flex items-center justify-center ">
    <span class="loading loading-spinner loading-sm"></span>
  </div>

  <div v-else class="w-full h-full ">
    <!---->
    <add-chat-modal :users="useStudent.parents" />

    <div class="w-full h-full flex flex-col gap-3 overflow-hidden px-6  bg-white pt-3 border-t border-border-color">

      <div class="flex flex-col gap-3 pb-4 border-b border-border-color">
        <div class="w-full   flex items-center justify-between mt-1">
          <span class="pixa-title-3">Nouvelle Discussion</span>

          <button @click="useWidget.addChat = true" class="btn btn-sm btn-primary w-10 p-1">
            <plus class="fill-white w-5" />
          </button>
        </div>
        <div class="relative flex-1 flex items-center">
          <search class="w-5 h-5 absolute left-3 fill-slate-600" />
          <input type="text" v-model="query"
            :placeholder="t('translation.search') + ' ' + t('translation.un') + ' ' + t('translation.parent') + ' ...'"
            class="pixa-input-icon w-full pr-4 pl-10">
        </div>
      </div>
      <div v-if="useMessages.filtredChats.length > 0" class="w-full flex-1 overflow-hidden">
        <div class="h-full overflow-y-auto hidden-scrollbar">
          <div class="h-fit flex flex-col  overflow-x-hidden gap-1">
            <span
              v-if="useMessages.filtredChats.find(i => i.to_user_id === useWidget.authUser.userDetail.manager_id || i.from_user_id === useWidget.authUser.userDetail.manager_id)"
              class="text-secondary-2 font-medium">Administration</span>

            <!-- -->
            <chatItem
              v-if="useMessages.filtredChats.find(i => i.to_user_id === useWidget.authUser.userDetail.manager_id || i.from_user_id === useWidget.authUser.userDetail.manager_id)"
              :item="useMessages.filtredChats.find(i => i.to_user_id === useWidget.authUser.userDetail.manager_id || i.from_user_id === useWidget.authUser.userDetail.manager_id)" />
            <span
              v-if="useMessages.filtredChats.find(i => i.to_user_id === useWidget.authUser.userDetail.manager_id || i.from_user_id === useWidget.authUser.userDetail.manager_id)"
              class="h-px bg-border-color"></span>
            <span class="text-secondary-2 font-medium mt-2">Parent d’élèves</span>

            <chatItem
              v-for="item in filtredChats.filter(i => i.
                from_user_type !== useWidget.authUser.userDetail.manager_id && i.from_user_id !== useWidget.authUser.userDetail.manager_id)"
              :item="item" :key="item.id" />

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
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/users";
import addChatModal from "@/components/messages/addChatModal.vue";
import chatItem from '@/components/messages/chatItem.vue'
import plus from "@/assets/icons/plus.vue";
import { useWidgetStore } from "@/stores/widget";
import { useStudentStore } from "@/stores/students";
import search from "@/assets/icons/search.vue";
import { useI18n } from "vue-i18n";

const useMessages = useMessagesStore()
const useWidget = useWidgetStore()
const useUsers = useUserStore()
const { t } = useI18n()
const useStudent = useStudentStore()
const query = ref('')
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
    useMessages.filtredChats = useMessages.chats
    setInterval(async () => {
      await useMessages.getChats()
    }, 5000)
    loading.value = false
  } catch (error) {
    console.error(error)
  }

})

const filtredChats = computed(() => {
  const search = query.value.trim().toLowerCase()

  if (!search) return useMessages.chats

  return useMessages.chats.filter(chatItem => {
    return (
      chatItem.from_user_first_name?.toLowerCase().includes(search) ||
      chatItem.from_user_last_name?.toLowerCase().includes(search) ||
      chatItem.to_user_first_name?.toLowerCase().includes(search) ||
      chatItem.to_user_last_name?.toLowerCase().includes(search)
    )
  })
})
</script>

<style lang="scss" scoped></style>
