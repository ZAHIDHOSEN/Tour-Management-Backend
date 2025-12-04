import z from "zod";
import {  isActive, Role } from './user.interface';

 
 
 
export const createUserZodSchema = z.object({
         name: z.string()
         .min(2,{message: "name minimum 2 charactor"}).max(50,{message:"Name to long"}),
          email: z.string().email({message:"Invalid email address"}),
          password: z.string()
           .min(8, { message: "Password must be at least 8 characters" })
           .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, {
            message: "Password must contain uppercase, lowercase, number, and special character"
        }),

          phoneNumber :z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/,{message:"must be bangladeshi phone number"})
          .optional(),
          address : z.string().max(200,{message: "address Content must be 200 charactor"})
          .optional()


        
        
        
   }) 
export const updateUserZodSchema = z.object({
         name: z.string()
         .min(2,{message: "name minimum 2 charactor"}).max(50,{message:"Name to long"}).optional(),
         

          phoneNumber :z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/,{message:"must be bangladeshi phone number"})
          .optional(),
          address : z.string().max(200,{message: "address Content must be 200 charactor"})
          .optional(),
          role: z.enum(Object.values(Role) as [string]).optional(),
          isActive: z.enum(Object.values(isActive) as [string]).optional(),
          isDeleted: z.boolean().optional(),
          verified: z.boolean().optional()



        
        
        
   }) 