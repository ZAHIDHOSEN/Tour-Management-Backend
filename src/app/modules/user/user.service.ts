import { IUser } from "./user.interface";
import { User } from "./user.models";

const createUser = async(payload: Partial<IUser>) =>{

         const {name,email} = payload

        const user = await User.create({
            name,
            email
        })
        return user
}

const getAllUser = async() =>{
    const users = await User.find({})
    const totalUser = await User.countDocuments()
    return{
      data: users,
      meta:{
        total: totalUser
      }
    }
}
export const userServices = {
    createUser,
    getAllUser
    
}