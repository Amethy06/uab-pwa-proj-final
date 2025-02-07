import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      console.log("Função login foi chamada com:", credentials);
      try {
        const { data } = await axios.post("http://localhost:5001/api/auth/login", credentials);
        console.log("Resposta da API no login:", data);
        
        if (!data.user || !data.token) {
          throw new Error("Resposta inválida do servidor");
        }
        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        console.log("Utilizador guardado no Local Storage:", localStorage.getItem("user")); // 🚀 Debug

      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    loadUserFromStorage() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        console.log("Utilizador Carregado no localStorage:", this.user)
      } else {
        this.user = null;
      }
    },    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
