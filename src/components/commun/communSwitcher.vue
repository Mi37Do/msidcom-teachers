<template>
  <SwitchGroup as="div" class="flex gap-x-4 ">
    <div class="flex h-6 items-center">
      <Switch v-model="agreed"
        :class="[agreed ? 'bg-primary' : 'bg-gray-200', 'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary']">

        <span aria-hidden="true"
          :class="[agreed ? 'translate-x-3.5' : 'translate-x-0', 'size-4 transform rounded-full bg-white ring-1 shadow-xs ring-gray-900/5 transition duration-200 ease-in-out']" />
      </Switch>
    </div>
  </SwitchGroup>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

const props = defineProps(['enabled'])
const emits = defineEmits(['updateEnabled'])
const agreed = ref(false)

onMounted(() => {
  if (props.enabled) {
    agreed.value = props.enabled
  }
})

watch(() => agreed.value, () => {
  emits('updateEnabled', agreed.value)
})
</script>

<style lang="scss" scoped></style>
