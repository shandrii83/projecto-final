<template>
  <div class="container">
    <div class="d-flex flex-column justify-content-center align-items-center gap-4">
      <button class="button-edit button btn btn-warning" @click="editToggleProfile">
        Edit Profile
      </button>
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
        <div v-if="profile">
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
    </div>
  </div>
</template>

<script setup>
/* import { ref, reactive, onMounted, computed } from "vue"; */
import { ref, onMounted,computed } from "vue";
import { useUserStore } from "../stores/user";
import { supabase } from "../supabase";

const userStore = useUserStore();

const emit = defineEmits(["updateProfileEmit"]);
const inputUpdate = ref(false);
/* const props = defineProps({
  profile: {
    type: Object,
  },
  inputUpdate: {
    type: Boolean,
  },
}); */

//para el padre

/* const inputUpdate = ref(false); */

/* const editToggleProfile = () => {
  inputUpdate.value = !inputUpdate.value;
};
 */
 const profile = ref(null);

const getProfile = async () => {
  const userData = await userStore.fetchUser();
  if (userData && userData.profile) {
    profile.value = userData.profile;
    // Если данные есть, устанавливаем profile.value равным userData.profile
    
  } else {
    // В противном случае устанавливаем profile.value равным пустому объекту
    profile.value = { full_name: '', bio: '', location: '', website: '' };
  }
};


  
 /*  profile.value = userStore.profile || { full_name: '', bio: '', location: '', website: '' };
}; */
const editToggleProfile = () => {
  if (profile.value) {
    inputUpdate.value = !inputUpdate.value;
  }
};
/* const getProfile = async () => {
  await userStore.fetchUser();
  profile.value = userStore.profile;
}; */

const updateProfile = async () => {
  if (profile.value) {
  const updatedProfileData = {
    full_name: profile.value.full_name,
    bio: profile.value.bio,
    location: profile.value.location,
    website: profile.value.website,
  };
  console.log(updatedProfileData);
  const { data, error } = await supabase
    .from("profiles")
    .update(updatedProfileData)
    .eq("user_id", supabase.auth.user().id);
  editToggleProfile();
  if (error) {
    console.error(error);
  } else {
    console.log("Perfil actualizado correctamente");
    emit("updateProfileEmit", updatedProfileData);
  }
  }
};

/* onMounted(async () => {
  await userStore.fetchUser();
}); */
onMounted(() => {
  // Получаем профиль пользователя при монтировании компонента
  getProfile();
});
</script>

<style scoped></style>
