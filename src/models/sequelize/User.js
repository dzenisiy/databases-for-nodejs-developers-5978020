import { hash } from "argon2";

export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await hash(user.password);
        }
      }
    }
  });

  User.prototype.setPassword = async function (plainPassword) {
    const hashedPassword = await hash(plainPassword);
    this.password = hashedPassword;
  }

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
  };
  return User;
};