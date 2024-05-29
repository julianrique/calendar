<template>
  <div class="reminder-form">
    <h3>Add Reminder</h3>
    <form @submit.prevent="submitReminder">
      <input v-model="startTime" type="time" />
      <input v-model="endTime" type="time" />
      <input v-model="colorReminder" type="color" />
      <input v-model="title" type="text" placeholder="Reminder name" required />
      <button type="submit" :disabled="title?.length > 30">Add</button>
      <button v-if="props.selectedData?.title" @click="emit('delete-Reminder', props.selectedData?.title)">DELETE</button>
      <p v-if="title?.length > 30" class="error">The reminder cannot exceed 30 characters</p>
    </form>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';

const title = ref('');
const startTime = ref('');
const endTime = ref('');
const colorReminder = ref('');
const props = defineProps(
    ['selectedData']
)
const emit = defineEmits(['add-reminder', 'delete-Reminder'])
const submitReminder = () => {
  if (title.value.trim() !== '') {
    emit('add-reminder', title.value, startTime.value, endTime.value, colorReminder.value, props.selectedData?.title);
    title.value = '';
    startTime.value = '';
    endTime.value = '';
    colorReminder.value = '';
  }
};
onMounted(() => {
  if (props.selectedData?.title) {
    title.value = props.selectedData.title;
    startTime.value = props.selectedData.startTime;
    endTime.value = props.selectedData.endTime;
    colorReminder.value = props.selectedData.colorReminder;
  }
});
</script>

<style scoped>
.reminder-form {
  margin-top: 20px;
}
.reminder-form input {
  margin-right: 10px;
}
</style>