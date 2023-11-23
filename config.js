export var db = {
  name: "fuel_db",
  username: "root",
  password: "123456",
  // password: "dispatch12",
  host: "localhost",
  port: 3306,
};

export var port = 8000;
export var groups = ["chad", "bis", "family", "test"];
export var roles = {
  ADMIN: "admin",
  ADMIN_EDARI: "admin-edari",
  ADMIN_HARDWARE: "admin-hardware",
  HARDWARE: "hardware",
  DRIVER: "driver",
  USER: "user",
};

export const access_token_key = process.env.ACCESS_TOKEN_kEY;
export const refresh_token_key = process.env.REFRESH_TOKEN_kEY;
