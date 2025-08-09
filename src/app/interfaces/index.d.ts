import { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express{
        interface Request {
            user:JwtPayload;
            file?: Express.Multer.File;
             files?: Express.Multer.File[]
        }
    }
}