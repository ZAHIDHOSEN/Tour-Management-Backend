import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}
 
export interface IAuthProvider{
    provider: "google" | "credential";
    providerId: string;
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IUser {
    _id ?: Types.ObjectId;
    name: string;
    email: string;
    password ?: string;
    phoneNumber ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: boolean;
    isActive ?: isActive;
    isVerified ?: boolean;
    role: Role;
    auths: IAuthProvider[];
    booking ?:Types.ObjectId[]
    guides ?: Types.ObjectId[]
    createdAt?:Date
}