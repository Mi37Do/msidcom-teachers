<template>
  <div class="w-full h-full overflow-hidden">
    <div class="w-full h-full px-6 overflow-auto">
      <div class="h-fit py-6 flex flex-col gap-6">

        <SignOutModal :token="fcmToken" />
        <edit-password />
        <add-image />

        <span class="pixa-title-2">{{ t('translation.settings') }}</span>

        <div class="w-full flex gap-3 items-center">
          <div
            class="w-[70px] h-[70px] bg-primary-3 rounded-lg flex items-center justify-center relative p-0.5 overflow-hidden">
            <div class="w-full h-full">
              <img v-if="useWidget.authUser.userDetail.image" :src="useWidget.authUser.userDetail.image"
                class="w-full h-full object-cover rounded-md" alt="">
            </div>
            <div @click="useWidget.addImage = true" class="w-full h-full flex items-center justify-center absolute">
              <plus class="w-5 fill-white" />
            </div>
          </div>

          <div class="flex-1 flex flex-col">
            <span class="pixa-title-2 mt-2 truncate">{{ useWidget.authUser.userDetail.first_name }} {{
              useWidget.authUser.userDetail.last_name }}</span>
            <span> Professeur en: <span v-for="(item, index) in useWidget.authUser.userDetail.matieres
              .matiere" :key="item" class="text-primary-3 capitalize font-medium">{{ item.designation
              }} ,</span></span>
          </div>

        </div>


        <div class="w-full flex flex-col gap-3">

          <span class="w-full h-px bg-border-color"></span>

          <span class="text-[18px] capitalize font-[500]">{{ t('translation.responsabilites') }} :</span>
          <div
            class="h-fit rounded-[15px] px-3 py-6 flex flex-col justify-center gap-1.5 bg-[#F9F9F9] border border-border-color">
            <span v-for="item in useWidget.authUser.userDetail.
              responsabilite?.responsabilite" :key="item">- {{ item.description }}</span>
          </div>

          <span class="w-full h-px bg-border-color"></span>

          <span class="text-[18px] capitalize font-[500]">{{ t('translation.personalInformations') }} :</span>
          <div
            class="h-[84px] rounded-[15px] p-3 flex flex-col justify-center gap-1.5 bg-[#F9F9F9] border border-border-color">
            <span class="text-[18px] capitalize font-[500]">{{ t('translation.fullName') }}</span>
            <span>{{ useWidget.authUser.userDetail.first_name }} {{
              useWidget.authUser.userDetail.last_name }}</span>
          </div>
          <div
            class="h-[84px] rounded-[15px] p-3 flex flex-col justify-center gap-1.5 bg-[#F9F9F9] border border-border-color">
            <span class="text-[18px]  capitalize font-[500]">{{ t('translation.email') }}</span>
            <span>{{ useWidget.authUser.userDetail.email }}</span>
          </div>
          <div
            class="h-[84px] rounded-[15px] p-3 flex flex-col justify-center gap-1.5 bg-[#F9F9F9] border border-border-color">
            <span class="text-[18px]  capitalize font-[500]">{{ t('translation.phone') }}</span>
            <span>{{ useWidget.authUser.userDetail.phone || 'N/A' }}</span>
          </div>

          <span class="h-[0.5px] border border-border-color col-span-2"></span>


          <div
            class="h-[84px] rounded-[15px] p-3 flex flex-col justify-center gap-1.5 bg-[#F9F9F9] border border-border-color relative">
            <span class="text-[18px]  capitalize font-[500]">{{ t('translation.password') }}</span>
            <span>*******************</span>

            <button @click="useWidget.editPassword = true"
              :class="useWidget.userLanguage === 'ar' ? 'left-0' : ' right-0'" class="btn btn-sm absolute btn-ghost  ">
              <edit class="w-5 fill-warning" />
            </button>
          </div>

          <div @click="useWidget.changeLanguage = true"
            class="h-[84px] rounded-[15px] p-3 flex flex-col justify-center gap-1.5 bg-[#F9F9F9] border border-border-color relative">
            <span class="text-[18px]  capitalize font-[500]">{{ $t('translation.selectedLanguage') }}</span>
            <span>{{useWidget.languages.find(i => i.id === useWidget.userLanguage)?.desingation}}</span>

            <div v-html="useWidget.languages.find(i => i.id === useWidget.userLanguage)?.icon"
              :class="useWidget.userLanguage === 'ar' ? 'left-0' : ' right-0'" class="w-8  absolute">
            </div>
          </div>

        </div>

        <button @click="useWidget.signOutModal = true"
          class="btn pixa-btn-navigation-side bg-error/10 hover:bg-error/20 border-0  flex  gap-2 w-full text-error fill-error">
          <sign-out class="w-5" />
          {{
            t('translation.signOut') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import edit from '@/assets/icons/edit.vue';
import plus from '@/assets/icons/plus.vue';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useSubjectStore } from '@/stores/subjects';
import addImage from "@/components/profile/addImage.vue";
import signOut from '@/assets/icons/signOut.vue';
import editPassword from '@/components/profile/editPassword.vue'
import SignOutModal from '@/components/commun/signOutModal.vue';
import { useFirebaseMessaging } from '@/composables/useFirebaseMessaging';

const useWidget = useWidgetStore()
const useSubject = useSubjectStore()
const { fcmToken, initializeFCM } = useFirebaseMessaging();
const { t } = useI18n()
const loading = ref(true)

onMounted(async () => {
  await initializeFCM()
  loading.value = false
})

</script>

<style lang="scss" scoped></style>
