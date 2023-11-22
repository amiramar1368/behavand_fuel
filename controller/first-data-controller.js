import { models } from "../model/db.js";
import bcrypt from "bcrypt";

export class Create_primary_data {
  static async user() {
    const admin = await models.User.findOne({ where: { login: "admin" } });
    if (admin) {
      return;
    }
    var password = await bcrypt.hash("102030", 10);
    await models.User.create({
      created_by: 1,
      name: "admin",
      family: "-",
      personal_code: 123,
      login: "admin",
      group: "bis",
      role: "admin",
      password,
    });
  }

}
