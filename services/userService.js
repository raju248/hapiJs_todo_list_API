const { User } = require("../models");
const bcrypt = require("bcrypt");

class UserService {
  static async getUserById(userId) {
    return await User.findOne({
      where: {
        id: userId,
      },
    });
  }

  static async addUser(payload) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    let user = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    });

    return user;
  }

  static async getUserByEmail(email) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}

module.exports = UserService;
