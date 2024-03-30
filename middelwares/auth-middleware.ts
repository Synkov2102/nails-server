import ApiError from "../exeptions/api-error"
import tokenService from "../services/token-service"

export default async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) return next(ApiError.UnauthorizedError())

        const accessToken = authorizationHeader.split(" ")[1]
        if (!authorizationHeader) return next(ApiError.UnauthorizedError())

        const userData = await tokenService.validateAccesToken(accessToken);
        if (!userData) return next(ApiError.UnauthorizedError())

        req.user = userData
        next();
    }
    catch (e) {
        return next(ApiError.UnauthorizedError())
    }

}