import { Router } from "express";

import { authentication_token } from "../helper/auth.js";
import {  Fuel } from "../controller/admin-controler.js";

const router = new Router();


router.post("/import-files", authentication_token, Fuel.import_files);


export default router;
