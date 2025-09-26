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

  const getStudents = async (id, classe) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Eleve/${id}/`)
        focusedStudent.value = response.data
      } else if (classe) {
        let response = await axios.post(`/api/eleve_par_Classe_sql/`, {
          class_id: classe,
        })
        students.value = response.data.Convocations
        filterdStudents.value = response.data.Convocations
        console.log(filterdStudents.value)
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
        let response = await axios.post('/api/Abs_Retard_par_Eleve_sql/', {
          eleve_id: id,
        })
        abscences.value = response.data.Abs_Retards
        filtredAbscences.value = response.data.Abs_Retards
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
