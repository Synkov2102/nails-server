import request from "supertest"
import { app } from "../index"
import userModel from "../models/user-model"
import tokenModel from "../models/token-model"

const testUser = {
    email: "test@gmail.com",
    password: "1234567890"
}
const jwtRegexp = /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/

describe("POST /api/registration", () => {
    describe("введена почта и пароль", () => {
        it("должен вернуть код 200", async () => {



            const user = await userModel.findOneAndDelete({ email: testUser.email })
            if (user) await tokenModel.deleteOne({ user: user._id })

            const response = await request(app).post("/api/registration").send(testUser)


            expect(response.statusCode).toBe(200)
            expect(response.body.accessToken).toMatch(jwtRegexp)
            expect(response.body.refreshToken).toMatch(jwtRegexp)
        })
    })
})