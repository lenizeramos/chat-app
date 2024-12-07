import { Router } from "express";
import { get404 } from "../controllers/errorController";

const router = Router();

router.use(get404);

export default router;