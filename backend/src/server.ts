import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("Bem-Vindo a EcoRota!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
