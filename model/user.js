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
      unit: {
        type: DataTypes.STRING,
        defaultVAlue:"استخراج"
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      group: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
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
