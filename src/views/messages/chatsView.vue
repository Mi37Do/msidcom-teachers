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
        <div class="h-full overflow-auto hidden-scrollbar">
          <div class="h-fit flex flex-col gap-1">
            <span class="text-secondary-2 font-medium">Administration</span>
            <chatItem
              :item="useMessages.filtredChats.find(i => i.to_user === useWidget.authUser.userDetail.manager || i.from_user === useWidget.authUser.userDetail.manager)" />
            <span class="h-px bg-border-color"></span>
            <span class="text-secondary-2 font-medium mt-2">Parent d’élèves</span>
            <chatItem
              v-for="item in filtredChats.filter(i => i.to_user !== useWidget.authUser.userDetail.manager && i.from_user !== useWidget.authUser.userDetail.manager)"
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
    console.log(useStudent.parents)

    console.log(useMessages.chats)

    useMessages.filtredChats = useMessages.chats

    loading.value = false
  } catch (error) {
    console.error(error)
  }

})

const filtredChats = computed(() => {
  const search = query.value.trim().toLowerCase()

  return useMessages.filtredChats.filter(chatItem => {
    // make sure users_details is an array
    return Array.isArray(chatItem.users_details) &&
      chatItem.users_details.some(user => {
        // optional chaining so we don't crash if a field is missing
        return (
          user.from_user_details?.first_name?.toLowerCase().includes(search) ||
          user.from_user_details?.last_name?.toLowerCase().includes(search) ||
          user.to_user_details?.first_name?.toLowerCase().includes(search) ||
          user.to_user_details?.last_name?.toLowerCase().includes(search)
        )
      })
  })
})
</script>

<style lang="scss" scoped></style>
