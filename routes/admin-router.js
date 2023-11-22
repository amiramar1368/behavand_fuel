import { Router } from "express";

import { authentication_token } from "../helper/auth.js";

import { User, } from "../controller/admin-controler.js";

const router = new Router();


router.get("/", authentication_token, User.add_user);
router.post("/", authentication_token, User.add_user);


export default router;
