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
    },
    async fetchProfile(userId) {
      const { data: profileData, error } = await supabase
        /* const { data: profile } = await supabase */
          .from("profiles")
          .select()
          .match({ user_id: userId });
          /* .match({ user_id: this.user.id }); */

          if (error) {
            console.error(error);
            return;
          }

          if (profileData && profileData.length > 0) {
            this.profile = profileData[0];
          }
        },
      /*   if (profile) this.profile = profile[0];
      }
    }, */

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
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
      },
    ],
  },
});
