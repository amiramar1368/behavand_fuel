export const Driver_model = (sequelize, { DataTypes }) => {
  const Driver = sequelize.define(
    "driver_activity",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
    },
    {}
  );
  // sequelize.sync({ alter: true });

  
  Driver.associate = (models) => {
    // associations can be defined here
    Driver.belongsTo(models.User, {
      foreignKey: "driverId",
    });
  };

  return Driver;
};
