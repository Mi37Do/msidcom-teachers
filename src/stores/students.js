import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useWidgetStore } from './widget'

export const useStudentStore = defineStore('student', () => {
  const students = ref([])
  const parents = ref([])
  const focusedStudent = ref(null)
  const focusedParent = ref(null)
  const filterdStudents = ref([])
  const useWidget = useWidgetStore()
  const abscences = ref([])
  const filtredAbscences = ref([])
  const filterdParents = ref([])
  const focusedSummon = ref(null)

  const getParents = async () => {
    try {
      let response = await axios.get('/api/User/?type=PARENT')
      parents.value = response.data
      filterdParents.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getStudents = async (id, filter) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Eleve/${id}/`)
        focusedStudent.value = response.data
      } else if (filter) {
        let response = await axios.get(`/api/Eleve/?${filter}`)
        students.value = response.data
        students.value = students.value.map((item) => ({
          ...item,
          checked: false,
        }))
        filterdStudents.value = students.value
      } else {
        let response = await axios.get('/api/Eleve/')
        students.value = response.data
        filterdStudents.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getAbscences = async (id, student) => {
    try {
      if (student) {
        let response = await axios.get(`/api/Abs_Retard_Eleve/?eleve=${id}`)
        abscences.value = response.data
        filtredAbscences.value = response.data
      } else {
        let response = await axios.get(`/api/Abs_Retard_Prof/?prof=${id}`)
        abscences.value = response.data
        filtredAbscences.value = response.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    getParents,
    parents,
    students,
    getStudents,
    focusedStudent,
    focusedParent,
    filterdStudents,
    getAbscences,
    abscences,
    filtredAbscences,
    filterdParents,
    focusedSummon,
  }
})
