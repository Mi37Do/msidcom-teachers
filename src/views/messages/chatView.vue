<template>
  <div v-if="!useMessages.messages || !useMessages.focusedChat" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>
  <div v-else class="w-full h-full  flex flex-col overflow-hidden">
    <router-link :to="{ name: 'chats-view' }"
      class="w-full h-16 border-y border-border-color p-3 flex gap-3 items-center bg-white">
      <arrow-icon class="w-5 rotate-180 fill-primary" />
      <div class="w-10 h-10 bg-primary/30 p-0.5 rounded-full">
        <div v-if="useWidget.authUser.userDetail.id === useMessages.focusedChat.from_user"
          class="w-full h-full rounded-full overflow-hidden  flex items-center justify-center">
          <img v-if="useMessages.focusedChat.users_details[0].to_user_details.image" class="object-cover w-full h-full"
            :src="useMessages.focusedChat.users_details
            [0].to_user_details.image" alt="">
          <span v-else class="uppercase font-semibold">{{
            useMessages.focusedChat.users_details[0].to_user_details.last_name[0] }}{{
              useMessages.focusedChat.users_details
              [0].to_user_details.first_name[0] }}</span>
        </div>

        <div v-else class="w-full h-full rounded-full overflow-hidden  flex items-center justify-center">
          <img v-if="useMessages.focusedChat.users_details[0].from_user_details.image" :src="useMessages.focusedChat.users_details
          [0].from_user_details.image" class="object-cover w-full h-full" alt="">
          <span v-else class="uppercase font-semibold">{{
            useMessages.focusedChat.users_details[0].from_user_details.last_name[0] }}{{
              useMessages.focusedChat.users_details
              [0].from_user_details.first_name[0] }}</span>
        </div>
      </div>
      <div v-if="useWidget.authUser.userDetail.id === useMessages.focusedChat.from_user"
        class="flex-1 flex flex-col gap-1 overflow-hidden">
        <span class="font-medium w-full flex truncate gap-1.5">
          <span>{{ useMessages.focusedChat.users_details[0].to_user_details.first_name + ' ' +
            useMessages.focusedChat.users_details[0].to_user_details.last_name }} </span>
        </span>
      </div>
      <div v-else class="flex-1 flex flex-col gap-1 overflow-hidden">
        <span class="font-medium w-full flex truncate gap-1.5">
          <span>{{ useMessages.focusedChat.users_details[0].from_user_details.first_name + ' ' +
            useMessages.focusedChat.users_details[0].from_user_details.last_name }} </span>
        </span>
      </div>
    </router-link>

    <div class="flex-1 overflow-hidden  bg-white">
      <div ref="chatContainer" class="h-full overflow-auto">
        <div class="h-fit flex flex-col gap-2 p-3">
          <message-item v-for="(msg, index) in useMessages.messages" :key="msg.id" :message="msg" :side="index % 2" />
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="w-full h-fit flex flex-col border-t border-border-color">
      <div v-if="newMessage.type === 'Piece_jouinte'">
        <span v-if="loadFile" class="w-full pt-4 pb-1 px-4 flex items-center animate-pulse font-medium">Téléchargement
          en
          cours ...</span>

        <div v-else @click="() => {
          newMessage.type = 'Message'
          newMessage.pieces_jointe = null
        }" class="w-full px-3 pt-3 flex items-center justify-between">

          <div class="flex-1 flex gap-3">
            <file-alt class="w-8 fill-secondary-2"></file-alt>
            <span class="flex items-center font-medium text-secondary-2">Fichier télécharger</span>
          </div>

          <button class="btn btn-sm btn-square btn-ghost">
            <times class="w-6" />
          </button>
        </div>
      </div>



      <div class="w-full h-16  p-3 flex gap-3 items-center justify-between">
        <div class="btn btn-sm btn-square btn-outline relative">
          <input type="file" @change="async (event) => {

            loadFile = true
            const file = event.target.files[0];
            if (!file) {
              null
              return;
            } else {
              const base64 = await convertToBase64(file)
              newMessage.type = 'Piece_jouinte'
              newMessage.pieces_jointe = base64
            }
            loadingFalse()
          }" class="absolute inset-0 opacity-0">
          <paper-clip class="w-5" />
        </div>
        <input type="text" v-model="newMessage.message" :required="newMessage.type === 'Message'"
          class="pixa-input flex-1">
        <button type="submit" class="btn btn-sm btn-square btn-outline">

          <span v-if="loading" class="loading loading-spinner loading-sm"></span>
          <MessageIcon v-else class="w-5" />
        </button>

      </div>

    </form>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages';
import messageItem from '@/components/messages/messageItem.vue';
import { ref, onMounted, nextTick, watch, reactive, onBeforeUnmount } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/users';
import paperClip from '@/assets/icons/paperClip.vue';
import MessageIcon from '@/assets/icons/messageIcon.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64';
import { useWidgetStore } from '@/stores/widget';
import fileAlt from '@/assets/icons/fileAlt.vue';
import arrowIcon from '@/assets/icons/arrowIcon.vue';
import times from '@/assets/icons/times.vue';

const chatContainer = ref(null)
const useMessages = useMessagesStore()

const { convertToBase64 } = useFileToBase64()
const route = useRoute()
const useUsers = useUserStore()
const useWidget = useWidgetStore()
const loading = ref(false)
const loadFile = ref(false)
const newMessage = reactive({
  discuss: route.params.id,
  message: null,
  pieces_jointe: null,
  type: 'Message',
  sender: useWidget.authUser.userDetail.id
})

// Track if we should auto-scroll (false if user manually scrolls up)
const shouldAutoScroll = ref(true)

// Enhanced scroll to bottom function
const scrollToBottom = (behavior = 'smooth') => {
  if (chatContainer.value && shouldAutoScroll.value) {
    nextTick(() => {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior: behavior
      })
    })
  }
}

// Handle user scroll events
const handleScroll = () => {
  const container = chatContainer.value
  if (container) {
    // If user scrolls up, pause auto-scroll until they reach bottom again
    shouldAutoScroll.value =
      container.scrollHeight - container.scrollTop - container.clientHeight < 50
  }
}

const loadingFalse = () => {

  setTimeout(() => {
    loadFile.value = false
  }, 2000)
}

// Combined mounted hook
onMounted(async () => {
  useMessages.messages = []
  await useMessages.getChats(route.params.id)
  console.log(useMessages.focusedChat);

  await useMessages.getMessages(`discuss=${route.params.id}`)
  await useMessages.getChats(route.params.id)


  // Add scroll event listener
  if (chatContainer.value) {
    chatContainer.value.addEventListener('scroll', handleScroll)
  }

  // Initial scroll (instant)
  scrollToBottom('instant')
})

// Clean up event listener
onBeforeUnmount(() => {
  if (chatContainer.value) {
    chatContainer.value.removeEventListener('scroll', handleScroll)
  }
})

// Optimized watch for messages
watch(() => useMessages.messages, () => {
  scrollToBottom()
}, { deep: true })

watch(() => route.params.id, async () => {
  useMessages.messages = []
  await useMessages.getMessages(`discuss=${route.params.id}`)


  newMessage.discuss = route.params.id
  scrollToBottom()
})

const initStore = () => {
  Object.assign(newMessage, {
    discuss: route.params.id,
    message: '',
    pieces_jointe: '',
    type: 'Message'
  })
}

const sendMessage = async () => {
  loading.value = true
  try {
    if (newMessage.type === 'Message') {
      delete newMessage.pieces_jointe
    }
    let response = await axios.post(`/api/messages/`, newMessage)
    initStore()
    await useMessages.getMessages(`discuss=${route.params.id}`)
    useMessages.getChats()

  } catch (error) {
    console.error(error)
  }
  loading.value = false
}
</script>

<style lang="scss" scoped></style>
