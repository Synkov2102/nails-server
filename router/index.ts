import { Router } from "express"
import userController from "../controllers/user-controller"
import { body } from "express-validator"
import authMiddleware from "../middelwares/auth-middleware"

const router = Router()

//authorization
router.post("/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }),
    userController.registration)
router.post("/login",
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }),
    userController.login)
router.post("/logout", userController.logout)
router.get("/activate/:link", userController.activate)
router.get("/refresh", userController.refresh)
router.get("/users", authMiddleware, userController.getUsers)

export default router