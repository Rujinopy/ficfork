import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        const { amount, id } = req.body;
        const post = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                funding: {
                    increment: amount
                }
            }
        }).then(() => {
            res.status(200).send('Success')
        }).catch((err) => {
            res.status(500).send
        }).finally(async () => {
            await prisma.$disconnect()
        })
        

        // if(user?.funding)   {
        //     const newFund = user?.funding + amount;
        //     const updatedUser = await prisma.post.update({
        //         where: {
        //             id: id
        //         },
        //         data: {
        //             funding: newFund
        //         }
        //     }).then(() => {
        //             res.status(200).send('Success')
        //         }).catch((err) => {
        //             res.status(500).send    
        //         }).finally(async () => {
        //             await prisma.$disconnect()
        //         }
        //     )}

        // if(user?.funding === null) {
        //     const newFund = amount;
        //     const updatedUser = await prisma.post.update({
        //         where: {
        //             id: id
        //         },
        //         data: {
        //             funding: newFund
        //         }
        //     }).then(() => {
        //         res.status(200).send('Success')
        //     }).catch((err) => {
        //         res.status(500).send    
        //     }).finally(async () => {
        //         await prisma.$disconnect()
        //     }
        //     )
        // }

}
