// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { json } from 'stream/consumers'
import { compare, hash } from 'bcrypt';
import _logger from 'next-auth/utils/logger';
import { omit } from "lodash";
import { ok } from 'assert';

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {

        await handlePOST(res, req)
    }
    else {
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`,
        );}
}

async function handlePOST(res : NextApiResponse, req: NextApiRequest) {
    const user = await prisma.user.findUnique({
        where: { email: req.body.username},
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
            
        }
    })
    if (user) {
        if(user.password){
            //compare bvrypted password 
            console.log("now");
            const hashedPassword = await hash(req.body.password, 10);
            
            compare(req.body.password, user.password, (err: any, result: any) => {
                
                if(result == true){
                    res.status(200).json(omit(user, ["password"]))
                }
                else {
                    res.status(400).json({ message: "Password not found" })
                }
                
            })
        }
        else{
            res.status(400).json({ message: "Password not found" })
        }

    }
    else {
        res.status(400).json({ message: "User not found" })
    }
}

