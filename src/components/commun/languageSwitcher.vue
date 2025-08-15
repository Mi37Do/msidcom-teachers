<template>
  <div class="w-fit text-right ">
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton class="btn btn-sm pixa-btn btn-ghost w-20 flex justify-between">
          <languageIcon class="w-5 h-5" />
          {{ useWidget.userLanguage }}
        </MenuButton>
      </div>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <MenuItems
          class="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">

          <div class="px-1 py-1">
            <MenuItem @click="useWidget.setLanguage(language)" v-for="language in languages" :key="language">
            <button :class="[
              'btn btn-sm pixa-btn flex justify-between btn-ghost w-full font-light capitalize'
            ]">
              <span class="uppercase">{{ language }}</span>
              <span> {{ language === 'en' ? 'english' : language === 'fr' ? 'français' : 'العربية'
                }}</span>

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
import { ref, onBeforeMount, watch } from 'vue'
import languageIcon from '@/assets/icons/languageIcon.vue'
import { useWidgetStore } from '@/stores/widget'

const enabled = ref(false)
const useWidget = useWidgetStore()
const languages = ref(['fr', 'ar'])

onBeforeMount(() => {
  const initLanguage = useWidget.getLanguage()
  useWidget.setLanguage(initLanguage)
})


</script>
