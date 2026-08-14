import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/jwt.js";
import { ComparePassword, hashPassword } from "../../utils/password.js";
import { AuthResponse, AuthUser } from "./auth.types.js";

export const registerUser = async (name:string,email:string,password:string):Promise<AuthUser> => {
const existingUser = await prisma.user.findUnique({
    where:{
        email
    },  
});
if(existingUser){
    throw new Error("User with this email already exists ");
}

const passwordHash = await hashPassword(password);

const user = await prisma.user.create({
    data:{
        name,email,passwordHash
    },
    select:{
        id:true,
        name:true,
        email:true,
    }
});

return user;
};

export const loginUser = async (
    email:string,password:string
):Promise<AuthResponse> => {
    const user = await prisma.user.findUnique({
        where:{email:email}
    });

    if(!user){
        throw new Error("Invalid email or password");
    }

    const passwordMatches = await ComparePassword(password,user.passwordHash);

    if(!passwordMatches){
        throw new Error("Invalid email or password");
    }

    const token = generateAccessToken(user.id);

    return {
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        },
        token
    };
};


export const getCurrentUser =  async (userId:string):Promise<AuthUser> => {
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        },
        select:{
            id:true,
            name:true,
            email:true
        }
    });
    if(!user){
        throw new Error("User not found");
    }

    return user;
}