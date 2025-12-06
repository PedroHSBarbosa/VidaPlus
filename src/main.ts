import express, { urlencoded } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { mainRouter } from "./routers/vidaPlusRouters";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = express();

// Middleware de CSP relaxado para desenvolvimento
server.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  next();
});

server.use(cors());
server.disable("x-powered-by");
server.use(urlencoded({ extended: true }));
server.use(express.json());

// Servir arquivos estáticos
server.use(express.static(path.join(__dirname, "../public")));

// Rotas da API
server.use(mainRouter);

server.listen(process.env.PORT || 3000, () =>
  console.log("✅ Server rodando em http://localhost:3000")
);