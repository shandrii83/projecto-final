import { defineStore } from "pinia";
import { supabase } from "../supabase";



export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    profile: null,
  }),
  actions: {
    async fetchUser() {
      const user = supabase.auth.user();
      if (user) {
        this.user = user;
        await this.fetchProfile(user.id);
      }
      return { user: this.user, profile: this.profile }; /// Devolver usuario y perfil
    },

    async fetchProfile(userId) {
      const { data: profileData, error } = await supabase
          .from("profiles")
          .select()
          .match({ user_id: userId });
          
          if (error) {
            console.error(error);
          } else if (profileData && profileData.length > 0) {
            this.profile = profileData[0];
          }else {
            // Si no hay datos de perfil, establezca el perfil en un objeto vacío
        this.profile = {
          user_id: userId,
          full_name: "",
          bio: "",
          location: "",
          website: "",
        };
          }
        },
    

    async signUp(email, password) {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (user) {
        this.user = user;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: this.user.id,
              username: email,
            },
          ]);

        if (profileError) {
          console.error(profileError);
        } else {
          if (profile) {
            this.profile = profile[0];
          }
        }
      }
    },
// Métodos para registrarse, iniciar sesión, cerrar sesión y otras acciones ...
    async signIn(email, password) {
      const { user, error } = await supabase.auth.signIn(
        {
          email: email,
          password: password,
        },
        {
          shouldCreateUser: false,
        }
      );
      if (error) throw error;
      if (user) {
        this.user = user;
        const { data: profile } = await supabase
          .from("profiles")
          .select()
          .match({ user_id: this.user.id });

        if (profile) this.profile = profile[0];
      }
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
    },
    async updateUser(updatedData) {
      this.profile = {
        ...this.profile,
        ...updatedData,
      };
    },
    // Add a new action to update the profile in the store and local storage
    async updateProfile(profileData) {
      this.profile = {
        ...this.profile,
        ...profileData,
      };
      // Save the updated profile data in the local storage
      localStorage.setItem("profile", JSON.stringify(this.profile));
    },

  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
      },
      // Add a new strategy to persist profile data separately
      {
        key: "profile",
        storage: localStorage,
        restore: (data) => {
          return JSON.parse(data) || null;
        },
      },
    ],
  },
});
