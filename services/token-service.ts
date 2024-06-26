import jwt from "jsonwebtoken"
import tokenModel from "../models/token-model"
import UserDto from "dtos/user-dto"



class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "60d" })
        return {
            accessToken,
            refreshToken
        }
    }

    async validateAccesToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as UserDto
            return userData
        } catch (e) {
            return null
        }
    }

    async validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as UserDto
            return userData
        } catch (e) {
            return null
        }
    }



    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({ user: userId, refreshToken })
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }
}

export = new TokenService()