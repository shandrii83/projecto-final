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
/* import { onMounted, ref, watch } from "vue"; */
import { useUserStore } from "../stores/user";
import NavBar from "../components/Nav.vue";
import FooterBar from "../components/Footer.vue";
import Profile from "../components/Profile.vue";

const file = ref();
const fileUrl = ref();

const fileManager = (event) => {
  file.value = event.target.files[0];
    console.log("Selected file:", file.value);
};

const hundleUpdateProfile = (updatedProfileData) => {
  profile.value = { ...profile.value, ...updatedProfileData };
};

const uploadFile = async () => {
    if (!file.value) return;
    // Asegúramos de que el perfil esté definido y contenga la propiedad avatar_url
    if (!profile.value) {
    profile.value = { avatar_url: null };
    
  }
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("user_id", supabase.auth.user().id);
      
  
    const deleteUrl = data[0].avatar_url;
    // console.log(deleteUrl);
    const { error: urlDeleteError } = await supabase.storage
      .from("profile-img")
      .remove([deleteUrl]);
  
    if (urlDeleteError) {
      console.error("Error deleting file:", urlDeleteError);
      return;
    }
    console.log("File succesfully upload.");
  
    const timestamp = Date.now();
    const filePath = `profiles/${timestamp}-${file.value.name}`;
    const { error: uploadError } = await supabase.storage
      .from("profile-img")
      .upload(filePath, file.value);
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return;
    }
    console.log("File succesfully upload.");
  
    const { data: urlData, error: urlError } = await supabase.storage
      .from("profile-img")
      .getPublicUrl(filePath);
    console.log(urlData);
    if (urlError) {
      console.error("Error getting public URL:", urlError);
      return;
    }
  
    fileUrl.value = urlData.publicURL;
    console.log(fileUrl.value);
  
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: fileUrl.value })
      .eq("user_id", supabase.auth.user().id);
  
    if (updateError) {
      console.error("Error updating profile:", updateError);
      return;
    }
    profile.value.avatar_url = fileUrl.value;
    console.log("Profile successfully updated.");
    
    await userStore.fetchUser();
    
    
  };

const userStore = useUserStore();
const isLoading = ref(true);
const hidden = ref(false);
const profile = reactive({
  full_name: null,
  location: null,
  bio: null,
  website: null,
  avatar_url: null,
});

async function getProfile() {
  await userStore.fetchUser();
  const userProfile = userStore.profile;
  if (userProfile) {
    profile.avatar_url = userProfile.avatar_url;
        profile.full_name = userProfile.full_name;
    profile.location = userProfile.location;
    profile.bio = userProfile.bio;
    profile.website = userProfile.website;

    /* profile.value = { ...profile.value, ...userProfile }; */
  }
  setTimeout(() => {
    isLoading.value = false;
    hidden.value = true;
  }, 2000);
}

watch(
  () => userStore.profile,
  (updatedProfileData) => {
    if (updatedProfileData) {
      profile.value = { ...profile.value, ...updatedProfileData };
    }
  },
  { deep: true }
);

onMounted(() => {
  getProfile();
});
</script>

<style></style>
