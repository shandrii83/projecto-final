<template >
    <div class="col-md-10 mx-auto">
    <h1 class="text-center">Agrega una nueva tarea para organizar tu vida</h1>
    <h3 ></h3>

    <div v-if="showErrorMessage">
        <p class=" text text-danger" :class="{ 'fade-in': showErrorMessage }">{{ errorMessage }}</p>
    </div>
    <div class="input-container">
        <div>
            <input class="input-field-new-task" type="text" placeholder="Agrega un título de tarea" v-model="name">
        </div>
        <div>
            <textarea
            class="input-field-new-task" type="text" placeholder="Agrega una descripción de la tarea" v-model="description" style="height: 10rem;">

            </textarea>
        </div>
        <button @click="addTask" class="button btn btn-outline-warning add-button ">Agregar</button>
    </div>
</div>
</template>

<script setup>
import { ref} from "vue";
import { useTaskStore } from "../stores/task";

const taskStore = useTaskStore();
/* const emit = defineEmits(
  ["task-created"]
); */

const name = ref("");
const description = ref("");
const showErrorMessage = ref(false);
const errorMessage = ref("");

const addTask = () => {
  if (name.value.length === 0 || description.value.length === 0) {
    showErrorMessage.value = true;
    errorMessage.value = "El título o la descripción de la tarea está vacío";
    setTimeout(() => {
      showErrorMessage.value = false;
    }, 5000);
  } else {
    // Используем emit для отправки данных в Home.vue

    console.log("andrii");
    taskStore.addTask(name.value, description.value);
    /* emit("task-created", { name: name.value, description: description.value }); */
    name.value = "";
    description.value = "";
  }
};
</script>
  