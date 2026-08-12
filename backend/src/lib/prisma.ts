import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";


const connectionString = process.env.DATABASE_URL;

if(!connectionString){
    throw new Error("Database url not found");
}

const adapter = new PrismaPg({
    connectionString
});


export const prisma = new PrismaClient({
    adapter
});