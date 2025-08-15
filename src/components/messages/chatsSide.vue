<template>
  <div class="w-full h-full flex flex-col p-3 border-r border-border-color">
    <div class="w-full pb-4 border-b border-border-color  flex items-center justify-between mt-1 mb-3">
      <span class="pixa-title-3">Nouvelle Discussion</span>

      <button @click="useWidget.addChat = true" class="btn btn-sm btn-primary w-10 p-1">
        <plus class="fill-white w-5" />
      </button>
    </div>

    <commun-dropdown class="mb-1" :list="types" :selected="selectedType" @on-selected-item="(id) => {
      selectedType = id
      /***/
      if (id === 'Tout') {
        useMessages.filtredChats = useMessages.chats
      } else {
        useMessages.filtredChats = useMessages.chats.filter(i => i.users_details[0].to_user_details.type === id)
      }


    }" />
    <input type="text" v-model="query" @input="() => {
      useMessages.filtredChats = useMessages.chats.filter(i =>
        i.users_details[0].to_user_details.first_name.toLowerCase().includes(query.toLowerCase()) ||
        i.users_details[0].to_user_details.last_name.toLowerCase().includes(query.toLowerCase())
      )

      console.log(query)


    }" class="pixa-input px-3 placeholder:capitalize" />

    <div class="w-full flex-1 overflow-hidden">
      <div class="h-full overflow-auto hidden-scrollbar">
        <div class="h-fit flex flex-col py-3 gap-1">
          <ChatItem v-for="item in useMessages.filtredChats" :item="item" :key="item.id" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import plus from '@/assets/icons/plus.vue';
import communDropdown from '../commun/communDropdown.vue';
import { onMounted, ref } from 'vue';
import ChatItem from './chatItem.vue';
import { useWidgetStore } from '@/stores/widget';
import { useMessagesStore } from '@/stores/messages';

const props = defineProps(['list', 'usersTypes'])
const selectedType = ref('Tout')
const useWidget = useWidgetStore()
const useMessages = useMessagesStore()
const query = ref('')
const types = ref([

])


onMounted(() => {
  types.value = [...props.usersTypes]
  types.value.unshift({
    id: 'Tout',
    designation: 'Tout le monde'
  })
})
</script>

<style lang="scss" scoped></style>
