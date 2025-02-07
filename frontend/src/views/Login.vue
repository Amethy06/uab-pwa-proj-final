<template>
    <div class="login-container">
      <h2>Entrar</h2>
  
      <form @submit.prevent="handleLogin" class="login-form">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
  
        <button id="submit-button" type="submit">Entrar</button>
      </form>
  
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  
      <p>Ainda não tem uma conta? <router-link to="/register">Registar</router-link></p>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import "./Login.css";
  import { useAuthStore } from "@/stores/authStore";
  
  export default {
    name: "Login",
    setup() {
      const router = useRouter();
  
      const email = ref("");
      const password = ref("");
      
      const authStore = useAuthStore();

      const errorMessage = ref("");
  
      const handleLogin = async () => {
  errorMessage.value = "";

  if (!email.value || !password.value) {
    errorMessage.value = "Por favor, preencha todos os campos.";
    return;
  }

  try {
    const response = await axios.post("http://localhost:5001/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    console.log("Resposta da API:", response.data); 

    if (response.data.token && response.data.user) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); 

      authStore.user = response.data.user; 
      authStore.token = response.data.token;

      console.log("Auth Store Atualizada:", authStore.user); 

      router.push("/");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    errorMessage.value =
      error.response?.data?.message || "Erro ao fazer login. Verifique as credenciais.";
  }
};

  
      return {
        email,
        password,
        handleLogin,
        errorMessage,
      };
    },
  };
  </script>