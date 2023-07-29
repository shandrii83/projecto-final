<template>
  <div class="col-md-10 mx-auto">
    <h1 class="text-center">Agrega una nueva tarea para organizar tu vida</h1>
    <h3></h3>

    <div v-if="showErrorMessage">
      <p class="text text-danger" :class="{ 'fade-in': showErrorMessage }">{{ errorMessage }}</p>
    </div>
    <div class="input-container">
      <div>
        <input class="input-field-new-task" type="text" placeholder="Agrega un título de tarea" v-model="name" />
      </div>
      <div>
        <textarea
          class="input-field-new-task" type="text" placeholder="Agrega una descripción de la tarea" v-model="description" style="height: 10rem;"
        ></textarea>
      </div>
      <button @click="addTask" class="button btn btn-outline-warning add-button">Agregar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useTaskStore } from "../stores/task";

const name = ref("");
const description = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");
const taskStore = useTaskStore();

const addTask = () => {
  const title = name.value.trim();
  const desc = description.value.trim();
  
  if (title === "" || desc === "") {
    showErrorMessage.value = true;
    errorMessage.value = "El título o la descripción de la tarea está vacío";
    setTimeout(() => {
      showErrorMessage.value = false;
    }, 5000);
  } else {
    taskStore.addTask(title, desc);
    name.value = "";
    description.value = "";
  }
};
</script>
