const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

const comparePassword = async (password, encryptedPassword) => {
  return await bcrypt.compare(password, encryptedPassword);
};

const generateToken = (userId, email, name) => {
  return jwt.sign(
    {
      name,
      userId,
      email
    },
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExist = await userModel.exists({ email: email.toLowerCase() });
    if (userExist) {
      return res.status(409).json({ message: 'E-mail already in use.' });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email: email.toLowerCase(),
      password: encryptedPassword,
      name
    });
    const accessToken = generateToken(newUser._id, newUser.email, newUser.name);

    res.status(201).json({
      email: newUser.email,
      name: newUser.name,
      accessToken
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (user) {
      if ((await comparePassword(password, user.password)) === true) {
        const accessToken = generateToken(user._id, user.email, user.name);
        return res.status(201).json({
          email: user.email,
          name: user.name,
          _id: user._id,
          accessToken
        });
      }
      return res.status(400).json({
        message: 'Password and Email mismatch,'
      });
    }
    return res.status(404).json({
      message: `User doesn't exist`
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error occurred. Please Try again.'
    });
  }
};
