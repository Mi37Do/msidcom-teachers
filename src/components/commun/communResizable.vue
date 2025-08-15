<template>
  <div ref="leftDiv" class=" w-full h-full bg-red-400 resize-x flex justify-between">
    <span class="flex-1"></span>
    <div class="w-1 h-full bg-red-600" @mousedown="startResize('left')"> </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const leftDiv = ref(null);
const rightDiv = ref(null);
let isResizing = false;
let resizeDirection = null;

const startResize = (direction) => {
  isResizing = true;
  resizeDirection = direction;
  window.addEventListener('mousemove', handleResize);
  window.addEventListener('mouseup', stopResize);
};

const handleResize = (e) => {
  if (!isResizing) return;
  if (resizeDirection === 'left') {
    const newWidth = e.clientX - leftDiv.value.getBoundingClientRect().left;
    leftDiv.value.style.width = `${newWidth}px`;
  } else if (resizeDirection === 'right') {
    const newWidth = e.clientX - rightDiv.value.getBoundingClientRect().left;
    rightDiv.value.style.width = `${newWidth}px`;
  }
};

const stopResize = () => {
  isResizing = false;
  resizeDirection = null;
  window.removeEventListener('mousemove', handleResize);
  window.removeEventListener('mouseup', stopResize);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', handleResize);
  window.removeEventListener('mouseup', stopResize);
});
</script>

<style lang="scss" scoped>
.resize-x {
  resize: horizontal;
}
</style>
