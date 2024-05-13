const userService = require("../service/user.service");
const mongoose = require("mongoose");

// função 'checkUser' retorna 'true' ou 'false' se o conteúdo de 'body' estiver correto
// caso não esteja correto já envia uma mensagem de erro
const checkUser = (req, res) => {
  const user = req.body;
  const requiredFields = ['name', 'birthDay', 'email', 'password'];

  if (!user || Object.keys(user).length === 0) {
    res.status(400).send({ message: "corpo da mensagem está vazio" });
    return false;
  }

  const missingFields = requiredFields.filter((field) =>!user[field]);

  if (missingFields.length > 0) {
    res.status(400).send({ message: `os campos '${missingFields.join("', '")}' não foram encontrados` });
    return false;
  }

  return true;
}

// consulta usuário por 'id'
const findUser = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    const user = await userService.findByIdUser(id);

    if (!user)
      return res.status(404).send({ message: "usuário não foi encontrado" });

    return res.status(200).send(user);
  }
  catch(err) {
    console.log(`erro: ${err}`);
    return res.status(500).send("erro no servidor. tente novamente mais tarde");
  }
}

// consulta todos os usuários
const findAllUsers = async (req, res) => { return res.send(await userService.findAllUser()); }

// cria um usuário novo (se o campo 'id' não existir)
const createUser = async (req, res) => {
  try {
    if (!checkUser(req, res)) {
      return;
    }

    const user = req.body;
    const userRet = await userService.createUser(user)

    if (!userRet)
      return res.status(400).send({ message: "usuário com mesma chave já existe" });

    return res.status(201).send({ message: "usuário criado com sucesso" });
  }
  catch(err) {
    console.log(`erro: ${err}`);
    return res.status(500).send("erro no servidor. tente novamente mais tarde");
  }
}

// atualiza um usuário existente
const updateUser = async (req, res) => {
  try {
    if (!checkUser(req, res))
      return;

    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = req.body;

    const userRet = await userService.updateUser(id, user);

    if (!userRet)
      return res.status(404).send({ message: "usuário não foi encontrado" });

    res.status(200).send({ message: "usuário atualizado com sucesso" });
  }
  catch(err) {
    console.log(`erro: ${err}`);
    return res.status(500).send("erro no servidor. tente novamente mais tarde");
  }
}

// deleta um usuário existente
const deleteUser = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);

    const user = await userService.deleteUser(id);

    if (!user)
      return res.status(404).send({ message: "usuário não foi encontrado" });

    res.status(200).send({ message: "usuário deletada com sucesso" });
  }
  catch (err) {
    console.log(`erro: ${err}`);
    res.status(500).send("erro no servidor. tente novamente mais tarde");
  }
}


module.exports = { findUser, findAllUsers, createUser, updateUser, deleteUser };
