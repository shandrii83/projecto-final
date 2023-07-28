<template>
  <nav class="navbar navbar-expand-lg bg-primary">
    <div class="container-fluid">
      <img class="navbar-brand rounded-3" src="../../assets\img\logo1.png"/>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/"> Home </router-link>
          </li> -->
          <li class="nav-item">
            <router-link class="nav-link active text-warning" to="/">Tareas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active text-warning" to="/account"
              >Su cuenta</router-link
            >
          </li>
        </ul>
        <div class="d-flex align-items-center" role="search">
          <p class="me-2 mb-2 mb-lg-0 text-warning">Welcome, {{ userEmail }}</p>
          <button @click="signOut" class="btn btn-warning">Log out</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// import PersonalRouter from "./PersonalRouter.vue";
/* import { computed, ref } from "vue"; */

import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

const redirect = useRouter();
const userStore = useUserStore();
const userEmail = ref(userStore.user.email);

const signOut = async () => {
  try {
    await userStore.signOut();
    redirect.push({ path: "/auth/login" });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style>

</style>
