export default class ApiError extends Error {
    status: number;
    errors: any;

    constructor(status: number, message: string, errors = []) {
        super(message)
        Object.setPrototypeOf(this, ApiError.prototype);
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован")
    }

    static BadRequest(message: string, errors = []) {
        const err = new ApiError(400, message, errors)
        console.log("in exept", err instanceof ApiError)
        return err
    }
}