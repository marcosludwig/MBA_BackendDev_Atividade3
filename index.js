const express = require("express");
const mongoose = require("mongoose");
const authService = require ("./service/auth.service")
const jwt = require("jsonwebtoken");

const app = express();
const user = require("./router/user.router");

const connectToDatabase = require("./database/database");

connectToDatabase();

const port = 3000;
const secret = "6dea29590413f38456e7c2e7";

app.use(express.json());

app.use("/user", user);

app.get("/", (req, res) => {
  res.send("<html><body><h1>hello world</h1></body></html>");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginService(email);

    if (!user)
      return res.status(400).send({ message: "usuário não encontrado. tente novamente"});

    if (password != user.password)
      return res.status(400).send({ message: "senha inválida"});

    const token = authService.generateToken(user.id, secret);
    user.token = token;
    await authService.updateToken(user);
    console.log(user);

    res.status(200).send(user);
  }
  catch (err)
  {
    console.log(`erro: ${err}`);
    return res.status(500).send("erro no servidor. tente novamente mais tarde");
  }
});

app.post("/validate", async(req, res) => {
  const { email, token } = req.body;
  const user = await authService.loginService(email);

  if (!user)
    return res.status(400).send({ message: "usuário não encontrado. tente novamente"});

  if (token != user.token)
    return res.status(400).send({ message: "token incorreto ou expirado. tente novamente"});

  user.token = authService.generateToken(user.id, secret);

  await authService.updateToken(user);

  res.status(200).send(user);
});

app.get("/test-token", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).send({ message: "o token não foi informado!"});

  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res. status(401).send({ message: "token inválido"});

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res. status(401).send({ message: "token mal formatado"});

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      console.log(`erro: ${err}`);
      return res.status(500).send("erro no servidor. tente novamente mais tarde");
    }

    console.log(decoded);
    res.send(decoded);
  });
});

app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`);
});
