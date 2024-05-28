<template>
  <div>
    <div v-for="event in events" :key="event.id">
      {{ event.title }} - {{ event.start }}
      <button @click="editEvent(event)">Editar</button>
      <button @click="deleteEvent(event.id)">Eliminar</button>
    </div>
    <div class="event-form">
      <input v-model="newEvent.title" placeholder="Título del evento" />
      <input v-model="newEvent.start" type="time" />
      <button @click="addEvent">Agregar evento</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const events = ref([
  { id: 1, title: 'Reunión importante', start: '2024-05-28T10:00:00', end: '2024-05-28T11:00:00' },
  // ... otros eventos
]);

const newEvent = ref({
  title: '',
  start: '',
});

function editEvent(event) {
  // Lógica para editar el evento
  // Puedes abrir un modal con los detalles del evento y permitir al usuario modificarlos
}

function deleteEvent(eventId) {
  // Lógica para eliminar el evento
  events.value = events.value.filter(event => event.id !== eventId);
}

function addEvent() {
  // Lógica para agregar un nuevo evento
  if (newEvent.value.title && newEvent.value.start) {
    const id = events.value.length + 1;
    events.value.push({ ...newEvent.value, id });
    newEvent.value = { title: '', start: '' };
  }
}
</script>