export const User_model = (sequelize, { DataTypes }) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      family: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      personal_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {}
  );
  // sequelize.sync({ alter: true });

  User.associate = (models) => {
    // associations can be defined here
    // User.hasMany(models.Uesr_Good,{
    // });
  };

  return User;
};
