const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");
const { getPosts, likePost, commentPost } = require("../controllers/postController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});
const upload = multer({ storage });

router.get("/", getPosts);

router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar posts do usuário", error: error.message });
    }
  });

  router.post("/:id/like", async (req, res) => {
    try {
      const photoId = req.params.id;
      const userId = req.body.userId; 
      
      const photo = await Photo.findById(photoId);
      if (!photo) {
        return res.status(404).json({ message: "Foto não encontrada" });
      }
  
      const alreadyLiked = photo.likes.includes(userId);
  
      if (alreadyLiked) {
        photo.likes = photo.likes.filter((id) => id !== userId);
      } else {
        photo.likes.push(userId);
      }
  
      await photo.save();
  
      res.json({ likes: photo.likes });
    } catch (error) {
      console.error("Erro ao processar like:", error);
      res.status(500).json({ message: "Erro ao processar like" });
    }
  });

router.post("/:id/comment", commentPost);

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { userId, title } = req.body;

        if (!userId || !title || !req.file) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;

        const newPost = new Post({
            userId,
            imageUrl,
            caption: title,
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Erro ao criar post:", error);
        res.status(500).json({ message: "Erro ao criar post", error: error.message });
    }
});

router.delete("/:id", async (req, res) => {

    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
      }
      res.json({ message: "Post excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      res.status(500).json({ message: "Erro ao excluir post" });
    }
  });
  

module.exports = router;
