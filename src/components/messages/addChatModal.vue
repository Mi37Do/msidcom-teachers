<template>
  <TransitionRoot appear :show="useWidget.addChat" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 ">
        <form @submit.prevent="addItem" class="flex h-full items-center justify-center p-4 text-center overflow-hidden">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md h-[600px] overflow-hidden transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-3">
              <DialogTitle as="h3" class="flex items-center pixa-title-2">
                Nouvelle Discussion
              </DialogTitle>

              <div class="w-full h-px bg-primary mt-3"></div>

              <div class="w-full flex-1 flex flex-col overflow-hidden">

                <div class="relative w-full flex items-center mt-3">
                  <search class="w-5 absolute left-2.5" />
                  <input :placeholder="t('translation.search') + ' ....'"
                    class=" pixa-input-icon px-3 placeholder:capitalize  w-full" />
                </div>

                <span class="label-text capitalize mt-3">résultats <span class="text-red-500">*</span></span>

                <div class="flex-1 overflow-hidden">
                  <div class="w-full h-full overflow-auto">


                    <RadioGroup v-model="selected" class="mt-3 px-1">
                      <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
                      <div class="space-y-2">
                        <RadioGroupOption as="template" v-for="user in users" :key="user" :value="user.id"
                          v-slot="{ active, checked }">
                          <div :class="[
                            active
                              ? 'ring-0 ring-white/60 ring-offset-2 '
                              : '',
                            checked ? 'bg-warning/40 border-warning ' : 'bg-white border-border-color',
                          ]"
                            class="relative flex cursor-pointer rounded-lg px-5 py-4 border focus:ring-0 focus:outline-none">
                            <div class="flex gap-4 w-full items-center justify-between">

                              <input type="radio" required :checked="checked" class="radio radio-xs  radio-warning">

                              <div
                                class="w-[40px] h-[40px] bg-primary-3 rounded-full text-white flex items-center justify-center overflow-hidden">
                                <img v-if="user.image" :src="user.image" class="object-cover w-full h-full" alt="">
                                <span v-else class="uppercase  mt-1">{{ user.first_name[0] }}{{ user.last_name[0]
                                }}</span>
                              </div>

                              <div class="flex items-center flex-1 overflow-hidden">
                                <div class="text-sm">
                                  <RadioGroupLabel as="p" :class="checked ? '' : 'text-gray-900'" class="font-medium">
                                    {{ user.first_name }} {{ user.last_name }}
                                  </RadioGroupLabel>
                                  <RadioGroupDescription as="span" :class="checked ? '' : 'text-gray-600'"
                                    class="inline">
                                    <span v-if="user.fils.length > 0"
                                      class="overflow-hidden w-full flex gap-1 truncate">
                                      <span>parent de :</span>
                                      <span v-for="item in user.fils" :key="item"
                                        class=" truncate flex-1 overflow-hidden">{{ item.nom
                                        }} {{
                                          item.prenom }},
                                      </span>
                                    </span>
                                    <span v-else>N/A</span>
                                  </RadioGroupDescription>
                                </div>
                              </div>
                            </div>
                          </div>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

              </div>



              <div class="flex gap-3 justify-end">
                <button type="reset" class="btn btn-sm pixa-btn-form btn-ghost w-32" @click="closeModal">
                  {{ t('translation.cancel') }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-sm pixa-btn-form btn-primary w-44">

                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  <span v-else>
                    lancer discussion</span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </form>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { useWidgetStore } from '@/stores/widget';
import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupDescription,
  RadioGroupOption,
} from '@headlessui/vue'
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n';
import communDropdown from '../commun/communDropdown.vue';
import search from '@/assets/icons/search.vue';
import axios from 'axios';
import { useMessagesStore } from '@/stores/messages';
import { useRouter } from 'vue-router';

const useWidget = useWidgetStore()
const useMessages = useMessagesStore()
const props = defineProps(['users', 'usersTypes'])
const { t } = useI18n()
const loading = ref(false)
const selectedType = ref('PARENT')
const router = useRouter()

const selected = ref(props.users[0].id)

function closeModal() {
  useWidget.addChat = false

  loading.value = false
}

let response = null
const addItem = async () => {
  loading.value = true
  try {
    let response = await axios.post(`/api/discussions_user_sql2/`, {
      user2: selected.value
    })
    if (response.data.Discussions.length > 0) {
      router.push({ name: 'chat-view', params: { id: response.data.Discussions[0].discussion_id } })
    } else {
      let response2 = await axios.post(`/api/discussions/`, {
        from_user: useWidget.authUser.userDetail.id,
        to_user: selected.value
      })
    }
    await useMessages.getChats()
    closeModal()

  } catch (error) {
    console.error(error)

    useWidget.addToast({
      msg: error.message,
      color: 'red'
    })

  }
  loading.value = false
}

</script>

<style lang="scss" scoped></style>
