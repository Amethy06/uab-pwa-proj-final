<template>
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="logo">WebGram</router-link>

        <ul class="nav-links">
          <li>
            <router-link to="/"><img id="icon" src="@/assets/Home.svg"/></router-link>
          </li>
          <li v-if="auth && user && user._id">
            <router-link :to="`/profile/${user._id}`"><img id="icon" src="@/assets/Profile.svg"/></router-link>
          </li>
          <li v-if="auth">
            <router-link to="/post"><img id="icon" src="@/assets/Camera.svg"/></router-link>
          </li>
          <li><img src="@/assets/Separator.svg" id="icon"></li>
          <li v-if="auth">
            <span @click="handleLogout"><img id="icon" src="@/assets/Logout.svg"/></span>
          </li>
          <li v-else>
            <router-link to="/login"><img id="icon" src="@/assets/Login.svg"/></router-link>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script>
  import { computed, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/authStore";
  import "./NavBar.css"
  
  export default {
    name: "NavBar",
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
  
      const auth = computed(() => authStore.isAuthenticated);
      const user = computed(() => authStore.user ? authStore.user : null);
      

      const handleLogout = () => {
        authStore.logout();
        router.push("/login");
      };
      
      watch(user, (newUser) => {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    });

      return {
        auth,
        user,
        handleLogout,
      };
    },
  };
  </script>
  
  