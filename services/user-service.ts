import userModel from "../models/user-model"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service"
import tokenService from "./token-service"
import UserDto from "../dtos/user-dto"
import ApiError from "../exeptions/api-error";

class UserService {
    async registration(email: string, password: string) {
        const candidates = await userModel.findOne({ email })

        if (candidates) throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже сушествует`)
        const passwordHash = await bcrypt.hash(password, 3)

        const activationLink = uuidv4()


        const user = await userModel.create({ email, password: passwordHash, activationLink })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async activate(activationLink: string) {
        const user = await userModel.findOne({ activationLink })
        if (!user) throw ApiError.BadRequest('Неккоректная ссылка активации')
        user.isActivated = true;
        await user.save();
    }

    async login(email: string, password: string) {
        const user = await userModel.findOne({ email })
        if (!user) throw ApiError.BadRequest('Пользователь с таким email не найден')

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) throw ApiError.BadRequest('Неверный пароль')

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
        const user = await userModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users
    }
}

export = new UserService()