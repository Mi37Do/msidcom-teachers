import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useWidgetStore } from './widget'

export const useRoomStore = defineStore('room', () => {
  const rooms = ref([])
  const classes = ref([])
  const focusedClass = ref(null)
  const focusedRoom = ref(null)
  const exams = ref([])
  const filtredExams = ref([])
  const focusedExam = ref(null)
  const contents = ref([])
  const filtredContent = ref([])
  const focusedContent = ref(null)
  const useWidget = useWidgetStore()

  const getClasses = async (id) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Classe/${id}/`)
        focusedClass.value = response.data
      } else {
        let response = await axios.get('/api/Classe_par_Prof_sql/')
        classes.value = response.data?.Classe
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getContent = async (id, filter) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Planning_course/${id}/`)
        focusedContent.value = response.data
      } else if (filter) {
        let response = await axios.get(`/api/Planning_course/?${filter}`)
        filtredContent.value = response.data
        contents.value = response.data
      } else {
        let response = await axios.get('/api/Planning_course/')
        filtredContent.value = response.data
        contents.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getRooms = async (id) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Salle/${id}/`)
        focusedRoom.value = response.data
      } else {
        let response = await axios.get('/api/Salle/')
        rooms.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }
  const getExams = async (id) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Examens/${id}/`)
        focusedExam.value = response.data
      } else {
        let response = await axios.get('/api/Examens/')
        exams.value = response.data
        filtredExams.value = response.data
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
    getClasses,
    classes,
    rooms,
    getRooms,
    focusedRoom,
    focusedClass,
    getExams,
    exams,
    filtredExams,
    focusedExam,
    getContent,
    contents,
    filtredContent,
    focusedContent,
  }
})
