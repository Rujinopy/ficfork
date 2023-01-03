import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    const allEmails = await prisma.user.findMany({
        select: {
            email: true,
        }
        });
        const hashedPassword = await hash(password, 5);
    if ( email in allEmails) {
        if (password){
            res.status(400).json({ message: "Email already exists" });
        }

        else if (password === null) {
            const password = await prisma.user.update({
                data: {
                    password: hashedPassword,
                },
                where: {
                    email: email,
                },
            });
            res.status(200).json({ message: "Password updated" });
        }
        
    } else {
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                image: "blank_profile.png",
            },
        });
        res.status(200).json({ message: "User created" });
    }
}