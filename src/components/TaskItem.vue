<template>
   <div class="task-item">
    <h3>{{ task.title }}</h3>
    <p>{{ task.description }}</p>
    <p>Fecha de creación: {{ formatDate(task.timestamp) }}</p>
  <div class="card">
    <div class="card-body">
      <h3 :class="{ taskComplete: task.is_complete }">{{ title }}</h3>
      <p :class="{ taskComplete: task.is_complete }">
        {{ description }}
      </p>
      <div class=" d-flex gap-2 justify-content-center">
        
        <button class="btn btn-outline-warning w-100" @click="updateToggle">Editar</button>
        <button class="btn btn-outline-success w-100" @click="toggleComplete">
          Completar
        </button>
        <button class="btn btn-outline-danger w-100" @click="deleteTask">Elemintar</button>
        
      </div>
      <div class="d-flex flex-column gap-3 mt-3" v-if="inputUpdate">
        <input class="input-field" type="text" v-model="title" placeholder="Actualiza el título de la tarea" />
        <textarea class="input-field" style="height: 6rem" type="text"
          v-model="description"
          placeholder="Actualiza el discripcion de la tarea">
       </textarea>
              </div>
    </div>
  </div>
</div>
</template>

<script setup>
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  //retornamos fecha local para cada tarae usando metodo toLocaleString()
  return date.toLocaleString(); 
};
/* import { ref, onUpdated, watch } from "vue"; */
import { ref } from "vue";
import { useTaskStore } from "../stores/task";
/* import { supabase } from "../supabase"; */

const taskStore = useTaskStore();

// Props para obtener datos de tareas del componente Account.vue
const props = defineProps(["task"]);

// Extraemos datos de props
const title = ref(props.task.title);
const description = ref(props.task.description);
const inputUpdate = ref(false);

// Variables reactivas para almacenar datos
/* const name = props.task.title;
const description = props.task.description;
const inputUpdate = ref(false); */

/* const props = defineProps({
  task: Object,
}); */


const deleteTask = async () => {
  await taskStore.deleteTask(props.task.id);
};

// funcion basica para hacer un toggle a traves de un boton @click para cambiar la variable inputUpdate de false a true y con esto dejar ver en el DOM dichos inputs y el boton para hacerel update
const updateToggle = () => {
  inputUpdate.value = !inputUpdate.value;
};

// funcion que llama a funcion de la store task.js que se encarga de hacer una actualizacion de los datos de la tarea.
const updateTask = () => {
  const titleParam = title.value.trim();
  const descriptionParam = description.value.trim();
  taskStore.updateTask(props.task.id, titleParam, descriptionParam);
  taskStore.updateTask(task.id, title.trim(), description.trim());
  updateToggle();
};

const toggleComplete = () => {
  taskStore.completeTask(props.task.id, !props.task.is_complete);
};

</script>

<style>

</style>

