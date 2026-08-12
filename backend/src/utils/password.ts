import bcrypt from 'bcrypt';
const SaltRounds = 12;

export const hashPassword = async (password:string):Promise<string> => {
return  bcrypt.hash(password,SaltRounds);
}

export const ComparePassword = async (password:string,passwordHash:string):Promise<boolean> => {
return bcrypt.compare(password,passwordHash);
}