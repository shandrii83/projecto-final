<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/user.js";
import { ref } from "vue";
//test
const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(async () => {
  const appReady = ref(null);
  try {
    await userStore.fetchUser(); // aquí llamamos buscar usuario
    if (!user.value) {
      // Redirigirlas a cerrar sesión si el usuario no está ...
      appReady.value = true;
      router.push({ path: "/auth/login" });
    } else {
      const currentRoute = router.currentRoute.value;
      if (currentRoute) {
        router.push(currentRoute.fullPath);
      } else {
        router.push({ path: "/" });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
</script>

<style></style>