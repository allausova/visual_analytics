<script>
export default {
  name: 'Counter',
  props: {
    count: {
      type: Number,
      required: true
    }
  }
};
</script>

<template>
  <div class="p-2 bg-gray-100 rounded text-sm font-medium">
    Selected Records: {{ count }}
  </div>
</template>

<style scoped>
</style>
