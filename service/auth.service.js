
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const loginService = async (email) => { return await User.findOne({ email }); }

const generateToken = (userId, secret) => { return jwt.sign({ userId }, secret, { expiresIn: 86400 }); }

const updateToken = async (user) => { await User.updateOne({ _id: user._id }, { token: user.token }); }


module.exports = { loginService, generateToken, updateToken };