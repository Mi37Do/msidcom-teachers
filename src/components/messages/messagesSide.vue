<template>
  <div v-if="!useMessages.messages || !useMessages.focusedChat" class="w-full h-full flex items-center justify-center">
    <span class="loading loading-spinner loading-sm"></span>
  </div>
  <div v-else class="w-full h-full  flex flex-col">
    <div class="w-full h-16 border-b border-border-color p-3 flex gap-3 items-center">
      <div class="w-10 h-10 bg-[#31363880] p-0.5 rounded-full">
        <div class="w-full h-full rounded-full overflow-hidden">
          <img v-if="useUsers.users.find(i => i.id === useMessages.focusedChat.to_user).image"
            :src="useUsers.users.find(i => i.id === useMessages.focusedChat.to_user).image" alt="">
          <span v-else class="uppercase font-semibold mt-1">{{useUsers.users.find(i => i.id ===
            useMessages.focusedChat.to_user).last_name[0]}}{{useUsers.users.find(i => i.id ===
              useMessages.focusedChat.to_user).first_name[0]}}</span>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-1 overflow-hidden">
        <span class="font-medium w-full flex truncate gap-1.5">
          <span>{{useUsers.users.find(i => i.id === useMessages.focusedChat.to_user).first_name + ' ' +
            useUsers.users.find(i => i.id === useMessages.focusedChat.to_user).last_name}} </span>
          <span class="flex-none text-[#31363880]"> - {{useUsers.users.find(i => i.id ===
            useMessages.focusedChat.to_user).type}}</span>
        </span>

      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <div ref="chatContainer" class="h-full overflow-auto">
        <div class="h-fit flex flex-col gap-2 p-3">
          <message-item v-for="(msg, index) in useMessages.messages" :key="msg.id" :message="msg" :side="index % 2" />
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="w-full h-fit flex flex-col border-t border-border-color">
      <span v-if="newMessage.type === 'Piece_jouinte'" class="w-full pt-4 pb-1 px-4 flex items-center">Piéce jointe
        uploader ...</span>

      <div class="w-full h-16  p-3 flex gap-3 items-center justify-between">
        <div class="btn btn-sm btn-square btn-outline relative">
          <input type="file" @change="async (event) => {
            loading = true
            const file = event.target.files[0];

            if (!file) {
              null
              return;
            } else {
              const base64 = await convertToBase64(file)
              newMessage.type = 'Piece_jouinte'
              newMessage.pieces_jointe = base64
            }
          }" class="absolute inset-0 opacity-0">
          <paper-clip class="w-5" />
        </div>
        <input type="text" v-model="newMessage.message" :required="newMessage.type === 'Message'"
          class="pixa-input flex-1">
        <button type="submit" class="btn btn-sm btn-square btn-outline">
          <MessageIcon class="w-5" />
        </button>

      </div>

    </form>
  </div>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages';
import messageItem from './messageItem.vue';
import { ref, onMounted, nextTick, watch, reactive, onBeforeUnmount } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/users';
import paperClip from '@/assets/icons/paperClip.vue';
import MessageIcon from '@/assets/icons/messageIcon.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64';
import { useWidgetStore } from '@/stores/widget';

const chatContainer = ref(null)
const useMessages = useMessagesStore()
const useWidget = useWidgetStore()

const { convertToBase64 } = useFileToBase64()
const route = useRoute()
const useUsers = useUserStore()

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

// Combined mounted hook
onMounted(async () => {

  useMessages.messages = []
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
}
</script>

<style lang="scss" scoped></style>
