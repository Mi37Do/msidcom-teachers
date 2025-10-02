<template>
  <router-link :to="{ name: 'chat-view', params: { id: item.discussion_id } }" @click="async () => {

    let response = await axios.patch(`/api/discussions/${item.discussion_id}/`, {
      opened: true
    })

    await useMessages.getChats()

  }" class="w-full hover:bg-primary/10 flex p-2.5 gap-2.5 rounded-lg cursor-pointer">




    <div class="w-10 h-10 bg-[#6796a880] p-0.5 rounded-full overflow-hidden ">
      <div v-if="useWidget.authUser.userDetail.id === item.from_user_id"
        class="w-full h-full rounded-full overflow-hidden  flex items-center justify-center">
        <img v-if="item.to_user_image" class="object-cover w-full h-full" :src="item.to_user_image" alt="">
        <span v-else class="uppercase font-semibold">{{
          item.to_user_first_name[0] }}{{
            item.to_user_last_name[0] }}</span>
      </div>

      <div v-else class="w-full h-full rounded-full overflow-hidden  flex items-center justify-center">
        <img v-if="item.from_user_image" :src="item.from_user_image" class="object-cover w-full h-full" alt="">
        <span v-else class="uppercase font-semibold">{{
          item.from_user_first_name[0] }}{{
            item.from_user_last_name[0] }}</span>
      </div>



    </div>
    <div class="flex-1 flex flex-col gap-1 overflow-hidden">
      <div v-if="useWidget.authUser.userDetail.id === item.from_user_id"
        class="flex-1 flex flex-col justify-center gap-1 overflow-hidden">
        <span class="font-medium w-full flex truncate gap-1.5">
          <span>{{ item.to_user_first_name + ' ' +
            item.to_user_last_name }} </span>
        </span>
      </div>
      <div v-else class="flex-1 flex flex-col justify-center gap-1 overflow-hidden">
        <span class="font-medium w-full flex truncate gap-1.5">
          <span>{{ item.from_user_first_name + ' ' +
            item.from_user_last_name }} </span>
        </span>
      </div>
      <div class="flex gap-1.5 items-center">
        <span class="truncate text-[0.8rem] flex-1">{{ item.last_message }}</span>
        <div v-if="!item.opened && (item.last_message_from !== useWidget.authUser.userDetail.id)"
          class="w-1 h-1 bg-secondary-2 rounded-full"></div>
      </div>

    </div>
  </router-link>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages';
import { useWidgetStore } from '@/stores/widget';
import axios from 'axios';
import { useRoute } from 'vue-router';

const props = defineProps(['item'])
const route = useRoute()
const useMessages = useMessagesStore()
const useWidget = useWidgetStore()

</script>

<style lang="scss" scoped></style>
