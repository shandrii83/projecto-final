<template>
  <NavBar />
  <div class="container mt-5 d-flex justify-content-center align-items-center mb-5 gap-5 flex-column">
    <div>
      <div v-if="isLoading" class="" style="height: 200px">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div v-else>
        <div class="d-flex justify-content-center align-items-center flex-wrap gap-5 fade-in">
          <div class="avatar-container text-center">
            <img
              class="avatar mb-3"
              :src="profile.avatar_url"
              v-if="profile.avatar_url"
              alt="Profile picture"
            />
            <div>
              <input
                class="form-control mt-4"
                @change="fileManager"
                type="file"
              />
              <button class="button btn btn-primary w-100" @click="uploadFile">
                Upload File
              </button>
            </div>
          </div>
        </div>

        <Profile :profile="profile" @updateProfileEmit="hundleUpdateProfile" />
      </div>
    </div>
  </div>
  <FooterBar class="fixed-bottom"/>
</template>

<script setup>
import { supabase } from "../supabase";
import { reactive, ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/user";
import NavBar from "../components/Nav.vue";
import FooterBar from "../components/Footer.vue";
import Profile from "../components/Profile.vue";

// Define reactive variables
const file = ref();
const fileUrl = ref();
const isLoading = ref(true);
const profile = reactive({
  full_name: null,
  location: null,
  bio: null,
  website: null,
  avatar_url: null,
});

// Función de gestión de archivos
const fileManager = (event) => {
  file.value = event.target.files[0];
  console.log("Selected file:", file.value);
};

// Actualice el objeto de perfil con los datos proporcionados
const hundleUpdateProfile = (updatedProfileData) => {
  profile.value = { ...profile.value, ...updatedProfileData };
};

// Sube el archivo y actualiza el avatar_url
const uploadFile = async () => {
  if (!file.value) return;

  // Compruebe si el perfil está definido y contiene la propiedad avatar_url
  if (!profile.value) {
    profile.value = { avatar_url: null };
  }

  // Eliminar la imagen de avatar anterior del almacenamiento si existe

  const { data } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("user_id", supabase.auth.user().id);

  const deleteUrl = data[0].avatar_url;
  const { error: urlDeleteError } = await supabase.storage
    .from("profile-img")
    .remove([deleteUrl]);

  if (urlDeleteError) {
    console.error("Error al eliminar el archivo:", urlDeleteError);
    return;
  }
  console.log("Archivo eliminado con éxito del almacenamiento.");

  // Sube el nuevo archivo al almacenamiento
  const timestamp = Date.now();
  const filePath = `profiles/${timestamp}-${file.value.name}`;
  const { error: uploadError } = await supabase.storage
    .from("profile-img")
    .upload(filePath, file.value);

  if (uploadError) {
    console.error("Error al cargar el archivo:", uploadError);
    return;
  }
  console.log("Archivo subido correctamente.");

  // Obtener la URL pública del archivo recién subido

  const { data: urlData, error: urlError } = await supabase.storage
    .from("profile-img")
    .getPublicUrl(filePath);

  if (urlError) {
    console.error("Error al obtener la URL pública:", urlError);
    return;
  }

  fileUrl.value = urlData.publicURL;
  profile.avatar_url = fileUrl.value;
  console.log("URL de avatar actualizada:", fileUrl.value);

  // Actualice el avatar_url en la base de datos
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: fileUrl.value })
    .eq("user_id", supabase.auth.user().id);

  if (updateError) {
    console.error("Error al actualizar perfil:", updateError);
    return;
  }
  console.log("Perfil actualizado con éxito.");

  //  obtener el perfil de usuario actualizado después de la actualización
  await userStore.fetchUser();
};

// Obtener el perfil de usuario en el montaje del componente

const userStore = useUserStore();
const hidden = ref(false);

async function getProfile() {
  await userStore.fetchUser();
  const userProfile = userStore.profile;
  if (userProfile) {
    profile.avatar_url = userProfile.avatar_url;
    profile.full_name = userProfile.full_name;
    profile.location = userProfile.location;
    profile.bio = userProfile.bio;
    profile.website = userProfile.website;
  }

  // Simular un estado de carga durante 2 segundos
  setTimeout(() => {
    isLoading.value = false;
    hidden.value = true;
  }, 2000);
}

// Observe los cambios en el perfil de usuario y actualice el objeto de perfil reactivo
watch(
  () => userStore.profile,
  (updatedProfileData) => {
    if (updatedProfileData) {
      profile.value = { ...profile.value, ...updatedProfileData };
    }
  },
  { deep: true }
);

// Obtener el perfil de usuario en el montaje del componente
onMounted(() => {
  getProfile();
});
</script>


<style></style>