import { Schema, model } from "mongoose";

export interface IToken {
    _id: Schema.Types.ObjectId
    user: Schema.Types.ObjectId
    refreshToken: string
}

const TokenSchema = new Schema<IToken>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true }
})

export default model<IToken>("Token", TokenSchema);
