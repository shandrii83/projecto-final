<!-- COMPONENTE BOILERPLATE -->

<template>
  <div class="container fade-in">
    <div class="row vh-100 justify-content-center align-items-center">
      <div class="col-auto p-2 text-center">
        <h4 class="text-primary  text-warning">Bienvenido!</h4>
        <div><img class="mb-3 img-fluid rounded "  src="\assets\img\logo1.png"  alt="" /></div>
        
        <h5>Sign In</h5>
        

        <form @submit.prevent="signIn" class="form-sign-in">
          <div class="form">
            <div class="form-input">
              <!-- <label class="input-field-label">E-mail</label> -->
              <input
                type="email"
                class="input-field w-100 mb-3"
                placeholder="Email"
                id="email"
                v-model="email"
                required
              />
            </div>
            <div class="form-input">
              <!-- <label class="input-field-label">Password</label> -->
              <input
                type="password"
                class="password input-field w-100 mb-3"
                placeholder="Password"
                id="password"
                v-model="password"
                required
              />
            </div>
            <button class="btn btn-warning w-100 mb-5 fs-1 fw-normal  text-primary" type="submit ">
              SING IN
            </button>
          </div>
        </form>

        <p>
          No tienes cuenta?
          <PersonalRouter
            :route="route"
            :buttonText="buttonText"
            class="sign-up-link"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PersonalRouter from "./PersonalRouter.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { ref, reactive } from "vue";
// Route Variables
const route = "/auth/signup";
const buttonText = "Sign Up";

// variables para conectarme al form (login)

const email = ref("");
const password = ref("");

// Router to push user once SignedIn to Home
const redirect = useRouter();


// creamos funcion de fletcha para Signin usuario a supaBase

const signIn = async () => {
  try {
    
    await useUserStore().signIn(email.value, password.value);
    // redirects user to the homeView
    redirect.push({ path: "/" });
  } catch (error) {
    alert("Error: Usuario no encontrado. Prueba registrarse de nuevo por favor!");
  }
};
</script>

<style>

</style>
