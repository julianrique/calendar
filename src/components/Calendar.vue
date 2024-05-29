<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevMonth">&lt;</button>
      <span class="month">{{ monthYear }}</span>
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
          @click="selectDay(day.date)"
      >
        {{ day.date.getDate() }}
        <img :src="`https://openweathermap.org/img/wn/${getIcon(day)}@2x.png`" onerror="this.style.display='none'" width="30%">
        <div class="reminders" v-if="reminders[day.date.toDateString()]">
          <div v-for="reminder in reminders[day.date.toDateString()]" @click="onReminderPress(reminder, day.date)" :key="reminder" :style="{background: reminder.colorReminder}">
            {{ reminder.startTime }} - {{ reminder.endTime }}
            {{ reminder.title }}
          </div>
        </div>
        <div class="weather" v-if="weatherByDate[day.date.toDateString()]">
          <div v-for="weather in weatherByDate[day.date.toDateString()]" :key="weather.id">
            {{ weather[0].description }}
          </div>
        </div>
      </div>
    </div>
    <ReminderForm v-if="selectedDay" @add-reminder="addReminder" :selectedData="selectData" @delete-Reminder="deleteReminder"/>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format } from 'date-fns';
import ReminderForm from './ReminderForm.vue';
import axios from 'axios';

const today = new Date();
const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const selectedDay = ref(null);
const reminders = ref({});
const weatherByDate = ref({});
const selectData = ref({});
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
const selectDay = (date) => {
  selectedDay.value = date;
};

const onReminderPress = (data, date) => {
  selectData.value = data;
  selectedDay.value = date;
};

const deleteReminder = (title) => {
  console.log("AQUIIII")
  const dateKey = selectedDay.value.toDateString();
  reminders.value[dateKey] = reminders.value[dateKey].filter(pDate => pDate.title !== title);
  selectData.value = null;
  selectedDay.value = null;
};
const addReminder = (title, startTime, endTime, colorReminder, isEditable) => {
  const dateKey = selectedDay.value.toDateString();
  console.log(isEditable)
  if (!!isEditable) {
    reminders.value[dateKey] = reminders.value[dateKey].filter(pDate => pDate.title !== isEditable);
  }
  if (!reminders.value[dateKey]) {
    reminders.value[dateKey] = [];
  }
  reminders.value[dateKey].push({title, startTime, endTime, colorReminder});
  reminders.value[dateKey] = [...reminders.value[dateKey]].sort((aDate,bDate) => aDate.startTime > bDate.startTime ? 1:-1);
  selectedDay.value = null; // Clear selected day after adding reminder
};
const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  selectedDay.value = null; // Clear selected day when changing month
};
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  selectedDay.value = null; // Clear selected day when changing month
};

const getDataWeather = async () => {
  await axios.get(
      "http://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat: 40.8762106,
          lon: -74.0298621,
          appid: '4aa474e368a4b330d21f72c4b5305231',
        }
      }
  ).then(value => {
    weatherByDate.value = transformWeatherData(value.data);
    console.log(weatherByDate)
  }).catch(reason => {
    console.log(reason)
  });
}
function transformWeatherData(jsonData) {
  return jsonData.list.reduce((acc, current) => {
    const [date, time] = current.dt_txt.split(' ');
    if (time === "12:00:00") { // Solo incluir datos de las 12 del día
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(current.weather);
    }
    return acc;
  }, {});
};

function getIcon(dayDate) {
  const dayNumber = dayDate.date.toLocaleDateString("sv-SE")
  const weatherDayKey = Object.keys(weatherByDate.value).find(key => key.includes(dayNumber));
  const weatherDay = weatherByDate.value[weatherDayKey];
  if (weatherDay)
    return weatherDay[0][0].icon
  return ""
}

onMounted(() => {
  getDataWeather();


});

</script>

<style scoped>
.calendar {
  width: 100%;
}
.header {
  padding: 56px;
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
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.days div:hover {
  background-color: #e0e0e0;
}
.today {
  background-color: #f0f0f0;
}
.otherMonth {
  color: #ccc;
}
.month{
  font-size: 70px;
}
.reminders {
  margin-top: 5px;
  width: 100% !important;
}
.reminders div{
  width: 100% !important;
}
</style>