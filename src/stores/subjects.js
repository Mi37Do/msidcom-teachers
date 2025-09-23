import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useWidgetStore } from './widget'

export const useSubjectStore = defineStore('subject', () => {
  const specialites = ref([])
  const filtredSpecialites = ref([])
  const focusedSpecialite = ref(null)
  const subjects = ref([])
  const filtredSubjects = ref([])
  const coefs = ref([])
  const focusedCoefs = ref([])
  const focusedSubject = ref(null)
  const focusedProgram = ref(null)
  const focusedProgramChapter = ref(null)
  const matiereSpecialite = ref([])
  const chapters = ref([])
  const focusedChapter = ref(null)
  const filtredPrograms = ref([])
  const filtredChapters = ref([])
  const focusedAbscence = ref(null)
  const FiltredMatiereSpecialite = ref([])
  const useWidget = useWidgetStore()
  const filtredNotes = ref([])
  const filtredBulletins = ref([])
  const bulletins = ref([])

  const programs = ref([])

  const getSpecialites = async (id, filter) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Specialite/${id}/`)
        focusedSpecialite.value = response.data
      } else if (filter) {
        let response = await axios.get(`/api/Specialite/?${filter}`)
        filtredSpecialites.value = response.data
      } else {
        let response = await axios.get('/api/Specialite/')
        specialites.value = response.data
        localStorage.setItem('specialites', JSON.stringify(specialites.value))
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getSubjects = async (id) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Matiere/${id}/`)
        focusedSubject.value = response.data
      } else {
        let response = await axios.get('/api/Matiere/')
        subjects.value = response.data
        filtredSubjects.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getCoefs = async () => {
    try {
      let response = await axios.get('/api/Matiere_spec/')
      coefs.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getPrograms = async (id) => {
    try {
      let response = await axios.get(`/api/Programe/?matiere_specialite__matiere=${id}`)
      programs.value = response.data
      filtredPrograms.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getMatiereSpecialite = async (id, filter) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Matiere_spec/?matiere=${id}`)
        matiereSpecialite.value = response.data
      } else {
        let response = await axios.get(`/api/Matiere_spec/?${filter}`)
        FiltredMatiereSpecialite.value = response.data
        matiereSpecialite.value = response.data
      }
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const getNotes = async (id) => {
    try {
      let response = await axios.get(`/api/Notes/?matiere_spec=${id}`)
      filtredNotes.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  const focusedBulletin = ref(null)

  const getBulletin = async (id) => {
    try {
      let response = await axios.get(`/api/Buletins_eleve/?eleve__classe=${id}`)
      filtredBulletins.value = response.data
      bulletins.value = response.data
    } catch (error) {
      console.error(error)

      useWidget.addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  return {
    getMatiereSpecialite,
    matiereSpecialite,
    getSpecialites,
    specialites,
    subjects,
    getSubjects,
    focusedSubject,
    getCoefs,
    coefs,
    focusedCoefs,
    getPrograms,
    programs,
    focusedProgram,
    chapters,
    focusedChapter,
    filtredSubjects,
    filtredPrograms,
    filtredChapters,
    focusedProgramChapter,
    focusedAbscence,
    focusedSpecialite,
    filtredSpecialites,
    FiltredMatiereSpecialite,
    getNotes,
    filtredNotes,
    getBulletin,
    filtredBulletins,
    focusedBulletin,
    bulletins,
  }
})
