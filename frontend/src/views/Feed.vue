<template>
  <div class="feed-container">
    <h2>Feed de Fotos</h2>

    <div v-if="loading">Carregando...</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="photo-list">
      <PhotoCard
        v-for="photo in photos"
        :key="photo._id"
        :photo="photo"
        @likePhoto="likePhoto"
        @commentPhoto="commentPhoto"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import PhotoCard from "@/components/PhotoCard.vue";
import "./Feed.css";

export default {
  name: "Feed",
  components: {
    PhotoCard,
  },
  setup() {
    const photos = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");

    const fetchPhotos = async () => {
      try {
    const response = await axios.get("http://localhost:5001/api/posts");

    if (!response.data || response.data.length === 0) {
      errorMessage.value = "Nenhum post disponível.";
      photos.value = [];
      return;
    }
    photos.value = response.data.map(photo => ({
      _id: photo._id,
      imageUrl: photo.imageUrl || "",
      caption: photo.caption || "Sem legenda",
      likes: photo.likes || [],
      comments: photo.comments || [],
      userId: photo.userId ? { username: photo.userId.username } : null, 
    }));
  } catch (error) {
    console.error("Erro ao carregar fotos:", error);
    errorMessage.value = "Erro ao carregar fotos.";
  } finally {
    loading.value = false;
  }
};
    const likePhoto = async (photoId) => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("ID do usuário não encontrado no localStorage.");
        }
        const photoIndex = photos.value.findIndex((photo) => photo._id === photoId);
        if (photoIndex === -1) return;

        const photo = photos.value[photoIndex];
        const hasLiked = photo.likes.includes(userId);

        const updatedLikes = hasLiked
        ? photo.likes.filter((id) => id !== userId)
        : [...photo.likes, userId];
        photos.value[photoIndex] = { ...photo, likes: updatedLikes };


        await axios.put(`http://localhost:5001/api/posts/${photoId}/like`, { userId });
      } catch (error) {
        console.error("Erro ao curtir a foto:", error);
      }
    };

  const commentPhoto = async ({ photoId, comment }) => {
  try {
    const response = await axios.post(`http://localhost:5001/api/posts/${photoId}/comment`, {
      userId: localStorage.getItem("userId"), 
      text: comment,
    });
    const updatedPhoto = response.data;
    photos.value = photos.value.map((photo) =>
      photo._id === photoId 
        ? { ...photo, comments: updatedPhoto.comments || [] } // Garante um array
        : photo
    );
  } catch (error) {
    console.error("Erro ao comentar na foto:", error);
  }
};

    onMounted(fetchPhotos);

    return {
      photos,
      loading,
      errorMessage,
      likePhoto,
      commentPhoto,
    };
  },
};
</script>
