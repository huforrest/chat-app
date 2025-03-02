const User = require('../models/user');

exports.getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

exports.getUserByName = async (username) => {
  const user = await User.findByName(username);
  return user;
};

exports.insertUser = async (username, password) => {
    try {
      const result = await User.insert(username, password);
      return result;
    } catch (err) {
      console.error('Error inserting data:', err);
      throw err; // 抛出错误以便处理
    }
};

exports.updateUserStatusById = async (status, id) => {
  try {
    const result = await User.updateStatusById(status, id);
    return result;
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err; // 抛出错误以便处理
  }
};