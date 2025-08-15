import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useWidgetStore } from './widget'

export const useEventStore = defineStore('event', () => {
  const events = ref([])
  const filtredEvents = ref([])
  const focusedEvents = ref(null)

  const annoncements = ref([])
  const filtredAnnoncements = ref([])

  const useWidget = useWidgetStore()

  const getEvents = async (id, filter) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Event/${id}/`)
        focusedEvents.value = response.data
      } else if (filter) {
        let response = await axios.get(`/api/Event/?${filter}`)
        filtredEvents.value = response.data
        events.value = response.data
      } else {
        let response = await axios.get('/api/Event/')
        filtredEvents.value = response.data
        events.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getAnnoncements = async (id, filter) => {
    try {
      if (filter) {
        let response = await axios.get(`/api/Annonce_prof/?${filter}`)
        annoncements.value = response.data
        filtredAnnoncements.value = response.data
      } else {
        let response = await axios.get('/api/Annonce_prof/')
        annoncements.value = response.data
        filtredAnnoncements.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  return {
    events,
    getEvents,
    filtredEvents,
    focusedEvents,
    getAnnoncements,
    annoncements,
    filtredAnnoncements,
  }
})
