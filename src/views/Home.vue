<template>
  <div class="wrapper">
    <NavBar />
    <div class="p-lg-5">
      <div
        v-if="isLoading"
        class="d-flex justify-content-center align-items-center container-ellipsis"
        style="height: 200px"
      >
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div v-else>
        <div class="d-flex flex-column align-items-center fade-in">
          <div class="text-center">
            <h3>Su <router-link to="/account">cuenta</router-link></h3>
            <p>La fecha de hoy es {{ fechaFormateada }}</p>
          </div>
          <NewTask />
        </div>
        <h1 class="text-center mt-5 mb-4">Tareas:</h1>
        <div class="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <TaskItem
            class="task-item fade-in"
            v-for="task in tasks"
            :key="task.id"
            :task="task"
          />
        </div>
      </div>
    </div>
    <!-- <div class="fade-in" v-if="hidden">
      <FooterBar />
    </div> -->
    <FooterBar />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useTaskStore } from "../stores/task";
import NewTask from "../components/NewTask.vue";
import NavBar from "../components/Nav.vue";
import FooterBar from "../components/Footer.vue";
import TaskItem from "../components/TaskItem.vue";
import { format } from "date-fns";

const taskStore = useTaskStore();
const isLoading = ref(true);
const hidden = ref(false);
const tasks = computed(() => taskStore.tasksArr);
const fechaFormateada = ref("");

onMounted(async () => {
  await taskStore.fetchTasks();
  // Obtener la fecha actual
  const fecha = new Date();
  // Formatear la fecha en el formato deseado (por ejemplo, "8th July 2023")
  const formatoFecha = format(fecha, "do MMMM yyyy");
  // Asignar la fecha formateada a la variable fechaFormateada
  fechaFormateada.value = formatoFecha;

  setTimeout(() => {
    isLoading.value = false;
    hidden.value = true;
  }, 2000);
});
</script>

<style></style>
