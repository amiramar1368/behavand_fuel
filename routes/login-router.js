import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { access_token_key, refresh_token_key } from "../config.js";

import { authentication_token, check_authentication } from "../helper/auth.js";
import { Home, Login } from "../controller/admin-controler.js";

const router = new Router();


router.get("/", check_authentication);

router.get("/home", authentication_token, Home.main_page);
router.get("/remain-in-warehouse", authentication_token, Home.remain);

router.get("/user/register-user", authentication_token, Login.register);
router.post("/user/register-user", authentication_token, Login.register);

router.get("/logout", Login.logout);

router.get("/change-password", authentication_token, Login.change_password);
router.post("/change-password", authentication_token, Login.change_password);

router.get("/login-fail", (req, res) => {
  res.json({ success: false, message: "نام کاربری یا رمز عبور اشتباه می باشد" });
});

router.get("/login-success", async (req, res) => {
  const user = await req.user;
  const logined_user = {
    id: user.id,
    name: user.name,
    family: user.family,
    role: user.role,
    group: user.group,
  };
  const access_token = jwt.sign(logined_user, access_token_key, { expiresIn: "150m" });
  res.cookie("token", access_token, { maxAge: 150 * 60 * 1000, httpOnly: true });
  res.json({ success: true, message: "ورود موفق", user, access_token });
});

router.get("/login", check_authentication);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-fail",
    successRedirect: "/login-success",
  })
);

export default router;
