const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users")
require("dotenv").config();

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5001;


app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("API está a funcionar!");
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexão realizada com sucesso!");
    app.listen(PORT, () => console.log(`Backend rodando em http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("Erro ao conectar com o MongoDB:", error);
  });

