import { model, Schema } from "mongoose";
import { IAuthProvider, isActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider:{type: String, required:true},
    providerId:{type: String, required:true}
},{
    versionKey: false,
    _id: false
})

const userSchema = new Schema<IUser>({

    name: {type: String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String},
    phoneNumber:{type: String},
    picture:{type: String},
    address:{type: String},
    isDeleted:{type: String, default:false},
    isActive: {
        type: String,
        enum: Object.values(isActive)
    },
    isVerified:{type:Boolean, default:false},
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    auths: [authProviderSchema],
   



},{
    timestamps: true,
    versionKey : false
})

export const User = model<IUser>("User",userSchema)