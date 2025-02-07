<template>
    <div class="photo-card">
      <img :src="photo.imageUrl" alt="Foto" class="photo" />
      <div class="photo-info">
        <p>
          <strong v-if="photo.userId && photo.userId.username">
            {{ photo.userId.username }}
          </strong>
          <span v-else>Utilizador desconhecido</span>
        </p>
        <p>{{ photo.caption }}</p>
      </div>
      <div class="photo-actions">
        <button 
        id="actions-button" 
        @click="toggleLike"
        :class="{ liked: photo.isLiked }">
          <img 
            id="icon" 
            :src="photo.isLiked ? require('@/assets/Liked.svg') : require('@/assets/Like.svg')" 
            @mouseover="photo.isHovered = true" 
            @mouseout="photo.isHovered = false"/>
            {{ photo.likes.length }} Like(s)</button>
        <button id="actions-button" @click="showCommentInput = !showCommentInput">Comentar</button>
      </div>
      <div v-if="showCommentInput" class="comment-section">
        <input v-model="comment" type="text" placeholder="Escreva um comentário..." />
        <button @click="submitComment" id="send">Enviar</button>
      </div>
      <div class="comments" v-if="photo.comments.length > 0">
        <h3>Comentários:</h3>
        <p v-for="comment in photo.comments" :key="comment._id">
          {{ comment.text }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import "./PhotoCard.css";
  
  export default {
    name: "PhotoCard",
    props: {
      photo: Object,
    },
    emits: ["likePhoto", "commentPhoto"],
    setup(props, { emit }) {
      const showCommentInput = ref(false);
      const comment = ref("");
  
      const submitComment = async () => {
        if (!comment.value) return;

        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username") || "Tu";

        const newComment = {
        _id: Date.now().toString(), 
        userId: { _id: userId, username}, 
        text: comment.value,
  };

        props.photo.comments = [...(props.photo.comments || []), newComment];

        emit("commentPhoto", { photoId: props.photo._id, comment: comment.value });
        comment.value = "";
      };

      const toggleLike = async () => {
  try {
    props.photo.isLiked = !props.photo.isLiked;

    const response = await emit("likePhoto", props.photo._id);

    if (response && response.likes) {
      props.photo.likes = response.likes;
      props.photo.isLiked = response.likes.includes("currentUser"); 
    }
  } catch (error) {
    console.error("Erro ao processar o like:", error);

    props.photo.isLiked = !props.photo.isLiked;
  }
};
  
      return {
        showCommentInput,
        comment,
        submitComment,
        toggleLike,
      };
    },
  };
  </script>
  