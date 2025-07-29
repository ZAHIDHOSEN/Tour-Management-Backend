import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}
 
export interface IAuthProvider{
    provider: string;
    providerId: string;
}

export enum isActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IUser {
    name: string;
    email: string;
    password ?: string;
    phoneNumber ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: isActive;
    isVerified ?: string;
    role: Role;
    auths: IAuthProvider[];
    booking ?:Types.ObjectId[]
    guides ?: Types.ObjectId[]
}