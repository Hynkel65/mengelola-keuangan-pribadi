const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60; // 3 days
const saltRounds = 12;

const handleError = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    let errorsArray = Object.values(err.errors);
    errorsArray.forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  console.error(err);
  errors.general = "An unexpected error occurred";
  return errors;
};

const createTokens = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({ name, email, password: hashedPassword });
      const token = createTokens(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
      res.status(201).json({ user });
    } catch (err) {
      const errors = handleError(err);
      res.status(400).json({ errors });
    }
  } else {
    res.status(400).json({ errors: { confirmPassword: "Password doesn't match" } });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createTokens(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
    res.status(200).json({ user });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("jwt").status(204).json({ message: "Logged out successfully" });
};

module.exports.auth = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(401).json({ msg: "Login to Proceed" });
      } else {
        const user = await User.findById(decodedToken.id);
        if (user) {
          res.status(200).json({ msg: "User  Login Found" });
        } else {
          res.status(404).json({ msg: "User  not found" });
        }
      }
    });
  } else {
    res.status(401).json({ msg: "Login to Proceed" });
  }
};

module.exports.getuser = async (req, res) => {
  res.status(200).json({ user: req.user });
};