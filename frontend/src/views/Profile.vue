<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-info">
      <div class="profile-pic-container">
        <img 
          :src="editProfilePic || user.profilePic || defaultProfilePic" 
          alt="Foto de perfil" 
          class="profile-pic"
        />
      </div>
      <div class="profile-details">
      <label for="profilePicInput" v-if="editingProfile" class="edit-profile-pic-button">
          <img src="@/assets/add-image.svg" alt="Editar imagem" class="add-icon" />
          Editar Imagem
          <input type="file" id="profilePicInput" @change="handleProfilePicChange" accept="image/*" hidden />
        </label>

        <div v-if="!editingProfile">
        <h2>{{ user.fullName || user.username}}</h2>
        <p class="bio">{{ user.bio || "Ainda não adicionou uma biografia" }}</p>
        <button @click="toggleEditProfile" class="edit-button">Editar Perfil</button>
      </div>

      <div v-else>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="username">Nome:</label>
            <input type="text" id="username" v-model="editUsername" placeholder="Digite o novo nome" />
          </div>
          <div class="form-group">
            <label for="bio">Biografia:</label>
            <textarea id="bio" v-model="editBio" placeholder="Escreva sua biografia"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="save-button">Guardar</button>
            <button type="button" @click="toggleEditProfile" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
    <div class="user-posts">
      <h3>Fotos publicadas:</h3>
      <div v-if="loadingPosts">A carregar...</div>
      <div v-else-if="posts.length === 0">Nenhum post encontrado.</div>
      <div v-else class="posts-grid">
        <div v-for="post in posts" :key="post._id" class="post-item">
          <img :src="post.imageUrl" alt="Post" class="post-image" />
          <button @click="deletePost(post._id)" class="delete-button"><img id="icon" src="@/assets/delete.svg"/>Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import "./Profile.css";

export default {
  name: "Profile",
  setup() {
    
    const route = useRoute();
    const router = useRouter();
    const user = ref({});
    const posts = ref([]);
    const loadingPosts = ref(true)
    

    const defaultProfilePic = computed(() => require("@/assets/default-profile.png"));

    const editingProfile = ref(false);
    const editUsername = ref("");
    const editBio = ref("");
    const editProfilePic = ref("");

    const fetchProfile = async () => {
      try {
        const userId = route.params.id;
        if (!userId) {
        console.error("ID do utilizador não encontrado na URL.");
        return;
      }

        const response = await axios.get(`http://localhost:5001/api/users/${userId}`);
        
        Object.assign(user.value, response.data)
        
        editUsername.value = user.value.fullName || user.value.username || "";
        editBio.value = user.value.bio || "";
        editProfilePic.value = user.value.profilePic || "";

        localStorage.setItem("user",JSON.stringify(user.value))
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        loadingPosts.value=true;
        const userId = route.params.id;
        const response = await axios.get(`http://localhost:5001/api/posts/user/${userId}`);
        posts.value = response.data;
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        loadingPosts.value = false;
      }
    };

    const handleProfilePicChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

        editProfilePic.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
    user.value.profilePic = e.target.result;
    };
  reader.readAsDataURL(file);

    };

    const toggleEditProfile = () => {
      editingProfile.value = !editingProfile.value;
    };

    const saveProfile = async () => {
  try {
    const userId = route.params.id;
    
    const updatedData = {
      fullName: editUsername.value,
      bio: editBio.value,
    };
    
    const response = await axios.put(`http://localhost:5001/api/users/${userId}/update`, updatedData);

    Object.assign(user.value = response.data);
    
    localStorage.setItem("user", JSON.stringify(response.data));

    if (editProfilePic.value instanceof File) {
      const formData = new FormData();
      formData.append("profilePic", editProfilePic.value);

      const imageResponse = await axios.put(
        `http://localhost:5001/api/users/${userId}/profile-pic`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      user.value.profilePic = `${imageResponse.data.profilePic}?t=${Date.now()}`;
      }

    localStorage.setItem("user", JSON.stringify(user.value));

    editingProfile.value = false;
    alert("Perfil atualizado com sucesso!");

    await fetchProfile();

  } catch (error) {
    console.error("Erro ao guardar alterações no perfil:", error);
    alert("Erro ao guardar alterações no perfil.");
  }
};


    const deletePost = async (postId) => {
      if (!confirm("Tem certeza que deseja excluir este post?")) return;
      try {
        const response = await axios.delete(`http://localhost:5001/api/posts/${postId}`);
        posts.value = posts.value.filter(post => post._id !== postId);
      } catch (error) {
        console.error("Erro ao eliminar o post:", error);
      }
    };

    const viewPost = (postId) => {
      router.push(`/post/${postId}`);
    };

    onMounted(() => {
      fetchProfile();
      fetchPosts();
    });

    watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProfile();
    fetchPosts();
  }
});

    return {
      user,
      posts,
      loadingPosts,
      defaultProfilePic,
      editingProfile,
      editUsername,
      editBio,
      editProfilePic,
      handleProfilePicChange,
      toggleEditProfile,
      saveProfile,
      deletePost,
      viewPost,
    };
  },
};
</script>
