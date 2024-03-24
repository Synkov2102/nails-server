import userModel from "../models/user-model"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import mailService from "./mail-service"
import tokenService from "./token-service"
import UserDto from "../dtos/user-dto"

class UserService {
    async registration(email: string, password: string) {
        const candidates = await userModel.findOne({ email })

        if (candidates) throw new Error(`Пользователь с почтовым адресом ${email} уже сушествует`)
        const passwordHash = await bcrypt.hash(password, 3)

        const activationLink = uuidv4()


        const user = await userModel.create({ email, password: passwordHash })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
}

export = new UserService()