export const Fuel_model = (sequelize, { DataTypes }) => {
  const Fuel = sequelize.define(
    "fuel",
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
      machine_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  // sequelize.sync({ alter: true });

  
  Fuel.associate = (models) => {
    // associations can be defined here
    Fuel.belongsTo(models.User, {
      foreignKey: "created_by",
    });
  };

  return Fuel;
};
