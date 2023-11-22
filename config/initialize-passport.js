import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import {models} from '../model/db.js';



export function initializePassport(passport) {
  async function authPassport(login, password, done) {
    const user = await models.User.findOne({ where: { login } });
    if (!user) {
      return done(null, false, { message: "کاربری با این مشخصات وجود ندارد" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: "نام کاربری یا رمز عبور صحیح نمی باشد" });
    } else{
        return done(null,user)
    }
  }

  passport.use(new LocalStrategy({ usernameField: "login" }, authPassport));

  passport.serializeUser((user,done)=>{
    return done(null,user.id);
  });
  passport.deserializeUser((id,done)=>{
    return done(null,models.User.findByPk(id));
  })
}
