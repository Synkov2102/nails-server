import { validationResult } from "express-validator"
import ApiError from "../exeptions/api-error"
import { Request, Response, NextFunction } from "express"
import companyService from "../services/company-service"
import { ICompany } from "models/company-model"

class CompanyController {
    async addNew(req: Request<{}, {}, ICompany>, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Ошибка при валидации", errors.array()))
            }
            const { name, description, logoUrl, adress, location, phone } = req.body
            const companyData = await companyService.addNew({ name, description, logoUrl, adress, location, phone })

            return res.json(companyData)
        } catch (e) {
            next(e)
        }
    }
}

export = new CompanyController()