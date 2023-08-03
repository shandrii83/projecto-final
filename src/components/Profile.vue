<template>
  <div class="container p-5">
    <div class="d-flex flex-column justify-content-center align-items-center gap-4">
           <form v-if="inputUpdate" class="d-flex flex-column gap-4" action="">
        <div>
          <label for="">Full name</label>
          <input
            class="input-field-new-task"
            v-model="profile.full_name"
            placeholder="Full name"
            type="text"
          />
        </div>

        <div>
          <label for="">Biography</label>
          <textarea
            class="input-field-new-task"
            rows="10"
            cols="50"
            v-model="profile.bio"
            placeholder="Biography"
            type="text-area"
          ></textarea>
        </div>

        <div>
          <label for="">Website</label>
          <input
            class="input-field-new-task"
            v-model="profile.website"
            placeholder="Website"
            type="text"
          />
        </div>

        <div>
          <label for="">Location</label>
          <input
            class="input-field-new-task"
            v-model="profile.location"
            placeholder="Location"
            type="text"
          />
        </div>

        <button
          class="button btn btn-primary w-100"
          type="button"
          @click="updateProfile"
        >
          Actualizar perfil
        </button>
      </form>
      <div v-else>
        <div v-if="profile && !isLoading"> 
<!-- Agregar verificación para isLoading -->
          <h3>Name: {{ profile.full_name }}</h3>
          <h5>
            Website: <a target="_blank" :href="profile.website">{{ profile.website }}</a>
          </h5>
          <h5>Location: {{ profile.location }}</h5>
          <h5 class="">Bio: {{ profile.bio }}</h5>
        </div>
        <div v-else>
          <p>No profile available</p>
        </div>
      </div>
        <button class="button-edit button btn btn-warning " @click="editToggleProfile">
        Edit Profile
      </button>
           
    </div>
  </div>
</template>

<script setup>
/* import { ref, reactive, onMounted, computed } from "vue"; */
/* import { ref, onMounted,computed } from "vue"; */
import { useUserStore } from "../stores/user";
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from 'uuid';

const emits = defineEmits();
const props = defineProps();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const signUpUser = async () => {
  try {
    await userStore.signUp(email.value, password.value);
    // Después de un registro de cuenta exitoso, el usuario se agregará a la base de datos
  
  } catch (error) {
    console.error("Error de registro de usuario:", error.message);
  }
};




const inputUpdate = ref(false);
 const profile = ref(null);
 const isLoading = ref(false); // Agrega la variable isLoading
 
const getProfile = async () => {
  isLoading.value = true; // Establecer isLoading en verdadero antes de cargar datos
  const userData = await userStore.fetchUser();
  if (userData && userData.profile) {
    profile.value = userData.profile;
    // Si hay datos, establecemos  profile.value en userData.profile
    
  } else {
    // De lo contrario, establecemos profile.value en un objeto vacío
    profile.value = {
     user_id: supabase.auth.user().id,
     full_name: "",
     bio: "", 
     location: "", 
     website: "" };
    /* profile.value = { full_name: '', bio: '', location: '', website: '' }; */
  }
  isLoading.value = false;// Establecer isLoading en falso después de cargar datos
};


  
const editToggleProfile = () => {
  if (profile.value) {
    inputUpdate.value = !inputUpdate.value;
  }
};

const updateProfile = async () => {
  if (profile.value) {
  const updatedProfileData = {
    id: profile.value.id || uuidv4(),// Si no hay "id", establezca un nuevo identificador único
    user_id: profile.value.user_id, 
    full_name: profile.value.full_name,
    bio: profile.value.bio,
    location: profile.value.location,
    website: profile.value.website,
      };
 /*  console.log(updatedProfileData); */

// Проверяем существование записи с указанным user_id в таблице "profiles"
const { data, error } = await supabase
      .from("profiles")
      .upsert(updatedProfileData, { onConflict: ["user_id"] });

    editToggleProfile();
    if (error) {
      console.error(error);
    } else {
      console.log("Perfil actualizado correctamente");
      emits("updateProfileEmit", updatedProfileData);
  }
}else {
      // Если записи нет, выполняем вставку новой записи
      const { data, error } = await supabase.from("profiles").insert([updatedProfileData]);

      editToggleProfile();
      if (error) {
        console.error(error);
      } else {
        console.log("Perfil creado con éxito");
      }
    }
};

onMounted(() => {
  // Obtene el perfil de usuario al montar el componente
  getProfile();
});
</script>

<style scoped></style>