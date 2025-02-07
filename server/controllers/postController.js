const Post = require("../models/Post");
const User = require("../models/User");

const getPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("userId", "username") 
        .sort({ createdAt: -1 });
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "Nenhum post encontrado." });
      }
  
      res.status(200).json(posts);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      res.status(500).json({ message: "Erro ao buscar posts", error: error.message });
    }
  };
  

const createPost = async (req, res) => {
    try {
      const { userId, title } = req.body;

      if (!userId || !title || !req.file) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }
     
      const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
      
      const newPost = new Post({ userId, imageUrl, caption:title, });
      await newPost.save();
  
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar post", error: error.message });
    }
  };
  
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    console.log(req.params);
    console.log(req.body);
    console.log("ID do Post:", id);

    if (!userId) 
    {return res.status(400).json({ message: "ID do usuário é obrigatório." });
}
    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({ message: "Post não encontrado" });
}
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
   
    await post.save();
    res.json({ message: "Like atualizado!", likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Erro ao curtir post", error: error.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    if (!userId || !text) return res.status(400).json({ message: "Preencha todos os campos." });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post não encontrado" });

    post.comments.push({ userId, text });
    await post.save();

    res.json({ message: "Comentário adicionado!", comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Erro ao comentar post", error: error.message });
  }
};

module.exports = { getPosts, createPost, likePost, commentPost };

