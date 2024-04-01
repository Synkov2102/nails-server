import request from "supertest"
import { app } from "../index"

describe("POST /api/registration", () => {
    describe("введена почта и пароль", () => {
        test("должен вернуть код 200", async () => {
            const response = await request(app).post("/api/registration").send({
                email: "test@gmail.com",
                password: "1234567890"
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("введена почта и пароль", () => {

    })

})