import { ref, computed, reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { uuid } from 'vue-uuid'
import { useRoomStore } from './rooms'
import { useSubjectStore } from './subjects'
import { Preferences } from '@capacitor/preferences'

export const useWidgetStore = defineStore('widget', () => {
  const navBar = ref(false)
  const userLanguage = ref('fr')
  // const { locale } = useI18n()
  const router = useRouter()
  const useSubject = useSubjectStore()
  const useRooms = useRoomStore()
  const annee = ref([])
  const manager = ref(null)
  const authUser = reactive({
    isAuthenticated: false,
    userDetail: null,
  })

  const rawDays = [
    { id: 'Dimanche', fr: 'Dimanche', ar: 'الأحد' },
    { id: 'Lundi', fr: 'Lundi', ar: 'الإثنين' },
    { id: 'Mardi', fr: 'Mardi', ar: 'الثلاثاء' },
    { id: 'Mercredi', fr: 'Mercredi', ar: 'الأربعاء' },
    { id: 'Jeudi', fr: 'Jeudi', ar: 'الخميس' },
    { id: 'Vendredi', fr: 'Vendredi', ar: 'الجمعة' },
    { id: 'Samedi', fr: 'Samedi', ar: 'السبت' },
  ]

  const toasts = ref([])

  const classStatus = ref([
    {
      id: 'Active',
      designation: 'Active',
    },
    {
      id: 'Desactive',
      designation: 'Desactive',
    },
    {
      id: 'Draft',
      designation: 'Draft',
    },
  ])

  const addEditSpecialite = reactive({
    add: true,
    open: false,
  })

  const addEditStudent = reactive({
    add: true,
    open: false,
  })

  const addEditParent = reactive({
    add: true,
    open: false,
  })

  const addEditRoom = reactive({
    add: true,
    open: false,
  })

  const addEditClass = reactive({
    add: true,
    open: false,
  })

  const addEditRole = reactive({
    add: true,
    open: false,
  })

  const addEditSubject = reactive({
    add: true,
    open: false,
  })

  const addEditTeacher = reactive({
    add: true,
    open: false,
  })

  const addEditProgram = reactive({
    add: true,
    open: false,
  })

  const addEditChapters = reactive({
    add: true,
    open: false,
  })

  const addEditUser = reactive({
    add: true,
    open: false,
  })

  const addEditContent = reactive({
    add: true,
    open: false,
  })

  const addEditExam = reactive({
    add: true,
    open: false,
  })

  const signOutModal = ref(false)

  const transferStudents = reactive({
    transfer: true,
    open: false,
  })

  const addSummonModal = ref(false)

  const addResponsabilites = ref(false)

  const addStudentToClass = ref(false)

  const deleteChapter = ref(false)

  const editPassword = ref(false)
  const subscriptionModal = ref(false)

  const lateModal = ref(false)
  const addNote = reactive({
    add: true,
    open: false,
    type: '',
    note: {
      moyenne: null,
      assiduite: null,
      test_1: null,
      devoir_1: null,
      test_2: null,
      devoir_2: null,
      examens: null,
    },
    student: null,
  })

  const addEditEvent = reactive({
    add: true,
    open: false,
  })

  const addEditAnnoncement = reactive({
    add: true,
    open: false,
  })

  const addChatPassive = reactive({
    open: false,
    to: null,
    designation: '',
  })

  const importProgram = ref(false)

  const focusedAnne = ref(null)

  const uploadFile = ref(false)
  const addChat = ref(false)
  const addLateProf = ref(false)
  const communCaledarModal = ref(false)
  const addJustify = ref(false)
  const summonDetail = ref(false)
  const addImage = ref(false)

  const currentYear = ref(null)

  const toggleLanguage = () => {
    const activeLanguage = localStorage.getItem('user-language')
    if (activeLanguage === 'ar') setLanguage('ar')
    else if (activeLanguage === 'fr') setLanguage('fr')
    else setLanguage('fr')
  }

  const setLanguage = (language) => {
    localStorage.setItem('user-language', language)
    locale.value = language
    userLanguage.value = language
  }

  const getLanguage = () => {
    return localStorage.getItem('user-language')
  }

  const notifications = ref([])
  const getNotifications = async () => {
    try {
      let response = await axios.get('/api/Notifications_sql')
      console.log(response.data.Notifications)
      notifications.value = response.data.Notifications
    } catch (error) {}
  }

  const initData = async () => {
    // First, try to get token from Preferences (persistent storage)
    const { value } = await Preferences.get({ key: 'authToken-prof' })
    console.log('Token from Preferences:', value)

    if (value) {
      // Set the token in cookies and axios headers
      Cookies.set('token', value)
      axios.defaults.headers.common['Authorization'] = 'token ' + value
    }

    try {
      let response = await axios.get('/api/Userinfo_sql_Apps')
      authUser.isAuthenticated = true
      authUser.userDetail = response.data.User[0]

      currentYear.value = response.data.Annee[0]

      manager.value = response.data.type === 'ADMIN' ? response.data.id : response.data.manager_id

      //  await getNotifications()
    } catch (error) {
      authUser.isAuthenticated = false
      console.error(error)
      console.error(error)

      if (error.status !== 401) {
        addToast({
          msg: error.message,
          color: 'red',
        })
      }
    }
  }

  const addToast = (item) => {
    toasts.value.push({
      // id: uuid.v1(),
      color: item.color,
      msg: item.msg,
    })
  }

  const deleteModal = reactive({
    id: null,
    designation: null,
    open: false,
  })

  const secondDeleteModal = reactive({
    id: null,
    designation: null,
    open: false,
  })

  const resetTimeTable = ref(false)

  const configWeb = async () => {
    await useRooms.getClasses()
    await useRooms.getRooms()
    await useSubject.getSpecialites()
    await useSubject.getSubjects()
    await getAnnee()
  }

  const signOut = async () => {
    localStorage.removeItem('subjects')
    localStorage.removeItem('rooms')
    localStorage.removeItem('specialites')
    localStorage.removeItem('classes')
    localStorage.removeItem('annee')
  }

  // Reactive list used in UI
  const daysOfWeek = ref([])

  // Watch for changes
  watch(
    userLanguage,
    (newLang) => {
      if (newLang === 'ar') {
        daysOfWeek.value = rawDays.map((day) => ({
          id: day.id,
          designation: day.ar,
        }))
      } else {
        daysOfWeek.value = rawDays.map((day) => ({
          id: day.id,
          designation: day.fr,
        }))
      }
    },
    { immediate: true },
  )

  const getAnnee = async (id) => {
    try {
      if (id) {
        let response = await axios.get(`/api/Anne/${id}/`)
        focusedAnne.value = response.data
      } else {
        let response = await axios.get(`/api/Anne/`)
        annee.value = response.data
      }
    } catch (error) {
      console.error(error)

      addToast({
        msg: error.message,
        color: 'red',
      })
    }
  }

  function generateArrayFromRange(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
      console.error(
        'Invalid input: min should be less than or equal to max and both should be numbers.',
      )
      return []
    }

    return Array.from({ length: max - min + 1 }, (_, i) => {
      const value = (min + i).toString().padStart(2, '0')
      return {
        id: value,
        designation: value,
      }
    })
  }

  return {
    navBar,
    userLanguage,
    toggleLanguage,
    getLanguage,
    setLanguage,
    initData,
    authUser,
    addEditSpecialite,
    addEditRoom,
    toasts,
    addToast,
    addEditClass,
    classStatus,
    configWeb,
    signOut,
    addEditStudent,
    deleteModal,
    addEditParent,
    addEditRole,
    addEditSubject,
    secondDeleteModal,
    addEditTeacher,
    daysOfWeek,
    manager,
    getAnnee,
    annee,
    addEditProgram,
    addEditChapters,
    generateArrayFromRange,
    addEditUser,
    editPassword,
    deleteChapter,
    transferStudents,
    signOutModal,
    addEditExam,
    lateModal,
    addStudentToClass,
    addResponsabilites,
    addJustify,
    addNote,
    focusedAnne,
    addEditContent,
    resetTimeTable,
    addEditEvent,
    addEditAnnoncement,
    uploadFile,
    importProgram,
    addChat,
    addChatPassive,
    addSummonModal,
    addLateProf,
    communCaledarModal,
    summonDetail,
    addImage,
    subscriptionModal,
    notifications,
    getNotifications,
    currentYear,
  }
})
