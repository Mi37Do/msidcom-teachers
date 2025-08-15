import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useMessagesStore = defineStore('messages', () => {
  const chats = ref([])
  const focusedChat = ref(null)
  const filtredChats = ref([])
  const messages = ref([])
  const interviews = ref([])

  const focusedInterview = ref(null)

  const getChats = async (id, filter) => {
    try {
      if (id) {
        let response = await axios.get(`/api/discussions/${id}`)
        focusedChat.value = response.data
      } else if (filter) {
        let response = await axios.get(`/api/discussions/?${filter}`)
        chats.value = response.data
        filtredChats.value = response.data
      } else {
        let response = await axios.get(`/api/discussions/`)
        chats.value = response.data
        filtredChats.value = response.data
        console.log(filtredChats.value)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getMessages = async (filter) => {
    try {
      if (filter) {
        let response = await axios.get(`/api/messages/?${filter}`)
        messages.value = response.data
      } else {
        let response = await axios.get(`/api/messages/`)
        messages.value = response.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getInterviews = async (filter) => {
    try {
      if (filter) {
        let response = await axios.get(`/api/Entrevue/?${filter}`)
        interviews.value = response.data
      } else {
        let response = await axios.get(`/api/Entrevue/`)
        interviews.value = response.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    chats,
    filtredChats,
    focusedChat,
    messages,
    getChats,
    getMessages,
    getInterviews,
    interviews,
    focusedInterview,
  }
})
