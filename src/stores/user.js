import { defineStore } from "pinia";
/* import { 
 } from "../stores/user.js"; */
import { supabase } from "../supabase";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    profile: null
  }),
  _actions: {
    async fetchUser() {
      const user = await supabase.auth.user();
      if (user) {
        this.user = user;
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .match({ user_id: this.user.id });

        if (profile) this.profile = profile[0];
        // console.log('user in store: ', this.user);
        // console.log('profile in store: ', this.profile);
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
          .from('profiles')
          .insert([
            {
              user_id: this.user.id,
              username: email
            }
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
      const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      },
        {
          shouldCreateUser: false,
        });
      if (error) throw error;
      if (user) {
        this.user = user;
        const { data: profile } = await supabase
          .from('profiles')
          .select()
          .match({ user_id: this.user.id });

        if (profile) this.profile = profile[0];
        // console.log('profile in store: ', profile);
      }
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  },
  get actions() {
    return this._actions;
  },
  set actions(value) {
    this._actions = value;
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
