const fs = require("fs")
const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads/profile-pics");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage, limits: {
    fileSize: 10 * 1024 * 1024,
} });

router.put("/:id/profile-pic", upload.single("profilePic"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "Nenhuma imagem enviada." });
    }

    const imageUrl = `http://localhost:5001/uploads/profile-pics/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { profilePic: imageUrl },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
  
      res.json({ message: "Foto de perfil atualizada!", profilePic: updatedUser.profilePic });
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "O ficheiro é muito grande! O limite é 5MB." });
      }
      res.status(500).json({ message: "Erro ao atualizar foto de perfil." });
    }
});

router.put("/:id/update", upload.single("profilePic"), async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, bio } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { fullName, bio },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil." });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { username, bio } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(id, { username, bio }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilizador não encontrado." });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil." });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      const profilePic = user.profilePic
      ? user.profilePic
      : "http://localhost:5001/uploads/default-profile.png";

      res.json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profilePic,
      });
    } catch (error) {
      console.error("Erro ao procurar utilizador:", error);
      res.status(500).json({ message: "Erro ao procurar utilizador" });
    }
  });
  
  

module.exports = router;
