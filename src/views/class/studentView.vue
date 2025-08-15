<template>
  <div class="w-full h-full overflow-hidden pb-3">

    <div class="w-full h-full overflow-hidden">
      <div class="w-full h-full flex flex-col gap-3">

        <div v-if="loading" class="w-full h-full flex items-center justify-center">
          <span class="loading loading-spinner loading-sm"></span>
        </div>

        <div v-else class="w-full h-full flex flex-col gap-3">

          <div class="w-full flex-1 flex flex-col gap-3 overflow-hidden">

            <div class="w-full h-full flex flex-col gap-3">
              <div v-if="loadingData" class="w-full flex-1 flex items-center justify-center">
                <span class="loading loading-spinner loading-sm"></span>
              </div>
              <div v-else class="w-full flex-1 overflow-hidden flex flex-col gap-3">

                <div class="w-full flex items-center justify-between overflow-x-auto hidden-scrollbar  px-6">
                  <div class="w-fit rounded-[16px] flex gap-1 p-1 pixa-border">
                    <router-link :to="{ name: 'main-student-view' }"
                      :class="route.name === 'main-student-view' ? ' btn-primary' : 'btn-ghost'"
                      class="btn btn-sm pixa-btn-navigation ">information générale</router-link>
                    <router-link :to="{ name: 'notes-student-view' }"
                      :class="route.name === 'notes-student-view' ? ' btn-primary' : 'btn-ghost'"
                      class="btn btn-sm pixa-btn-navigation ">{{
                        t('translation.notes')
                      }}</router-link>
                    <router-link :to="{ name: 'abscences-student-view' }"
                      :class="route.name === 'abscences-student-view' ? 'btn-primary' : 'btn-ghost'"
                      class="btn btn-sm pixa-btn-navigation ">{{
                        t('translation.abscences')
                      }}</router-link>
                  </div>
                </div>
                <div class="flex-1 overflow-hidden">
                  <router-view></router-view>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

</template>

<script setup>
import { onMounted, ref, } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { useStudentStore } from "@/stores/students"

const { t } = useI18n()
const route = useRoute()
const loading = ref(true)
const loadingData = ref(false)
const useStudent = useStudentStore()

onMounted(async () => {

  try {
    useStudent.getStudents(route.params.studentId)
    loading.value = false
  } catch (error) {
    console.error(error)
  }
})


</script>


<style lang="scss" scoped></style>
