<template>
  <div v-if="useStudent.focusedStudent"
    class="w-full h-full bg-white py-3 px-6 flex flex-col gap-3 border-y border-border-color">


    <create-chat-modal />

    <div class="w-full pb-3 border-b border-border-color">
      <span class="text-xl font-medium text-secondary-2 truncate">
        {{ useStudent.focusedStudent.nom }}
        {{ useStudent.focusedStudent.prenom }}
      </span>
    </div>

    <Disclosure v-slot="{ open }">
      <DisclosureButton class="flex useStudent.focusedStudents-center gap-[5px]">
        <angle-icon :class="open ? 'rotate-180 transform' : ''" class="w-[35px] h-[35px] text-purple-500" />
        <span class="pixa-title-3">{{ t('translation.studentInfos') }}</span>
      </DisclosureButton>
      <DisclosurePanel class="grid grid-cols-2 gap-[10px]">
        <span class="pixa-title-4">
          {{ t(`translation.currentClasse`) }}</span>


        <span class="text-primary-3">
          {{ useStudent.focusedStudent.classe ?
            useStudent.focusedStudent.class_designations.class_designations_specialite +
            '-' + useStudent.focusedStudent.class_designations.class_designations_num : 'N/A' }}</span>
        <span class="pixa-title-4">
          {{ t(`translation.gender`) }}</span>


        <span class="text-primary-3">
          {{ useStudent.focusedStudent.sexe }}</span>


        <span class="pixa-title-4">
          {{ t(`translation.birthDay`) }}</span>


        <span class="font-semibold">
          {{ format(useStudent.focusedStudent.birthday, 'dd/MM/yyyy') }}</span>
      </DisclosurePanel>
    </Disclosure>


    <Disclosure v-slot="{ open }">
      <DisclosureButton class="flex useStudent.focusedStudents-center gap-[5px]">
        <angle-icon :class="open ? 'rotate-180 transform' : ''" class="w-[35px] h-[35px] text-purple-500" />
        <span class="pixa-title-3">{{ t('translation.legalParent') }}</span>
      </DisclosureButton>
      <DisclosurePanel class="grid grid-cols-2 gap-[10px]">

        <div v-if="useStudent.focusedStudent.parents" class="col-span-2">
          <div class="flex gap-3">
            <div class="w-[90px] h-[90px] rounded-[18px] p-1 bg-border-color">
              <div class="w-full h-full bg-primary-3 rounded-[15px] overflow-hidden flex items-center justify-center">
                <img v-if="useStudent.focusedStudent.photo" :src="useStudent.focusedStudent.photo"
                  class="object-cover w-full h-full" alt="">
                <div v-else class="flex uppercase font-semibold text-white text-xl">{{
                  useStudent.focusedStudent.prenom[0] }}{{
                    useStudent.focusedStudent.nom[0] }}</div>
              </div>
            </div>


            <div class="flex flex-col gap-1 justify-center h-[90px]">

              <span class="pixa-title-3 truncate">
                {{
                  useStudent.focusedStudent.parents_designations }}</span>
              <button @click="async () => {

                try {
                  let response = await axios.post(`/api/discussions_user_sql2/`, {
                    user2: useStudent.focusedStudent.parents
                  })
                  if (response.data.Discussions.length > 0) {
                    router.push({ name: 'chat-view', params: { id: response.data.Discussions[0].discussion_id } })
                  } else {
                    Object.assign(useWidget.addChatPassive, {
                      open: true,
                      to: useStudent.focusedStudent.parents,
                      designation: item.parents_designations
                    })
                  }
                } catch (error) {
                  console.error(error)
                }

              }"
                class="btn btn-sm pixa-btn border border-primary bg-transparent hover:bg-primary/10 w-fit text-primary hover:border-primary">
                <comment-primary class="w-4" />
                {{ t('translation.contact') }}
              </button>
            </div>

          </div>
        </div>

        <span class="pixa-title-3 col-span-2 mb-2 mt-2">informations tuteur</span>
        <span class="pixa-title-4">
          {{ t(`translation.phone`) }}</span>


        <span class="text-primary-3">
          {{ useStudent.focusedStudent.parents_tel || 'N/A' }}</span>


        <span class="pixa-title-4">
          {{ t(`translation.address`) }}</span>


        <span class="text-primary-3">
          {{ useStudent.focusedStudent.parents_address || 'N/A' }}</span>
      </DisclosurePanel>
    </Disclosure>
  </div>

  <div v-else class="w-full h-full flex items-center justify-center ">
    <span class="loading loading-spinner loading-sm"></span>
  </div>
</template>

<script setup>
import { useStudentStore } from '@/stores/students';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import arrowIcon from '@/assets/icons/arrowIcon.vue';
import angleIcon from '@/assets/icons/angleIcon.vue';
import noTimeWarning from '@/assets/icons/noTimeWarning.vue';
import commentPrimary from '@/assets/icons/commentPrimary.vue';
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { useWidgetStore } from '@/stores/widget';
import axios from 'axios';
import { useRouter } from 'vue-router';

import createChatModal from '@/components/commun/createChatModal.vue';

const { t } = useI18n()
const useWidget = useWidgetStore()
const router = useRouter()

const useStudent = useStudentStore()

console.log(useStudent.focusedStudent);

</script>

<style lang="scss" scoped></style>
