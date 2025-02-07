<template>
    <div class="post-container">
      <h1>Criar um novo post</h1>
      <form @submit.prevent="submitPost">
        <div class="form-group">
          <label for="title">Título do post:</label>
          <input
            id="title"
            type="text"
            v-model="title"
            placeholder="Adicione um título"
          />
        </div>
        <div class="form-group">
          <label for="image">Imagem:</label>
          <div class="image-upload">
            <input
              id="image"
              type="file"
              @change="handleImageUpload"
              accept="image/*"
            />
            <div class="image-preview" v-if="imagePreview">
              <img :src="imagePreview" alt="Preview da imagem" />
            </div>
          </div>
        </div>
        <button type="submit" class="submit-button">Publicar</button>
      </form>
    </div>
  </template>
  
  <script>
  import "./Post.css";
  
  export default {
    name: "Post",
    data() {
      return {
        title: "",
        image: null,
        imagePreview: null,
      };
    },
    methods: {
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.image = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      async submitPost() {
        if (!this.title || !this.image) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Erro: usuário não autenticado.");
        return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", this.title);
    formData.append("image", this.image);

    try {
        const response = await fetch("http://localhost:5001/api/posts", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao criar post.");
        }

        const post = await response.json();
        alert("Post criado com sucesso!");
        console.log("Novo Post:", post);

        // Resetar campos
        this.title = "";
        this.image = null;
        this.imagePreview = null;
    } catch (error) {
        console.error("Erro ao criar o post:", error);
        alert("Houve um erro ao criar o post.");
    }
      },
    },
  };
  </script>
  