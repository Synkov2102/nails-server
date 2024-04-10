import { validationResult } from "express-validator"
import userService from "../services/user-service"
import ApiError from "../exeptions/api-error"
import { Request, Response, NextFunction } from "express"

const refrehTokenMaxAge = 30 * 24 * 60 * 60 * 1000

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refrehToken', userData.refreshToken, { maxAge: refrehTokenMaxAge, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)

            res.cookie('refrehToken', userData.refreshToken, { maxAge: refrehTokenMaxAge, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refrehToken } = req.cookies
            const token = await userService.logout(refrehToken)
            res.clearCookie("refreshToken")
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refrehToken } = req.cookies
            const userData = await userService.refresh(refrehToken)

            res.cookie('refrehToken', userData.refreshToken, { maxAge: refrehTokenMaxAge, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
}

export = new UserController()