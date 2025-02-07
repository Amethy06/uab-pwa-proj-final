<template>
  <div class="register-container">
    <h2>Crie uma Conta</h2>

    <form @submit.prevent="handleRegister" class="register-form">
      <input v-model="name" type="text" placeholder="Nome" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirme sua Senha" required />

      <button id="submit-button" type="submit">Registar</button>
    </form>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    <p>Já tem uma conta? <router-link to="/login">Entrar</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import "./Register.css"

export default {
  name: "Register",
  setup() {
    const router = useRouter();

    const name = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const errorMessage = ref("");
    const successMessage = ref("");

    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "As senhas não coincidem!";
        return;
      }

      try {
        const response = await axios.post("http://localhost:5001/api/auth/register", {
        username: name.value,
        email: email.value,
        password: password.value,
        });

        successMessage.value = "Registro realizado com sucesso!";
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        errorMessage.value = "Erro ao registrar. Verifique os dados.";
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      handleRegister,
      errorMessage,
      successMessage,
    };
  },
};
</script>