import Sequelize from "sequelize";
import { db } from "../config.js";

import { User_model } from "./user.js";


import {Create_primary_data} from '../controller/first-data-controller.js';


const create_db = new Sequelize("", db.username, db.password, {
  dialect: "mysql",
});
await create_db.query(`CREATE DATABASE IF NOT EXISTS ${db.name};`);

var sequelize = new Sequelize(db.name, db.username, db.password, {
  dialect: "mysql",
  host: db.host,
  port: db.port,
  operatorsAliases: "0",
  timezone: "+03:30",
});

//models
var models = {
  User: User_model(sequelize, Sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

setTimeout(()=>{
  Create_primary_data.user();
},20000);

export { models, sequelize };
