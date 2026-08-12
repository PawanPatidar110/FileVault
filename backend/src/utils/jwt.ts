import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}

export interface AccessTokenPayload {
    userId:string;
}


export const generateAccessToken = (userId:string):string => {
return jwt.sign({userId},JWT_SECRET,{
    expiresIn:'1h'
});
};

export const verifyAccessToken = (token:string) : AccessTokenPayload => {
    return jwt.verify(token,JWT_SECRET) as AccessTokenPayload;
}