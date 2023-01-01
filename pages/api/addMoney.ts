import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session) {
        const { amount, id } = req.body;
        console.log(amount, id);
        
        const user = await prisma.post.findUnique({
            where: {
                id: id
            }
        }).finally(async () => {
            await prisma.$disconnect()
        })
        if(user?.funding)   {
        const newFund = user?.funding + amount;
        const updatedUser = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                funding: newFund
            }
        }).then(() => {
                res.status(200).send('Success')
            }).catch((err) => {
                res.status(500).send    
            }).finally(async () => {
                await prisma.$disconnect()
            }
            
        )}
        if(user?.funding === null) {
            const newFund = amount;
            const updatedUser = await prisma.post.update({
                where: {
                    id: id
                },
                data: {
                    funding: newFund
                }
            }).then(() => {
                res.status(200).send('Success')
            }).catch((err) => {
                res.status(500).send    
            }).finally(async () => {
                await prisma.$disconnect()
            }
            )
        }
        

      
    } else {
        res.status(401).send('Unauthorized')
    }
}
