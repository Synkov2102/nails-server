import request from "supertest"
import { app } from "../index"
import userModel from "../models/user-model"
import tokenModel from "../models/token-model"

const testCompany = {
    name: "Тест Кампания",
    description: "Лучшая компания",
    logoUrl: "https://avatars.mds.yandex.net/i?id=e4ce2c04277748031011cbaaccb877df188d9aca-10703102-images-thumbs&n=13",
    adress: "Дворцовая площадь, 2, Санкт-Петербург",
    location: "59.939864, 30.314566",
    phone: "89042176394"
}

const jwtRegexp = /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/

describe("POST /api/company", () => {
    describe("введены верные данные", () => {
        it("должен вернуть код 200", async () => {
            // const user = await userModel.findOneAndDelete({ email: testCompany.email })
            // if (user) await tokenModel.deleteOne({ user: user._id })

            const response = await request(app).post("/api/company").send(testCompany)

            console.log(response)
            expect(response.statusCode).toBe(200)
        })
    })
})