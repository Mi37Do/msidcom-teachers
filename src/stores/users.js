import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useWidgetStore } from './widget'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const filtredUsers = ref([])
  const roles = ref([])
  const profs = ref([])
  const focusedProf = ref(null)
  const focusedUser = ref(null)
  const focusedRole = ref(null)
  const filtredProfs = ref([])
  const useWidget = useWidgetStore()

  const responsabilites = ref([])

  const filtredRoles = ref([])

  const getRoles = async () => {
    try {
      let response = await axios.get('/api/Role/')
      filtredRoles.value = response.data
      roles.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getProfs = async (id) => {
    try {
      if (id) {
        let response = await axios.get(`/api/User/${id}/`)
        focusedProf.value = response.data
      } else {
        let response = await axios.get(`/api/User/?type=PROF`)
        profs.value = response.data
        filtredProfs.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getResponsabilites = async (id) => {
    try {
      let response = await axios.get(`/api/Responsabilite/?prof=${id}`)
      responsabilites.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getUsers = async (filters) => {
    try {
      if (filters) {
        let response = await axios.get(`/api/User/?${filters}`)
        users.value = response.data
        filtredUsers.value = response.data
      } else {
        let response = await axios.get('/api/User/?type=USER')
        users.value = response.data
        filtredUsers.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getAllUsers = async (filters) => {
    try {
      if (filters) {
        let response = await axios.get(`/api/User/`)
        profs.value = response.data
      } else {
        let response = await axios.get('/api/User/')
        users.value = response.data
        filtredUsers.value = response.data
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
    getRoles,
    roles,
    users,
    getUsers,
    focusedUser,
    focusedRole,
    profs,
    focusedProf,
    getProfs,
    filtredUsers,
    filtredRoles,
    getResponsabilites,
    responsabilites,
    filtredProfs,
    getAllUsers,
  }
})
