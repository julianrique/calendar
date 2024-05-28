<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevMonth">&lt;</button>
      <span>{{ monthYear }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="weekdays">
      <div v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>
    <div class="days">
      <div
          v-for="day in days"
          :key="day.date"
          :class="{ today: isToday(day.date), otherMonth: !day.currentMonth }"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format } from 'date-fns';

export default {
  name: 'Calendar',
  setup() {
    const today = new Date();
    const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthYear = computed(() => format(currentDate.value, 'MMMM yyyy'));

    const days = computed(() => {
      const start = startOfWeek(startOfMonth(currentDate.value));
      const end = endOfWeek(endOfMonth(currentDate.value));

      const daysArray = [];
      let day = start;

      while (day <= end) {
        daysArray.push({
          date: new Date(day),
          currentMonth: day.getMonth() === currentDate.value.getMonth(),
        });
        day = addDays(day, 1);
      }

      return daysArray;
    });

    const isToday = (date) => {
      const today = new Date();
      return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      );
    };

    const prevMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
    };

    const nextMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
    };

    return {
      weekdays,
      monthYear,
      days,
      isToday,
      prevMonth,
      nextMonth,
    };
  },
};
</script>

<style scoped>
.calendar {
  width: 300px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.weekdays, .days {
  display: flex;
  flex-wrap: wrap;
}
.weekdays div, .days div {
  width: calc(100% / 7);
  text-align: center;
  padding: 10px 0;
}
.today {
  background-color: #f0f0f0;
}
.otherMonth {
  color: #ccc;
}
</style>

