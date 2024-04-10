import companyModel, { ICompany } from "models/company-model";

class CompanyService {
    async addNew(company: ICompany) {
        const createdCompany = await companyModel.create(company)
        return createdCompany
    }
}

export = new CompanyService()