<template>
  <div ref="more">
    <Menu as="div" class="relative inline-block text-left">
      <div class="z-0">
        <MenuButton @click="toggleDropdown" class="btn btn-sm btn-square btn-ghost z-0">
          <elipsis-h class="w-5 h-5" />
        </MenuButton>
      </div>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <MenuItems :class="[
          'absolute right-10 w-52 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl shadow-primary/10 ring-1 ring-black/5 focus:outline-none z-50',
          dropdownPosition === 'up' ? 'bottom-0' : 'top-0'
        ]">
          <div class="px-1 py-1">

            <MenuItem>
            <button @click="() => {
              emits('startEditing', !editing)
            }"
              :class="['btn btn-sm h-[30px] btn-ghost flex justify-start gap-2 w-full items-center capitalize pixa-menu-btn']">
              <edit class="w-5 h-5" />
              {{ $t('translation.edit') }}
            </button>
            </MenuItem>
            <MenuItem>
            <button @click="() => {
              useSubject.focusedBulletin = bulletin ? { type: 'bulletin', data: bulletin } : { type: 'student', data: student }
              useWidget.uploadFile = true
            }"
              :class="['btn btn-sm h-[30px] btn-ghost flex justify-start gap-2 w-full items-center capitalize pixa-menu-btn']">
              <upload-file class="w-5 h-5" />
              {{ $t('translation.upload') }} {{ $t('translation.file') }}
            </button>
            </MenuItem>
            <MenuItem v-if="file">
            <button @click="downloadPdf(file)
              "
              :class="['btn btn-sm h-[30px] btn-ghost flex justify-start gap-2 w-full items-center capitalize pixa-menu-btn']">
              <download-file class="w-5 h-5" />
              {{ $t('translation.download') }} {{ $t('translation.file') }}
            </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ref } from 'vue';
import elipsisH from '@/assets/icons/elipsisH.vue';
import { useI18n } from 'vue-i18n';
import edit from '@/assets/icons/edit.vue';
import uploadFile from '@/assets/icons/uploadFile.vue';
import { useUserStore } from '@/stores/users';
import { useWidgetStore } from '@/stores/widget';
import axios from 'axios';
import downloadFile from '@/assets/icons/downloadFile.vue';
import { useSubjectStore } from '@/stores/subjects';

const props = defineProps(['item', 'rootElement', 'editing', 'file', 'bulletin']);
const emits = defineEmits(['startEditing'])
const dropdownPosition = ref('down');
const { t } = useI18n()
const useUser = useUserStore()
const useWidget = useWidgetStore()
const useSubject = useSubjectStore()

const toggleDropdown = () => {
  if (props.rootElement) {
    const rect = props.rootElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 160; // Approximate height of the dropdown menu

    if (spaceBelow < dropdownHeight) {
      dropdownPosition.value = 'up';
    } else {
      dropdownPosition.value = 'down';
    }
  }
};

const downloadPdf = (file) => {
  const link = document.createElement('a')
  link.href = file
  link.download = 'file.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style lang="scss" scoped></style>
