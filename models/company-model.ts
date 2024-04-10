import { Schema, model, Types } from "mongoose";

export interface ICompany {
    _id?: Types.ObjectId
    name: string
    description: string
    logoUrl?: string
    adress: string
    location: string
    phone?: string

}

const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    description: { type: String, unique: true, required: true },
    logoUrl: { type: String },
    adress: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String }
})

export default model<ICompany>("Company", CompanySchema);
