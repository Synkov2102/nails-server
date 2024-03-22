import userModel from "models/user-model"
import bcrypt from "bcrypt"
import uuid from "uuid"
import mailService from "./mail-service"

class UserService {
    async registration(email: string, password: string) {
        const candidates = userModel.findOne({ email })
        if (candidates) throw new Error(`Пользователь с почтовым адресом ${email} уже сушествует`)
        const passwordHash = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        const user = await userModel.create({ email, password: passwordHash })
        await mailService.sendActivationMail(email, activationLink)
    }
}

export = new UserService()