const User = require("../model/user");

const findByIdUser = (id) => { return User.findById(id); }

const findAllUser = () => { return User.find(); }

const createUser = async (user) => {
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser)
    return null;
  else
    return User.create(user);
}

const updateUser = (id, user) => { return User.findByIdAndUpdate(id, user, { returnDocument: "after" }); }

const deleteUser = (id) => { return User.findOneAndDelete(id); }

module.exports = {
  findByIdUser,
  findAllUser,
  createUser,
  updateUser,
  deleteUser
}