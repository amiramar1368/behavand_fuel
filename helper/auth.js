import jwt from "jsonwebtoken";

import { access_token_key, refresh_token_key } from "../config.js";
import {logger} from './winston.js';

export function check_authentication(req, res, next) {
  if (!req.isAuthenticated()) {
    res.render("login", { user: "", layout: "./layout/loginLayout.ejs" });
  } else {
    res.redirect("/home");
  }
}

export function authentication_token(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.logout(() => {});
    const length=(Object.keys(req.body)).length;
    if(length==0 && req.baseUrl!="/get-data" && req.baseUrl!="/edit-record"){
      return res.render("login", {
        user: "",
        fullname: "",
        request_number: 0,
        layout: "./layout/loginLayout.ejs",
      });
    }else{
      return res.json({ success: false, message: "لطفا مجددا لاگین نمایید" , info:"expireToken" });
    }
  }
  jwt.verify(token, access_token_key, (err, user) => {
    if (err) {
      logger.log("error",`authentication_token() : ${err}`)
      return res.render("login", {
        user: "",
        fullname: "",
        request_number: 0,
        deliver_number: 0,
        layout: "./layout/loginLayout.ejs",
      });
    }
    req.user = user;
    next();
  });
}
